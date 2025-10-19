export type TimeRecords = { starting?: number; finishing?: number };

export type Session = {
  name: string;
  records: TimeRecords[];
};
