"use client";
import { memo } from "react";
import { Check, X } from "lucide-react";

interface Props {
  chapter: number;
  old_text: string;
  new_text: string;
  onApprove: () => void;
  onReject: () => void;
}

export const EditApprovalCard = memo(function EditApprovalCard({
  chapter, old_text, new_text, onApprove, onReject
}: Props) {
  return (
    <div className="flex flex-col gap-3 p-4 my-2 border border-purple-200 bg-purple-50/50 rounded-xl shadow-sm text-sm">
      <p className="font-bold text-purple-800">
        🤖 AI suggests editing Chapter {chapter}:
      </p>
      <div className="space-y-2">
        <div>
          <span className="text-xs font-semibold text-rose-600 uppercase">Remove:</span>
          <p className="p-2 mt-1 bg-rose-50/80 text-rose-900 line-through rounded-md border border-rose-100">
            {old_text}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase">Replace with:</span>
          <p className="p-2 mt-1 bg-emerald-50/80 text-emerald-900 rounded-md border border-emerald-100">
            {new_text}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Check size={16} /> Approve
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
        >
          <X size={16} /> Reject
        </button>
      </div>
    </div>
  );
});