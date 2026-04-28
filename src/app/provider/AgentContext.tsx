"use client";

import React, {
  createContext,
  useContext,
  memo,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  useAgent,
  UseAgentUpdate,
  useCopilotKit,
} from "@copilotkit/react-core/v2";
import { AgentState } from "@/lib/types";
import { Role } from "@copilotkit/runtime-client-gql";

interface AgentContextType {
  state: AgentState;
  setState: (newStateOrUpdater: any) => void;
  running: boolean;
  sendMessage: (content: string) => void;
  nodeName: string | undefined;
  agent: any;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const defaultState: AgentState = {
  book: { title: "", topic: "", writingStyle: "", chapters: [] },
  sources: {},
  selectedChapterNumber: 1,
  logs: [],
  worker_task: "",
  worker_report: "",
  active_worker: "",
};

export const AgentProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const { agent } = useAgent({
      agentId: "dashboard",
      updates: [
        UseAgentUpdate.OnStateChanged,
        UseAgentUpdate.OnRunStatusChanged,
      ],
    });
    const { copilotkit } = useCopilotKit();
    const hasInitialized = useRef(false);

    const currentState = (agent.state as AgentState) || defaultState;
    useEffect(() => {
      if (!hasInitialized.current && agent) {
        if (!agent.state || Object.keys(agent.state).length === 0) {
          agent.setState(defaultState);
        }
        hasInitialized.current = true;
      }
    }, []);

    const isThinking = useMemo(() => {
      const messages = agent.messages || [];
      const lastMessage = messages[messages.length - 1];
      if (agent.isRunning && lastMessage?.role === Role.Assistant) {
        return false;
      }
      return agent.isRunning;
    }, [agent.isRunning, agent.messages]);

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

    const handleSetState = useCallback(
      (newStateOrUpdater: any) => {
        const currentAgentState = agent.state || defaultState;
        let finalState =
          typeof newStateOrUpdater === "function"
            ? newStateOrUpdater(currentAgentState)
            : newStateOrUpdater;
        agent.setState(finalState);
      },
      [agent],
    );

    const value = useMemo(
      () => ({
        state: currentState,
        setState: handleSetState,
        running: isThinking,
        sendMessage,
        nodeName: currentState?.active_worker || undefined,
        agent: agent,
      }),
      [currentState, handleSetState, isThinking, sendMessage],
    );

    return (
      <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
    );
  },
);

export const useLangChainAgent = () => {
  const context = useContext(AgentContext);
  if (!context)
    throw new Error("useLangChainAgent must be used within AgentProvider");
  return context;
};
