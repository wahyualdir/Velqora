"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text?: string;
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
  prefix?: string;
  highlightText?: string;
  highlightClassName?: string;
}

export function TypewriterText({
  text = "Velqora",
  speed = 120,
  deleteSpeed = 60,
  delay = 2000,
  loop = true,
  className = "",
  cursorClassName = "text-brand-500 animate-pulse",
  prefix = "Vel",
  highlightText = "qora",
  highlightClassName = "text-brand-500",
}: TypewriterTextProps) {
  const fullText = text;
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
      }
    } else {
      if (displayText.length < fullText.length) {
        timer = setTimeout(() => {
          setDisplayText((prev) => fullText.slice(0, prev.length + 1));
        }, speed);
      } else if (loop) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, fullText, speed, deleteSpeed, delay, loop]);

  // Split displayed text into prefix ("Wahyu") and highlight ("Study")
  const renderText = () => {
    if (!prefix || !highlightText) {
      return <span>{displayText}</span>;
    }

    const prefixLength = prefix.length;
    const currentPrefix = displayText.slice(0, prefixLength);
    const currentHighlight = displayText.slice(prefixLength);

    return (
      <>
        <span>{currentPrefix}</span>
        {currentHighlight && (
          <span className={highlightClassName}>{currentHighlight}</span>
        )}
      </>
    );
  };

  return (
    <span className={`inline-flex items-center ${className}`}>
      {renderText()}
      <span className={`ml-0.5 font-mono ${cursorClassName}`}>|</span>
    </span>
  );
}
