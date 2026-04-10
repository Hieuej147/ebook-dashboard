import { cn } from "@/lib/utils";
import { CheckIcon, LoaderCircle, LoaderPinwheel } from "lucide-react";

export function Progress({
  logs,
}: {
  logs: {
    message: string;
    done: boolean;
  }[];
}) {
  if (logs.length === 0) {
    return null;
  }

  return (
    <div
      data-test-id="progress-steps"
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden text-sm p-4">
        <div className="space-y-1">
          {logs.map((log, index) => {
            const isCurrent = index === logs.findIndex((l) => !l.done);
            const isActive = log.done || isCurrent;

            return (
              <div
                key={index}
                data-test-id="progress-step-item"
                className={cn(
                  "flex items-start gap-3 transition-opacity duration-200",
                  !isActive && "opacity-40",
                )}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-5 h-5 flex items-center justify-center rounded-full border shrink-0 mt-0.5",
                      log.done
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border",
                    )}
                    data-test-id={
                      log.done
                        ? "progress-step-item_done"
                        : "progress-step-item_loading"
                    }
                  >
                    {log.done ? (
                      <CheckIcon className="w-3 h-3 stroke-3" />
                    ) : (
                      <LoaderPinwheel
                        className={cn(
                          "w-3 h-3 text-primary",
                          isCurrent && "animate-spin",
                        )}
                      />
                    )}
                  </div>

                  {/* Đường kẻ nối giữa các bước */}
                  {index < logs.length - 1 && (
                    <div className="w-px h-6 bg-border my-1" />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <p
                    className={cn(
                      "text-sm leading-tight break-all",
                      log.done
                        ? "text-muted-foreground"
                        : "text-foreground font-medium",
                    )}
                  >
                    {log.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
