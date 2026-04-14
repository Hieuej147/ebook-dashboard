"use client";
import React, { createContext, useContext, memo } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/lib/types";

interface AgentContextType {
  state: AgentState;
  setState: (
    newState: AgentState | ((prevState: AgentState | undefined) => AgentState),
  ) => void;
  running: boolean;
  nodeName: string | undefined;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const INITIAL_AGENT_STATE: AgentState = {
  book: { title: "", topic: "", writingStyle: "", chapters: [] },
  sources: {},
  selectedChapterNumber: 1,
  logs: [],
  worker_task: "",
  worker_report: "",
  active_worker: "",
};

export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    state: coAgentState,
    setState: setCoAgentState,
    running,
    nodeName: NodeName,
  } = useCoAgent<AgentState>({
    name: "default",
    initialState: INITIAL_AGENT_STATE,
  });

  const value = React.useMemo(
    () => ({
      state: coAgentState,
      setState: setCoAgentState,
      running,
      nodeName: NodeName,
    }),
    [coAgentState, setCoAgentState, running, NodeName],
  );

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
};

export const useLangChainAgent = () => {
  const context = useContext(AgentContext);
  if (!context)
    throw new Error("useLangChainAgent must be used within AgentProvider");
  return context;
};
