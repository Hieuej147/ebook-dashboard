"use client";
import { CopilotKit } from "@copilotkit/react-core";

export default function CopilotProviderCustom({
  children,
  accessToken,
}: {
  children: React.ReactNode;
  accessToken?: string;
}) {
  const runtimeUrl = process.env.COPILOTKIT_RUNTIME_URL!;
  return (
    <CopilotKit
      runtimeUrl={runtimeUrl}
      headers={{
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      }}
      agent="dashboard"
    >
      {children}
    </CopilotKit>
  );
}
