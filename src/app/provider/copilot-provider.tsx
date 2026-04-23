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
      publicApiKey="ck_pub_6f1561376415dd4da1f9c672d224e147"
      agent="dashboard"
    >
      {children}
    </CopilotKit>
  );
}
