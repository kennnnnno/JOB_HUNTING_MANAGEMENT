"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, List, Calendar as CalendarIcon } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Company } from "@/lib/db";
import CalendarView from "../components/CalendarView";
import ListView from "../components/ListView";
import CompanyDetailModal from "../components/CompanyDetailModal";
import AddCompanyModal from "../components/AddCompanyModal";

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [mounted, setMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    endTime: "",
    type: "selection",
  });

  const companies = useLiveQuery(() => db.companies.toArray());
  const allEvents = useLiveQuery(() => db.events.toArray());
  const companyEvents = useLiveQuery(
    () =>
      db.events
        .where("companyId")
        .equals(selectedCompany?.id || -1)
        .toArray(),
    [selectedCompany],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const typeStyles: any = {
    selection: {
      bg: "#fee2e2",
      dot: "#ef4444",
      text: "#991b1b",
      label: "選考",
    },
    briefing: {
      bg: "#eff6ff",
      dot: "#3b82f6",
      text: "#1e40af",
      label: "説明会",
    },
    deadline: {
      bg: "#ffedd5",
      dot: "#f97316",
      text: "#9a3412",
      label: "締め切り",
    },
    result: {
      bg: "#f3e8ff",
      dot: "#a855f7",
      text: "#6b21a8",
      label: "合否連絡",
    },
  };

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleDeleteCompany = async (company: Company) => {
    if (!company.id) return;
    if (
      window.confirm(
        `「${company.name}」を削除しますか？\nすべての予定も消去されます。`,
      )
    ) {
      await db.events.where("companyId").equals(company.id).delete();
      await db.companies.delete(company.id);
      setSelectedCompany(null);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedCompany?.id || !eventForm.date) return;
    const finalTitle =
      eventForm.title.trim() || typeStyles[eventForm.type].label;
    await db.events.add({
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      title: finalTitle,
      date: eventForm.date,
      time: eventForm.time || undefined,
      endTime: eventForm.endTime || undefined,
      type: eventForm.type as any,
    });
    setEventForm({
      title: "",
      date: "",
      time: "",
      endTime: "",
      type: "selection",
    });
  };

  const calendarEvents = useMemo(() => {
    return allEvents?.map((ev) => ({
      id: String(ev.id),
      title: ev.title,
      start: ev.time ? `${ev.date}T${ev.time}` : ev.date,
      end: ev.endTime ? `${ev.date}T${ev.endTime}` : undefined,
      extendedProps: {
        companyId: ev.companyId,
        companyName: ev.companyName,
        type: ev.type,
      },
      backgroundColor: "transparent",
      borderColor: "transparent",
    }));
  }, [allEvents]);

  const handleSaveNew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();

    if (name) {
      const isDuplicate = companies?.some(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      );
      if (isDuplicate) {
        alert(`「${name}」は既に登録されています。`);
        return;
      }
      await db.companies.add({
        name,
        url: "",
        loginId: "",
        password: "",
        memo: "",
      });
      setIsAddModalOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-md mx-auto p-4 pb-32 bg-gray-50 min-h-screen font-sans relative">
      <header className="mb-8 pt-4 px-2">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">
          {activeTab === "list" ? "Enterprise" : "Calendar"}
        </h1>
        <p className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase mt-1">
          Job Hunting Management
        </p>
      </header>

      <main>
        {activeTab === "list" ? (
          <ListView companies={companies} onSelect={setSelectedCompany} />
        ) : (
          <CalendarView
            events={calendarEvents || []}
            typeStyles={typeStyles}
            onEventClick={(id) => {
              const c = companies?.find((x) => x.id === id);
              if (c) setSelectedCompany(c);
            }}
          />
        )}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-white/80 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[32px] p-2 flex justify-between items-center z-50">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 flex flex-col items-center gap-1 py-2 ${activeTab === "list" ? "text-blue-600" : "text-gray-300"}`}
        >
          <List size={24} strokeWidth={3} />
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-[22px] flex items-center justify-center -translate-y-6 border-4 border-gray-50 shadow-lg active:scale-90 transition-all"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`flex-1 flex flex-col items-center gap-1 py-2 ${activeTab === "calendar" ? "text-blue-600" : "text-gray-300"}`}
        >
          <CalendarIcon size={24} strokeWidth={3} />
        </button>
      </nav>

      {selectedCompany && (
        <CompanyDetailModal
          selectedCompany={selectedCompany}
          companyEvents={companyEvents}
          typeStyles={typeStyles}
          eventForm={eventForm}
          setEventForm={setEventForm}
          handleAddEvent={handleAddEvent}
          handleDeleteCompany={handleDeleteCompany}
          handleCopy={handleCopy}
          setSelectedCompany={setSelectedCompany}
          copyFeedback={copyFeedback}
        />
      )}

      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNew}
      />
    </div>
  );
}
