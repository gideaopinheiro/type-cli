import { table } from "table";
import { Storage } from "../storage";
import { Task } from "../types";
import { tableConfig } from "../utils/table-config";
import { formatDateString, formatTimeString } from "../utils/time-string";

export async function genReport() {
  await Storage.ensureFile();
  const tasks = await Storage.loadAllTasks();
  const reportTable: string[][] = [];
  for (const task of tasks) {
    calculateTotalMs(task, reportTable);
  }
  console.log(table(reportTable, tableConfig));
}

function calculateTotalMs(task: Task, reportTable: string[][]) {
  let totalMsPerDay = 0;
  let startDate: string = "";

  if (task.sessions.length > 0 && task.sessions[0]?.finishing) {
    startDate = formatDateString(task.sessions[0]?.starting!);
  }

  for (let index = 0; index < task.sessions.length; index++) {
    if (!task.sessions[index]?.finishing) {
      continue;
    }
    const date = formatDateString(task.sessions[index]?.starting!);
    if (date !== startDate) {
      reportTable.push([task.name, startDate, formatTimeString(totalMsPerDay)]);
      totalMsPerDay = 0;
      startDate = date;
    }
    totalMsPerDay +=
      task.sessions[index]?.finishing! - task.sessions[index]?.starting!;
  }
  if (totalMsPerDay > 0) {
    reportTable.push([task.name, startDate, formatTimeString(totalMsPerDay)]);
  }
}
