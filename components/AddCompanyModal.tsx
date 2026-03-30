"use client";

import React from "react";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddCompanyModal({
  isOpen,
  onClose,
  onSave,
}: AddCompanyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-[70]">
      <div className="bg-white w-full max-w-xs rounded-[40px] p-10 shadow-2xl">
        <h3 className="font-black text-xl mb-6 text-gray-800 text-center">
          企業を追加
        </h3>
        <form onSubmit={onSave} className="space-y-4">
          <input
            name="name"
            placeholder="企業名"
            required
            className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none text-sm"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all"
          >
            保存
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-gray-400 font-bold text-sm py-2 text-center"
          >
            閉じる
          </button>
        </form>
      </div>
    </div>
  );
}
