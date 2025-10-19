import { writeFile, readFile } from 'fs/promises';
import { Session } from './types';
import { DATA_FILE } from './constants/'

export class Storage {
  static registerSessionStart(data: any) {

  }

  private static async loadSessions() {
    try {
      const content = await readFile(DATA_FILE, "utf8");
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  private static async createSession() {
    const newSession: Session = {} as Session;
    await writeFile(DATA_FILE, JSON.stringify({}, null, 2))
  }
}
