"use client";

import React from "react";
import { User, Copy, Check, FileText, Sparkles } from "lucide-react";

export interface MessageAttachment {
  name: string;
  size: string;
}

export interface AIBubbleMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date | string;
  imageUrl?: string;
  fileAttachment?: MessageAttachment;
}

interface AIMessageItemProps {
  message: AIBubbleMessage;
  onCopy: (text: string, id: string) => void;
  isCopied: boolean;
}

export function AIMessageItem({ message, onCopy, isCopied }: AIMessageItemProps) {
  const isUser = message.sender === "user";
  const dateObj = typeof message.timestamp === "string" ? new Date(message.timestamp) : message.timestamp;
  const formattedTime =
    dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      : "";

  return (
    <article
      className={`flex gap-3 text-sm transition-all ${
        isUser ? "flex-row-reverse justify-start" : "flex-row justify-start"
      }`}
    >
      {/* Speaker Avatar Icon */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
          isUser
            ? "bg-surface-secondary border-border text-text-secondary"
            : "bg-brand-500/10 border-brand-500/20 text-brand-600 dark:text-brand-400"
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </div>

      {/* Message Content Container */}
      <div
        className={`space-y-2 max-w-[88%] sm:max-w-[80%] md:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* Attached Image Preview if any */}
        {message.imageUrl && (
          <div className="rounded-lg overflow-hidden border border-border max-w-xs">
            <img
              src={message.imageUrl}
              alt="Lampiran visual"
              className="max-h-48 w-auto object-cover"
            />
          </div>
        )}

        {/* Attached Document / Code File Preview if any */}
        {message.fileAttachment && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-mono text-text-secondary">
            <FileText className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="truncate max-w-[160px]">{message.fileAttachment.name}</span>
            <span className="text-[10px] text-text-tertiary">({message.fileAttachment.size})</span>
          </div>
        )}

        {/* Bubble Box */}
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed border ${
            isUser
              ? "bg-brand-500 text-white border-brand-600 shadow-2xs font-normal"
              : "bg-surface text-text-primary border-border shadow-2xs prose prose-sm dark:prose-invert max-w-none"
          }`}
        >
          <div className="whitespace-pre-wrap font-sans break-words">{message.text}</div>
        </div>

        {/* Footer Meta (Timestamp & Copy Action) */}
        <div
          className={`flex items-center gap-2 px-1 text-[11px] font-mono text-text-tertiary ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span>{formattedTime}</span>

          {!isUser && (
            <button
              type="button"
              onClick={() => onCopy(message.text, message.id)}
              className="inline-flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
              title="Salin jawaban AI"
              aria-label="Salin jawaban"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
