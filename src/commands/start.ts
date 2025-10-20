import { Storage } from '../storage'

export async function startSession(sessionName?: string) {
  if (!sessionName) {
    sessionName = "untitled";
  }
  await Storage.registerSessionStart(sessionName);
  return;
}
