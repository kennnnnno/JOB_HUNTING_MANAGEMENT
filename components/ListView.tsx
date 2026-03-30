"use client";

import React, { useState } from "react";
import { Company } from "@/lib/db";
import { Copy, Check, ExternalLink } from "lucide-react";

interface ListViewProps {
  companies: Company[] | undefined;
  onSelect: (company: Company) => void;
}

export default function ListView({ companies, onSelect }: ListViewProps) {
  const [copyId, setCopyId] = useState<number | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string | undefined, companyId: number) => {
    e.stopPropagation();
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopyId(companyId);
    setTimeout(() => setCopyId(null), 2000);
  };

  const handleOpenLink = (e: React.MouseEvent, url: string | undefined) => {
    e.stopPropagation();
    if (!url) return;
    const finalUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4">
      {companies?.map((company) => (
        <div
          key={company.id}
          onClick={() => onSelect(company)}
          className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.98] transition-all"
        >
          <div className="flex-1 overflow-hidden mr-4">
            <h3 className="text-lg font-black text-gray-800 truncate">
              {company.name}
            </h3>
            <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-wider truncate">
              {company.loginId ? `ID: ${company.loginId}` : "ID未登録"}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {company.url && (
              <button
                onClick={(e) => handleOpenLink(e, company.url)}
                className="p-3 bg-blue-50 text-blue-500 rounded-2xl active:scale-90 transition-all"
              >
                <ExternalLink size={18} />
              </button>
            )}

            {company.loginId && (
              <button
                onClick={(e) => handleCopyId(e, company.loginId, company.id!)}
                className={`p-3 rounded-2xl active:scale-90 transition-all ${
                  copyId === company.id
                    ? "bg-green-50 text-green-500 shadow-inner"
                    : "bg-gray-50 text-gray-400"
                }`}
              >
                {copyId === company.id ? <Check size={18} /> : <Copy size={18} />}
              </button>
            )}
          </div>
        </div>
      ))}
      {companies?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-300 font-bold text-sm">企業が登録されていません</p>
        </div>
      )}
    </div>
  );
}
