export type TimeRecords = { starting?: number; finishing?: number };

export type Task = {
  name: string;
  sessions: TimeRecords[];
};
