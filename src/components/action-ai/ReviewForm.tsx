"use client";
import { Button } from "../ui/button";
import { useHumanInTheLoop, ToolCallStatus } from "@copilotkit/react-core/v2";
import { z } from "zod";

interface ReviewFormProps {
  setIsOpen: (open: boolean) => void;
  setSteps: (step: number) => void;
}

export function ReviewForm({ setIsOpen, setSteps }: ReviewFormProps) {
  useHumanInTheLoop(
    {
      name: "review_Form",
      description:
        "Call this to let the user review the generated outline in the main Dialog before finalizing.",
      parameters: z.object({
        title: z.string().describe("The final title of the book"),
        chapterCount: z.number().describe("Total number of chapters generated"),
      }),
      render: ({ args, status, respond }) => {
        if (status === ToolCallStatus.Executing && respond) {
          return (
            <div className="p-4 border-2 border-blue-200 rounded-xl bg-blue-50/30 space-y-3 my-2 animate-in zoom-in-95">
              <h4 className="font-bold text-sm text-blue-700">
                Outline Ready! 📝
              </h4>
              <p className="text-xs text-slate-600">
                The outline is complete <strong>"{args.title}"</strong> Would
                you like to review it in Dialog to customize and save it?
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-semibold"
                  onClick={() => {
                    setIsOpen(true);
                    setSteps(2);
                    respond({ action: "review_in_dialog" });
                  }}
                >
                  Review in Dialog
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                  onClick={() => respond({ action: "cancel" })}
                >
                  Not now
                </Button>
              </div>
            </div>
          );
        }
        return null;
      },
    },
    [],
  );

  return null;
}