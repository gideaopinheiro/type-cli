#!/usr/bin/env node

import { globalData } from './constants/'

function start(sessionName?: string) {
  if (!sessionName) {
    sessionName = "untitled";
  }
  const session = globalData.find((ss) => ss.name === sessionName);
  if (session) {
    console.log("Já existe uma sessão iniciada com esse nome.");
    return;
  }
  globalData.push({ name: sessionName, records: [{ starting: Date.now() }] });
  console.log(`Session ${sessionName} started.\n`);
}

function finish(sessionName: string) {
  const session = globalData.find((ss) => ss.name === sessionName);
  if (!session) {
    console.log("Nenhuma sessão com esse nome.");
    return;
  }
  const pos = session.records.length > 0 ? session.records.length - 1 : 0;
  session.records[pos]!.finishing = Date.now();
  const totalTime =
    session.records[pos]!.finishing! - (session.records[pos]!.starting ?? 0);
  console.log("Tempo total em segundos: ", totalTime);
}

function report() {
  console.log(globalData);
}

const args = process.argv.slice(2, 4);
const command = args[0];
const sessionName = args[1];

switch (command) {
  case "s":
  case "start":
    start(sessionName);
    break;
  case "f":
  case "finish":
    finish(sessionName ?? "untitled");
    break;
  case "report":
    report();
    break;
  case "help":
  case "h":
  case undefined:
    console.log(`
    Usage: typec <command> <option>
    
    Available commands:
      start      [s] Start your session
      finish     [f] Finish your session
      report     [r] Show sessions report
      help       [h] Show this help message
        `);
    break;
  default:
    console.error(
      "command not found\nuse 'typec help' to see available commands\n"
    );
    process.exit(1);
}
