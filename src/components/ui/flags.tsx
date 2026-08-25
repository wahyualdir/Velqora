import React from "react";

interface FlagProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export function IndonesiaFlag({ className = "w-5 h-3.5", ...props }: FlagProps) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={`rounded-xs object-cover border border-white/20 shadow-sm shrink-0 ${className}`}
      {...props}
    >
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#e70011" d="M0 0h640v240H0z" />
        <path fill="#ffffff" d="M0 240h640v240H0z" />
      </g>
    </svg>
  );
}

export function USAFlag({ className = "w-5 h-3.5", ...props }: FlagProps) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={`rounded-xs object-cover border border-white/20 shadow-sm shrink-0 ${className}`}
      {...props}
    >
      <g fillRule="evenodd">
        {/* Red background */}
        <path fill="#bd3d44" d="M0 0h640v480H0z" />
        {/* White stripes */}
        <path
          fill="#ffffff"
          d="M0 36.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0zm0 73.9h640v36.9H0zm0 73.8h640v36.9H0z"
        />
        {/* Blue Canton */}
        <path fill="#192f5d" d="M0 0h288v258.5H0z" />
        {/* Simplified White Stars for USA Flag SVG */}
        <g fill="#ffffff">
          <g id="s18">
            <g id="s9">
              <g id="s5">
                <polygon points="24,16 28.7,30.5 11.5,18 36.5,18 19.3,30.5" />
                <polygon points="72,16 76.7,30.5 59.5,18 84.5,18 67.3,30.5" />
                <polygon points="120,16 124.7,30.5 107.5,18 132.5,18 115.3,30.5" />
                <polygon points="168,16 172.7,30.5 155.5,18 180.5,18 163.3,30.5" />
                <polygon points="216,16 220.7,30.5 203.5,18 228.5,18 211.3,30.5" />
                <polygon points="264,16 268.7,30.5 251.5,18 276.5,18 259.3,30.5" />
              </g>
              <polygon points="48,42 52.7,56.5 35.5,44 60.5,44 43.3,56.5" />
              <polygon points="96,42 100.7,56.5 83.5,44 108.5,44 91.3,56.5" />
              <polygon points="144,42 148.7,56.5 131.5,44 156.5,44 139.3,56.5" />
              <polygon points="192,42 196.7,56.5 179.5,44 204.5,44 187.3,56.5" />
              <polygon points="240,42 244.7,56.5 227.5,44 252.5,44 235.3,56.5" />
            </g>
            <use href="#s9" y="52" />
          </g>
          <use href="#s18" y="104" />
          <use href="#s5" y="208" />
        </g>
      </g>
    </svg>
  );
}
