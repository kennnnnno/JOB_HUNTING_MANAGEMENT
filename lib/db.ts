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

// lib/db.ts に追記
export const exportDatabase = async () => {
  const companies = await db.companies.toArray();
  const events = await db.events.toArray();
  const data = JSON.stringify({ companies, events });
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `job_hunt_backup_${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDatabase = async (file: File) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const { companies, events } = JSON.parse(e.target?.result as string);
      if (confirm("既存のデータに上書きしてインポートしますか？")) {
        await db.companies.clear();
        await db.events.clear();
        await db.companies.bulkAdd(companies);
        await db.events.bulkAdd(events);
        window.location.reload();
      }
    } catch (err) {
      alert("ファイルの形式が正しくありません");
    }
  };
  reader.readAsText(file);
};
