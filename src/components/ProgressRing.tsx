"use client";

import React from "react";

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number; // 0 to 100
  strokeColor?: string; // CSS color or custom class color
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  radius,
  stroke,
  progress,
  strokeColor = "stroke-accent-purple"
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          className="stroke-border-light/60 fill-transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Animated active progress circle */}
        <circle
          className={`${strokeColor} fill-transparent transition-[stroke-dashoffset] duration-700 ease-in-out`}
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {/* Percentage Center Text */}
      <span className="absolute text-xs font-bold text-primary font-display">
        {Math.round(progress)}%
      </span>
    </div>
  );
};
export default ProgressRing;
