// components/admin/CopilotSidebar.tsx
"use client";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";

export default function CopilotSidebar() {
  return (
    <aside className="w-80 ml-6 flex flex-col h-full">
      <GlassCard className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <span className="font-bold">CopilotKit Assistant</span>
          <div className="flex space-x-2 text-slate-400">
            <span>...</span>
            <span>X</span>
          </div>
        </div>

        {/* AI Chat History */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-sm ml-8">
            Hi, I can suggest content for your new chapters. Ready?
          </div>
          <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none text-sm mr-8">
            Summarize the text and follow suggestions.
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t">
          <div className="bg-white border rounded-xl p-2 flex items-center shadow-inner">
            <input
              className="flex-1 text-sm px-2 outline-none"
              placeholder="Type your message..."
            />
            <Button
              className="bg-indigo-600 p-2 rounded-lg text-white"
              onClick={() => {
                alert("Click me success!");
              }}
            >
              ➤
            </Button>
          </div>
        </div>
      </GlassCard>
    </aside>
  );
}
