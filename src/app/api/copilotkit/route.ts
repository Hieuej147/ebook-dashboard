// app/api/copilotkit/route.ts
import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";

const HONO_URL = process.env.HONO_URL || "http://localhost:3001";

export const POST = async (req: NextRequest) => {
  const session = await getSession();

  const response = await fetch(`${HONO_URL}/api/copilotkit`, {
    method: "POST",
    headers: {
      "Content-Type": req.headers.get("Content-Type") || "application/json",
      Authorization: session?.accessToken
        ? `Bearer ${session.accessToken}`
        : "",
    },
    body: req.body,
    // @ts-ignore
    duplex: "half", // cần cho streaming
  });

  return response;
};
