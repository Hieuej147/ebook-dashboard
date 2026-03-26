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

export const AgentProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const {
      state: coAgentState,
      setState: setCoAgentState,
      running,
      nodeName: NodeName,
    } = useCoAgent<AgentState>({
      name: "default",
      initialState: {
        book: { title: "", topic: "", writingStyle: "", chapters: [] },
        sources: {},
        selectedChapterNumber: 1,
        logs: [],
      },
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
  },
);

AgentProvider.displayName = "AgentProvider";

export const useLangChainAgent = () => {
  const context = useContext(AgentContext);
  if (!context)
    throw new Error("useLangChainAgent must be used within AgentProvider");
  return context;
};
