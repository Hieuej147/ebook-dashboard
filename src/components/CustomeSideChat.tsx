"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { useLangChainAgent } from "@/app/provider/AgentContext";
import {
  MessageCircle,
  X,
  Send,
  Square,
  RefreshCw,
  LoaderPinwheel,
} from "lucide-react";

const MyOpenIcon = () => <MessageCircle className="w-6 h-6 text-white" />;
const MyCloseIcon = () => (
  <X className="w-5 h-5 text-slate-500 hover:text-slate-800 transition-colors" />
);
const MySendIcon = () => <Send className="w-4 h-4 text-primary" />;
const MySpinner = () => (
  <LoaderPinwheel className="w-4 h-4 animate-spin text-blue-500" />
);
const MyStopIcon = () => (
  <Square className="w-4 h-4 fill-current text-slate-500" />
);
const MyRegenIcon = () => <RefreshCw className="w-4 h-4 text-slate-500" />;

// === 2. COMPONENT CHÍNH ===
export default function AdminChatSidebar() {
  const { state, setState } = useLangChainAgent();

  return (
    <CopilotSidebar
      defaultOpen={false}
      clickOutsideToClose={false}
      labels={{
        initial: "Hi! How can I assist you today?",
        title: "Book Assistant",
        placeholder: "Ask me anything...",
      }}
      icons={{
        openIcon: <MyOpenIcon />,
        closeIcon: <MyCloseIcon />,
        sendIcon: <MySendIcon />,
        spinnerIcon: <MySpinner />,
        stopIcon: <MyStopIcon />,
        regenerateIcon: <MyRegenIcon />,
      }}
      onSubmitMessage={async (message) => {
        setState({ ...state, logs: [] });
        await new Promise((resolve) => setTimeout(resolve, 30));
      }}
    />
  );
}
