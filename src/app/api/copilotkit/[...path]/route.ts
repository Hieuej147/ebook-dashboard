// app/api/copilotkit/[...path]/route.ts
import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";

const HONO_URL = process.env.HONO_URL || "http://localhost:3001";

async function forwardRequest(req: NextRequest, method: string) {
  const session = await getSession();

  // Lấy path sau /api/copilotkit/
  const pathname = req.nextUrl.pathname; // /api/copilotkit/info hoặc /api/copilotkit/agent/dashboard/connect
  const targetUrl = `${HONO_URL}${pathname}${req.nextUrl.search}`;

  const response = await fetch(targetUrl, {
    method,
    headers: {
      "Content-Type": req.headers.get("Content-Type") || "application/json",
      Accept: req.headers.get("Accept") || "*/*",
      Authorization: session?.accessToken
        ? `Bearer ${session.accessToken}`
        : "",
    },
    ...(method === "POST" && {
      body: req.body,
      // @ts-ignore
      duplex: "half",
    }),
  });

  return response;
}

export const GET = (req: NextRequest) => forwardRequest(req, "GET");
export const POST = (req: NextRequest) => forwardRequest(req, "POST");
