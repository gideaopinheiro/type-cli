import { writeFile, readFile } from 'fs/promises';
import { Session } from '../types';
import { DATA_FILE } from '../constants/'
import { existsSync } from 'fs';
import { formatTimeString } from '../utils/time-string';

export class Storage {
  private static async loadData<T>(): Promise<T> {
    try {
      const content = await readFile(DATA_FILE, "utf8")
      return JSON.parse(content);
    } catch {
      return [] as T;
    }
  }

  static async saveData<T>(data: T) {
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  }

  static async ensureFile() {
    if (!existsSync(DATA_FILE)) {
      await writeFile(DATA_FILE, JSON.stringify([], null, 2))
    }
  }

  static async loadAllSessions() {
    await this.ensureFile();
    return await this.loadData<Session[]>()
  }

  static async registerSessionFinish(sessionName: string) {
    await this.ensureFile();
    const sessions = await this.loadAllSessions();
    const finishingSession = sessions.find((s) => s.name === sessionName)
    if (!finishingSession) {
      console.log(`❌ Sessão ${sessionName} não existe.`)
      return;
    }
    const lastRecord = finishingSession.records[finishingSession.records.length - 1]
    if (lastRecord?.finishing) {
      console.log('⚠️  Sessão finalizada.\nInicie uma nova sessão para ${sessionName}.')
      return;
    }

    const end = Date.now();
    lastRecord!.finishing = end;
    finishingSession.records[finishingSession.records.length - 1]!.finishing = end;
    await this.saveData(sessions);

    const totalMs = (lastRecord!.finishing - (lastRecord!.starting ?? 0))
    console.log(`✅ Sessão ${sessionName} encerrada: ${formatTimeString(totalMs)}`);
    return;
  }

  static async registerSessionStart(sessionName: string) {
    await this.ensureFile();
    const sessions = await this.loadAllSessions();
    const existingSession = sessions.find((s) => s.name === sessionName)
    if (existingSession) {
      const lastRecord = existingSession.records[existingSession.records.length - 1]
      if (!lastRecord?.finishing) {
        console.log(`⚠️  Sessão ${sessionName} já foi iniciada!`)
        return;
      }
      existingSession.records.push({ starting: Date.now() })
    } else {
      sessions.push({
        name: sessionName,
        records: [{ starting: Date.now() }]
      })
    }
    await this.saveData(sessions);
    console.log(`🟢 Sessão '${sessionName}' iniciada.`);
  }
}
