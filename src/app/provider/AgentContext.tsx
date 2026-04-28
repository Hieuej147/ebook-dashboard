"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import {
  useAgent,
  UseAgentUpdate,
  useCopilotKit,
} from "@copilotkit/react-core/v2";
import { AgentState } from "@/lib/types";
import { Role } from "@copilotkit/runtime-client-gql";

interface AgentContextType {
  state: AgentState;
  running: boolean;
  sendMessage: (content: string) => void;
  nodeName: string | undefined;
  agent: any;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

// State mặc định dùng làm fallback nếu agent.state chưa có gì
const defaultState: AgentState = {
  book: { title: "", topic: "", writingStyle: "", chapters: [] },
  sources: {},
  selectedChapterNumber: 1,
  logs: [],
  active_worker: "",
};

export function AgentProvider({ children }: { children: React.ReactNode }) {
  // 1. Khởi tạo Agent nguyên bản
  const { agent } = useAgent({
    agentId: "dashboard",
    updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged],
  });
  const { copilotkit } = useCopilotKit();

  // 2. Ép kiểu (Type Casting) state gốc của Hook
  const state = (agent.state as AgentState) || defaultState;

  // 3. Helper gửi lệnh (vẫn cần vì v2 yêu cầu addMessage + runAgent)
  const sendMessage = useCallback(
    (content: string) => {
      agent.addMessage({
        id: crypto.randomUUID(),
        role: Role.User,
        content,
      });
      copilotkit.runAgent({ agent });
    },
    [agent, copilotkit],
  );

  // 4. Đóng gói Context Value siêu gọn
  const value = useMemo(
    () => ({
      state,
      running: agent.isRunning, // Dùng trạng thái gốc của thư viện
      nodeName: state?.active_worker || undefined,
      sendMessage,
      agent,
    }),
    [agent.state, agent.isRunning, sendMessage],
  );

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
}

export const useLangChainAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useLangChainAgent must be used within AgentProvider");
  }
  return context;
};
