import path from "path";
import os from "os";
import { Task } from "../types";

export const globalData: Task[] = [];
export const DATA_FILE = path.join(os.homedir(), ".timer-sessions.json");
