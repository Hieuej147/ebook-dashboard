"use client";
import { cn } from "@/lib/utils";
import { CheckIcon, LoaderCircle } from "lucide-react";

interface Log {
  message: string;
  done: boolean;
}

export function Progress({ logs }: { logs: Log[] }) {
  if (logs.length === 0) return null;

  return (
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="border border-slate-200 bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden text-sm p-4">
        <div className="space-y-0">
          {logs.map((log, index) => {
            const isActive = !log.done && (index === 0 || logs[index - 1].done);

            return (
              <div
                key={index}
                className={cn(
                  "flex gap-3 transition-opacity duration-300",
                  log.done || isActive ? "opacity-100" : "opacity-40",
                )}
              >
                <div className="relative flex flex-col items-center">
                  {/* Icon Circle */}
                  <div
                    className={cn(
                      "w-5 h-5 flex items-center justify-center rounded-full shrink-0 z-10 transition-colors duration-300",
                      log.done ? "bg-emerald-500" : "bg-purple-600",
                    )}
                  >
                    {log.done ? (
                      <CheckIcon className="w-3 h-3 text-white" />
                    ) : (
                      <LoaderCircle className="w-3 h-3 text-white animate-spin" />
                    )}
                  </div>

                  {/* Đường kẻ nối giữa các bước */}
                  {index < logs.length - 1 && (
                    <div className="w-[2px] h-6 bg-slate-100 -my-1" />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <p
                    className={cn(
                      "text-xs leading-5 transition-colors",
                      log.done
                        ? "text-slate-400 line-through decoration-slate-300"
                        : "text-slate-700 font-medium",
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
