import { writeFile, readFile } from "fs/promises";
import { Task } from "../types";
import { DATA_FILE } from "../constants/";
import { existsSync } from "fs";
import { formatTimeString } from "../utils/time-string";

export class Storage {
  private static async loadData<T>(): Promise<T> {
    try {
      const content = await readFile(DATA_FILE, "utf8");
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
      await writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
  }

  static async loadAllTasks() {
    await this.ensureFile();
    return await this.loadData<Task[]>();
  }

  static async registerSessionFinish(taskName: string) {
    await this.ensureFile();
    const tasks = await this.loadAllTasks();
    const finishingTaskSession = tasks.find((s) => s.name === taskName);
    if (!finishingTaskSession) {
      console.log(`❌ [${taskName}] Task não existe.`);
      return;
    }
    const lastRecord =
      finishingTaskSession.sessions[finishingTaskSession.sessions.length - 1];
    if (lastRecord?.finishing) {
      console.log(
        `⚠️ [${taskName}] Sessão finalizada.\nInicie uma nova sessão`
      );
      return;
    }

    const end = Date.now();
    lastRecord!.finishing = end;
    finishingTaskSession.sessions[
      finishingTaskSession.sessions.length - 1
    ]!.finishing = end;
    await this.saveData(tasks);

    const totalMs = lastRecord!.finishing - (lastRecord!.starting ?? 0);
    console.log(
      `✅ [${taskName}] Sessão encerrada: ${formatTimeString(totalMs)}`
    );
    return;
  }

  static async registerSessionStart(taskName: string) {
    await this.ensureFile();
    const sessions = await this.loadAllTasks();
    const existingTask = sessions.find((s) => s.name === taskName);
    if (existingTask) {
      const lastRecord =
        existingTask.sessions[existingTask.sessions.length - 1];
      if (!lastRecord?.finishing) {
        console.log(`⚠️ [${taskName}] A última sessão não foi finalizada!`);
        return;
      }
      existingTask.sessions.push({ starting: Date.now() });
    } else {
      sessions.push({
        name: taskName,
        sessions: [{ starting: Date.now() }],
      });
    }
    await this.saveData(sessions);
    console.log(`🟢 [${taskName}] Sessão iniciada.`);
  }
}
