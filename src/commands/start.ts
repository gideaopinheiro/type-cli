import { Storage } from "../storage";

export async function startSession(taskName?: string) {
  if (!taskName) {
    taskName = "untitled";
  }
  await Storage.registerSessionStart(taskName);
  return;
}
