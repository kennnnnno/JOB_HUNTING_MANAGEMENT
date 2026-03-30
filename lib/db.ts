// lib/db.ts
import Dexie, { Table } from "dexie";

export interface Company {
  id?: number;
  name: string;
  loginId: string;
  password?: string;
  url: string;
  memo: string;
}

export interface JobEvent {
  id?: number;
  companyId: number;
  companyName: string;
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  type: "selection" | "briefing" | "deadline" | "result"; // 種類を更新
}

export class MyDatabase extends Dexie {
  companies!: Table<Company>;
  events!: Table<JobEvent>;

  constructor() {
    super("JobHuntingDB");
    this.version(3).stores({
      companies: "++id, name",
      events: "++id, companyId, date, type",
    });
  }
}

export const db = new MyDatabase();
