"use client";

import { Company } from "@/lib/db";
import { ChevronRight, Globe } from "lucide-react";

export default function ListView({
  companies,
  onSelect,
}: {
  companies: Company[] | undefined;
  onSelect: (company: Company) => void;
}) {
  return (
    <div className="space-y-3 px-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {companies?.map((company) => (
        <div
          key={company.id}
          className="group flex items-center bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          {/* 左側：企業詳細ボタン（名前を大きく） */}
          <button
            onClick={() => onSelect(company)}
            className="flex-1 flex flex-col items-start px-6 py-5 text-left"
          >
            <h3 className="font-black text-gray-800 text-lg tracking-tighter">
              {company.name}
            </h3>
            <p className="text-[9px] font-bold text-blue-500 uppercase mt-0.5 flex items-center gap-0.5">
              View Details <ChevronRight size={10} />
            </p>
          </button>

          {/* 右側：URLリンクボタン（URLがある場合のみ） */}
          {company.url && (
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-full flex items-center justify-center px-6 border-l border-gray-100 text-gray-300 hover:text-blue-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe size={20} strokeWidth={2.5} />
            </a>
          )}
        </div>
      ))}

      {companies?.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-300 font-bold text-sm">
            No companies added yet.
          </p>
        </div>
      )}
    </div>
  );
}
