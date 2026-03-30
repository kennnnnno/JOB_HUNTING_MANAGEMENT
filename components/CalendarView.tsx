"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarView({
  events,
  typeStyles,
  onEventClick,
}: {
  events: any[];
  typeStyles: any;
  onEventClick: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 animate-in fade-in duration-500 overflow-hidden">
      <style jsx global>{`
        /* ヘッダー・ボタンの調整 */
        .fc .fc-toolbar {
          margin-bottom: 1.5em !important;
          padding: 0 8px;
        }
        .fc .fc-toolbar-title {
          font-size: 1.1rem !important;
          font-weight: 900 !important;
          color: #1f2937 !important;
        }
        .fc .fc-button {
          background-color: transparent !important;
          border: none !important;
          color: #374151 !important;
          box-shadow: none !important;
        }

        /* 曜日ヘッダー */
        .fc th {
          border: none !important;
          font-size: 10px;
          font-weight: 800;
          padding-bottom: 12px !important;
          text-transform: uppercase;
          color: #9ca3af;
        }

        /* 日付数字（「日」を消してスッキリさせる） */
        .fc .fc-daygrid-day-number {
          font-size: 12px;
          font-weight: 800;
          padding: 10px !important;
          color: #374151;
        }

        /* 今日のスタイル */
        .fc .fc-day-today {
          background: #f8fafc !important;
        }

        /* セル枠線を薄く */
        .fc td,
        .fc th {
          border: 1px solid #f9fafb !important;
        }
        .fc-theme-standard {
          border: none !important;
        }
        .fc .fc-scrollgrid {
          border: none !important;
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        // 「日」を消して数字のみにする
        dayCellContent={(args) => args.dayNumberText.replace("日", "")}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        events={events}
        height="auto"
        eventClick={(info) =>
          onEventClick(Number(info.event.extendedProps.companyId))
        }
        eventContent={(eventInfo) => {
          const style =
            typeStyles[eventInfo.event.extendedProps.type] ||
            typeStyles.selection;
          const rawCompany = eventInfo.event.extendedProps.companyName || "";
          const rawEvent = eventInfo.event.title || "";

          const companyName =
            rawCompany.length > 4
              ? rawCompany.substring(0, 4) + "…"
              : rawCompany;
          const eventTitle =
            rawEvent.length > 3 ? rawEvent.substring(0, 3) + "…" : rawEvent;

          return (
            <div
              className="flex flex-col w-full px-1 py-0.5 rounded-lg mb-0.5 cursor-pointer border shadow-sm"
              style={{
                backgroundColor: style.bg,
                borderColor: `${style.dot}30`,
              }}
            >
              <div
                className="text-[7px] font-black opacity-60 leading-none mb-0.5 tracking-tighter"
                style={{ color: style.text }}
              >
                {companyName}
              </div>
              <div
                className="text-[9px] font-black leading-none truncate"
                style={{ color: style.text }}
              >
                {eventTitle}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
