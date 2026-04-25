"use client";

import { useEffect } from "react";
import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { useLangChainAgent } from "@/app/provider/AgentContext";
import { Progress } from "./action-ai/Log";
import { Bot, MessageCircle, X } from "lucide-react";

// Hiệu ứng "Thinking" hỗ trợ Dark/Light Mode
const ChatGPTThinking = () => (
  <div className="flex items-center gap-2 p-4 ml-2 animate-in fade-in duration-500">
    <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-300 rounded-full animate-thinking-dot" />
    <span className="text-xs text-slate-400 dark:text-slate-300 font-medium tracking-wide">
      Assistant is thinking...
    </span>
  </div>
);

export default function AdminChatSidebar() {
  const { state, setState, running } = useLangChainAgent();

  useEffect(() => {
    if (running) {
      setState((prev: any) => ({ ...prev, logs: [] }));
    }
  }, [running, setState]);

  return (
    <CopilotSidebar
      defaultOpen={false}
      agentId="dashboard"
      labels={{
        welcomeMessageText: "Hi Hiếu! Ready to draft your next bestseller?",
      }}
      header={{
        className:
          "border-b border-purple-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm",
        titleContent: (props) => (
          <div
            {...props}
            className={`flex items-center gap-3 text-purple-700 dark:text-purple-300 ${props.className || ""}`}
          >
            <div className="p-2 bg-linear-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-none text-slate-800 dark:text-slate-100">
                AI Book Assistant
              </span>
              <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
        ),
      }}
      toggleButton={{
        className:
          "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl border-none transition-all duration-300 hover:scale-110",
        openIcon: <MessageCircle className="w-6 h-6 text-primary" />,
        closeIcon: <X className="w-6 h-6 text-primary" />,
      }}
      messageView={{
        className: "bg-slate-50/40 dark:bg-slate-950/40",
        children: ({ messageElements, interruptElement }) => (
          <div className="flex flex-col h-full">
            {messageElements}
            {running && <ChatGPTThinking />}

            {state.logs && state.logs.length > 0 && (
              <div className="my-4 px-4 animate-in fade-in slide-in-from-bottom-2">
                <Progress logs={state.logs} />
              </div>
            )}

            {interruptElement}
          </div>
        ),
      }}
    />
  );
}
