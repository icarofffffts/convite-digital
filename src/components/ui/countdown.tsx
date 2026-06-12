"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/utils";

interface Props {
  targetDate: string;
  colorClass?: string;
}

export function Countdown({ targetDate, colorClass = "text-orange-500" }: Props) {
  const [time, setTime] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (time.expired) {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-medium text-gray-500">O evento ja aconteceu!</p>
      </div>
    );
  }

  const blocks = [
    { label: "Dias", value: time.days },
    { label: "Horas", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Seg", value: time.seconds },
  ];

  return (
    <div className="py-4">
      <p className="text-center text-sm text-gray-400 uppercase tracking-wider mb-3">
        Faltam
      </p>
      <div className="grid grid-cols-4 gap-3">
        {blocks.map((block) => (
          <div key={block.label} className="text-center">
            <div className="bg-gray-50 rounded-2xl py-3 px-2">
              <span className={`text-2xl md:text-3xl font-bold ${colorClass}`}>
                {String(block.value).padStart(2, "0")}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{block.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
