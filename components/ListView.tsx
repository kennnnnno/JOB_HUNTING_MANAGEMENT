"use client";

import React from "react";
import { Company } from "@/lib/db";
import { Copy, Check } from "lucide-react";

interface ListViewProps {
  companies: Company[] | undefined;
  onSelect: (company: Company) => void;
}

export default function ListView({ companies, onSelect }: ListViewProps) {
  const [copyId, setCopyId] = React.useState<number | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string | undefined, companyId: number) => {
    e.stopPropagation();
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopyId(companyId);
    setTimeout(() => setCopyId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {companies?.map((company) => (
        <div
          key={company.id}
          onClick={() => onSelect(company)}
          className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.98] transition-all"
        >
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-800">{company.name}</h3>
            <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-wider">
              {company.loginId ? `ID: ${company.loginId}` : "ID未登録"}
            </p>
          </div>
          
          {company.loginId && (
            <button
              onClick={(e) => handleCopyId(e, company.loginId, company.id!)}
              className={`p-3 rounded-2xl transition-all ${
                copyId === company.id ? "bg-green-50 text-green-500" : "bg-gray-50 text-gray-400"
              }`}
            >
              {copyId === company.id ? <Check size={18} /> : <Copy size={18} />}
            </button>
          )}
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
