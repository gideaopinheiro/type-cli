import path from "path";
import { Session } from "../types";

export const globalData: Session[] = [];
export const DATA_FILE = path.join(process.cwd(), "sessions.json");
