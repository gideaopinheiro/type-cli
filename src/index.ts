#!/usr/bin/env node

import { endSessions } from './commands/end';
import { startSession } from './commands/start';
import { genReport } from './commands/report';

const args = process.argv.slice(2, 4);
const command = args[0];
const sessionName = args[1];

switch (command) {
  case "s":
  case "start":
    startSession(sessionName);
    break;
  case "f":
  case "finish":
    endSessions(sessionName);
    break;
  case "r":
  case "report":
    genReport();
    break;
  case "h":
  case "help":
  case undefined:
    console.log(`
    Usage: timer <command> <option>
    
    Available commands:
      start      [s] Start your session
      finish     [f] Finish your session
      report     [r] Show sessions report
      help       [h] Show this help message
        `);
    break;
  default:
    console.error(
      "command not found\nuse 'timer h' to see available commands\n"
    );
    process.exit(1);
}
