"use client";

import { useEffect, useState } from "react";

interface StatItemProps {
  label: string;
  value: number;
  percent: number;
  color: string;
}

export function StatItem({ label, value, percent, color }: StatItemProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percent); // 👉 animate tới percent
    }, 100);

    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="space-y-2">
      {/* Label + Value */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-purple-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${width}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
