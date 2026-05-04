// app/api/copilotkit/route.ts
import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";

const HONO_URL = process.env.HONO_URL || "http://localhost:3001";

async function forwardRequest(req: NextRequest, method: string) {
  const session = await getSession();
  const url = req.url.replace(
    /.*\/api\/copilotkit/,
    `${HONO_URL}/api/copilotkit`,
  );

  const response = await fetch(url, {
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
