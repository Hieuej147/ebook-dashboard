"use client";
import React, { createContext, useContext } from "react";
import { BookState } from "@/lib/type";
import { useAgent } from "@copilotkit/react-core/v2";

// Định nghĩa kiểu dữ liệu cho Context

const AgentContext = createContext<any>(null);

export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  // Khai báo useCoAgent duy nhất tại đây cho toàn bộ FE
  const { agent } = useAgent();

  return (
    <AgentContext.Provider value={agent}>{children}</AgentContext.Provider>
  );
};

// Hook để các component con lấy dữ liệu dễ dàng
export const useLangChainAgent = () => {
  const context = useContext(AgentContext);
  if (!context) throw new Error("useAgent must be used within AgentProvider");
  return context;
};
