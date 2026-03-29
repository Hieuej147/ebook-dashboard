import { getSession, Session } from "./session";
import { NextRequest, NextResponse } from "next/server";

export function withAuth(
  handler: (
    req: NextRequest,
    context: any,
    session: Session,
  ) => Promise<NextResponse>,
) {
  return async (req: NextRequest, context: any) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return handler(req, context, session);
  };
}
