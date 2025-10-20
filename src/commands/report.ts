import { Storage } from '../storage'
import { Session } from '../types';
import { formatTimeString } from '../utils/time-string';

export async function genReport() {
  await Storage.ensureFile()
  const sessions = await Storage.loadAllSessions();
  for (const session of sessions) {
    const totalMs = calculateTotalMs(session);
    console.log(`Session ${session.name}: ${formatTimeString(totalMs)}`);
  }
  return;
}

function calculateTotalMs(session: Session): number {
  let totalTimeMs = 0;
  for (let index = 0; index < session.records.length; index++) {
    if (!session.records[index]?.finishing) {
      break;
    }
    totalTimeMs += session.records[index]?.finishing! - session.records[index]?.starting!;
  }
  return totalTimeMs;
}
