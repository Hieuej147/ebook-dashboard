import { CopilotKitProvider } from "@copilotkit/react-core/v2";

export default function CopilotProviderCustom({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit">
      {children}
    </CopilotKitProvider>
  );
}
