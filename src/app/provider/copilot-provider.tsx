import { CopilotKit } from "@copilotkit/react-core";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";

export default function CopilotProviderCustom({
  children,
  accessToken,
  runtime,
}: {
  children: React.ReactNode;
  accessToken?: string;
  runtime: string;
}) {
  return (
    <CopilotKitProvider
      runtimeUrl={runtime}
      headers={{
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
