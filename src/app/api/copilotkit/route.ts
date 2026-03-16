import { getSession } from "@/lib/session";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  RemoteChain,
} from "@copilotkit/runtime";
import { LangGraphHttpAgent } from "@copilotkit/runtime/langgraph";
import { NextRequest, NextResponse } from "next/server";

const serviceAdapter = new ExperimentalEmptyAdapter();
const PYTHON_BASE_URL = process.env.DEPLOYMENT_URL || "http://localhost:8000";

export const POST = async (req: NextRequest) => {
  const session = await getSession();

  const runtime = new CopilotRuntime({
    agents: {
      default: new LangGraphHttpAgent({
        url: `${PYTHON_BASE_URL}/book-agent`,
        headers: session?.accessToken
          ? { authorization: `Bearer ${session.accessToken}` }
          : {},
      }),
    },
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
