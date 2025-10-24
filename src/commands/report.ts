import { Storage } from "../storage";
import { Task } from "../types";
import { formatTimeString } from "../utils/time-string";

export async function genReport() {
  await Storage.ensureFile();
  const tasks = await Storage.loadAllTasks();
  for (const task of tasks) {
    const totalMs = calculateTotalMs(task);
    console.log(`[${task.name}] Session: ${formatTimeString(totalMs)}`);
  }
  return;
}

function calculateTotalMs(task: Task): number {
  let totalTimeMs = 0;
  for (let index = 0; index < task.sessions.length; index++) {
    if (!task.sessions[index]?.finishing) {
      break;
    }
    totalTimeMs +=
      task.sessions[index]?.finishing! - task.sessions[index]?.starting!;
  }
  return totalTimeMs;
}
