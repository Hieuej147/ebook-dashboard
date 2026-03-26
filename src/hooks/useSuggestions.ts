import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

export function BookAgentSuggestions() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "Create Outline",
        message:
          "Help me create a 5-chapter book outline about 'AI in Modern Web Development'. After that call review form show me. ",
      },
      {
        title: "Write Chapter",
        message:
          "Please write the detailed content for Chapter 1 based on the current outline.",
      },
      {
        title: "Revenue Report",
        message: "Show me the revenue statistics and charts for this month.",
      },
      {
        title: "User Insights",
        message:
          "Can you provide a summary of new user registrations and premium account distribution?",
      },
      {
        title: "Inventory Check",
        message:
          "Check the book inventory and tell me if any books are running out of stock.",
      },
    ],
    available: "always",
  });

  return null;
}
