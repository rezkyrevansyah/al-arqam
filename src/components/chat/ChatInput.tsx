"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { SendHorizontal, Sparkles } from "lucide-react";

const MAX_MESSAGE_LENGTH = 500;
const COUNTER_WARNING_THRESHOLD = 400;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export interface ChatInputHandle {
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(function ChatInput(
  { onSendMessage, isLoading },
  ref
) {
  const [text, setText] = useState("");
  const [isMultiLine, setIsMultiLine] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollH, 110)}px`;
      setIsMultiLine(text.includes("\n") || scrollH > 44);
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setText("");
    setIsMultiLine(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const remaining = MAX_MESSAGE_LENGTH - text.length;
  const showCounter = text.length >= COUNTER_WARNING_THRESHOLD;

  return (
    <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] rounded-b-2xl">
      {/* Input Pill Container */}
      <div
        className={`flex gap-2 border border-stone-200/90 bg-stone-50 transition-all duration-200 shadow-xs focus-within:border-[hsl(var(--primary))] focus-within:bg-white focus-within:ring-2 focus-within:ring-[hsl(var(--primary))]/20 ${
          isMultiLine
            ? "items-end rounded-2xl p-2.5"
            : "items-center min-h-[48px] rounded-full pl-4 pr-1.5 py-1"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan ayat Al-Qur'an, doa, atau info masjid..."
          disabled={isLoading}
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          aria-label="Tulis pertanyaan Anda"
          className="flex-1 max-h-28 resize-none bg-transparent text-xs sm:text-sm leading-5 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-hidden disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          aria-label="Kirim pertanyaan"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-white shadow-xs transition-all hover:bg-[hsl(var(--primary))]/90 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/50"
          title="Kirim Pertanyaan"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Helper Footer */}
      <div className="mt-2 flex items-center justify-between px-2 text-[10.5px] text-[hsl(var(--muted-foreground))]">
        <span>
          {showCounter
            ? `${remaining} karakter tersisa`
            : "Tekan Enter untuk kirim • Shift+Enter baris baru"}
        </span>
        <div className="flex items-center gap-1 font-semibold text-[hsl(var(--primary))]/85">
          <Sparkles className="h-3 w-3 text-[hsl(var(--accent))]" />
          <span>Tanya Al-Arqam AI</span>
        </div>
      </div>
    </div>
  );
});
