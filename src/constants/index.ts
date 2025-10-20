import path from "path";
import os from "os"
import { Session } from "../types";

export const globalData: Session[] = [];
export const DATA_FILE = path.join(os.homedir(), ".timer-sessions.json");
