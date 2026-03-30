"use client";

import React, { useMemo } from "react";
import { X, Trash2, ExternalLink, Copy, Link as LinkIcon } from "lucide-react";
import { db, Company } from "@/lib/db";

interface CompanyDetailModalProps {
  selectedCompany: Company;
  companyEvents: any[] | undefined;
  typeStyles: any;
  eventForm: any;
  setEventForm: (form: any) => void;
  handleAddEvent: () => void;
  handleDeleteCompany: (company: Company) => void;
  handleCopy: (text: string, label: string) => void;
  setSelectedCompany: (company: Company | null) => void;
  copyFeedback: string | null;
}

export default function CompanyDetailModal({
  selectedCompany,
  companyEvents,
  typeStyles,
  eventForm,
  setEventForm,
  handleAddEvent,
  handleDeleteCompany,
  handleCopy,
  setSelectedCompany,
  copyFeedback,
}: CompanyDetailModalProps) {
  const sortedAndClassifiedEvents = useMemo(() => {
    if (!companyEvents) return [];

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const futureEvents: any[] = [];
    const pastEvents: any[] = [];

    companyEvents.forEach((ev) => {
      if (ev.date >= todayStr) {
        futureEvents.push(ev);
      } else {
        pastEvents.push(ev);
      }
    });

    futureEvents.sort((a, b) => a.date.localeCompare(b.date));
    pastEvents.sort((a, b) => b.date.localeCompare(a.date));

    return [...futureEvents, ...pastEvents];
  }, [companyEvents]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-end z-[60] p-0">
      <div className="bg-white w-full rounded-t-[48px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-black text-gray-800">
              {selectedCompany.name}
            </h2>
            {selectedCompany.url && (
              <a
                href={
                  selectedCompany.url.startsWith("http")
                    ? selectedCompany.url
                    : `https://${selectedCompany.url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-bold text-xs inline-flex items-center gap-1"
              >
                採用ページを開く <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteCompany(selectedCompany)}
              className="p-3 bg-red-50 text-red-400 rounded-full"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => setSelectedCompany(null)}
              className="p-3 bg-gray-100 text-gray-400 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 px-1">
            Events
          </h3>

          <div className="space-y-3 mb-6">
            {sortedAndClassifiedEvents.map((ev) => {
              const now = new Date();
              const todayStr = now.toISOString().split("T")[0];
              const isPast = ev.date < todayStr;

              return (
                <div
                  key={ev.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    isPast
                      ? "bg-gray-100/50 border-gray-100 opacity-60"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div
                    className={`w-1.5 h-10 rounded-full ${isPast ? "bg-gray-300" : ""}`}
                    style={
                      !isPast
                        ? { backgroundColor: typeStyles[ev.type]?.dot }
                        : {}
                    }
                  ></div>
                  <div
                    className={`flex-1 text-sm font-bold ${isPast ? "text-gray-400" : "text-gray-700"}`}
                  >
                    <div className="text-[10px] opacity-40">
                      {ev.date} {ev.time}
                      {ev.endTime ? `〜${ev.endTime}` : ""}
                    </div>
                    {ev.title}
                  </div>
                  <button
                    onClick={() =>
                      window.confirm("予定を削除しますか？") &&
                      db.events.delete(ev.id!)
                    }
                    className="p-2 text-gray-300 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            {sortedAndClassifiedEvents.length === 0 && (
              <p className="text-center py-4 text-xs font-bold text-gray-300 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                予定がありません
              </p>
            )}
          </div>

          <div className="bg-blue-50/30 p-5 rounded-[32px] border border-blue-100/50 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="p-3 bg-white rounded-xl text-xs font-bold outline-none"
                value={eventForm.date}
                onChange={(e) =>
                  setEventForm({ ...eventForm, date: e.target.value })
                }
              />
              <select
                className="p-3 bg-white rounded-xl text-xs font-bold outline-none"
                value={eventForm.type}
                onChange={(e) =>
                  setEventForm({ ...eventForm, type: e.target.value as any })
                }
              >
                {Object.entries(typeStyles).map(([k, s]: any) => (
                  <option key={k} value={k}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-bold text-gray-400 ml-1">
                  START
                </span>
                <input
                  type="time"
                  className="p-3 bg-white rounded-xl text-xs font-bold"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, time: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-bold text-gray-400 ml-1">
                  END
                </span>
                <input
                  type="time"
                  className="p-3 bg-white rounded-xl text-xs font-bold"
                  value={eventForm.endTime}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <input
              placeholder="内容（任意）"
              className="w-full p-3 bg-white rounded-xl text-xs font-bold outline-none"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
            />
            <button
              onClick={handleAddEvent}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all"
            >
              予定を追加
            </button>
          </div>
        </div>

        <div className="mb-6 bg-gray-50 p-6 rounded-[32px]">
          <span className="text-[10px] font-black text-gray-300 uppercase px-1 block mb-3">
            Entry Sheet / Notes
          </span>
          <textarea
            className="w-full p-4 bg-white rounded-2xl text-sm font-bold outline-none min-h-[180px] resize-none border border-transparent focus:border-blue-100 transition-all"
            placeholder="提出した内容や、面接での受け答えをメモ..."
            defaultValue={selectedCompany.memo}
            onBlur={(e) =>
              db.companies.update(selectedCompany.id!, { memo: e.target.value })
            }
          />
        </div>

        <div className="space-y-3 bg-gray-50 p-6 rounded-[32px] mb-10">
          <div className="flex justify-between px-1">
            <span className="text-[10px] font-black text-gray-300 uppercase">
              My Page Info
            </span>
            {copyFeedback && (
              <span className="text-[10px] text-blue-500 font-bold">
                {copyFeedback} copied!
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
              <LinkIcon size={16} />
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-200"
              defaultValue={selectedCompany.url}
              placeholder="URL"
              onBlur={(e) =>
                db.companies.update(selectedCompany.id!, {
                  url: e.target.value,
                })
              }
            />
          </div>
          <div className="relative text-gray-400">
            <input
              className="w-full pl-4 pr-12 py-3 bg-white rounded-xl text-sm font-bold outline-none"
              defaultValue={selectedCompany.loginId}
              placeholder="ID"
              onBlur={(e) =>
                db.companies.update(selectedCompany.id!, {
                  loginId: e.target.value,
                })
              }
            />
            <button
              onClick={() => handleCopy(selectedCompany.loginId || "", "ID")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="relative text-gray-400">
            <input
              className="w-full pl-4 pr-12 py-3 bg-white rounded-xl text-sm font-bold outline-none"
              defaultValue={selectedCompany.password}
              placeholder="PW"
              onBlur={(e) =>
                db.companies.update(selectedCompany.id!, {
                  password: e.target.value,
                })
              }
            />
            <button
              onClick={() => handleCopy(selectedCompany.password || "", "PW")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
