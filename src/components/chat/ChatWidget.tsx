"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, MessageCircle, X } from "lucide-react";
import type { AlArqamUIMessage } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput, type ChatInputHandle } from "./ChatInput";

const STORAGE_KEY = "al_arqam_ai_chat_history_v2";
const CHAT_TITLE_ID = "tanya-al-arqam-ai-heading";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function loadInitialMessages(): AlArqamUIMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const chatInputRef = useRef<ChatInputHandle>(null);

  const { messages, sendMessage, status, error, regenerate, setMessages } = useChat<AlArqamUIMessage>({
    messages: loadInitialMessages(),
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Persist conversation to localStorage (device-local, anonymous).
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [messages]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus trap: move focus into the panel on open, cycle Tab within it,
  // and restore focus to the FAB button on close.
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const trigger = triggerRef.current;

    const getFocusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const raf = requestAnimationFrame(() => {
      chatInputRef.current?.focus();
    });

    const handleTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusables();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", handleTrap);
    return () => {
      cancelAnimationFrame(raf);
      panel.removeEventListener("keydown", handleTrap);
      trigger?.focus();
    };
  }, [isOpen]);

  // Return focus to the input once a response finishes streaming.
  useEffect(() => {
    if (status === "ready" && isOpen) {
      requestAnimationFrame(() => chatInputRef.current?.focus());
    }
  }, [status, isOpen]);

  const handleSendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      sendMessage({ text: trimmed });
    },
    [sendMessage]
  );

  const handleClearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  // Do not render on admin dashboard (checked after all hooks above run,
  // so hook order never changes between navigations).
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <AnimatePresence>
          {!isOpen && !hasPrompted && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex max-w-[70vw] items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/95 px-3.5 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-ping" />
              <span className="truncate text-xs font-semibold text-[hsl(var(--primary))]">
                Tanya Al-Arqam AI
              </span>
              <button
                type="button"
                onClick={() => setHasPrompted(true)}
                className="ml-1 shrink-0 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                aria-label="Tutup saran"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Tutup Tanya Al-Arqam AI" : "Buka Tanya Al-Arqam AI"}
          aria-expanded={isOpen}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[hsl(var(--primary))] via-emerald-800 to-[hsl(var(--primary))] text-white shadow-xl shadow-emerald-950/25 transition-all hover:shadow-2xl focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] ring-2 ring-white/30"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              <Sparkles className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-[hsl(var(--accent))] animate-pulse" />
            </div>
          )}

          {/* Online badge */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </span>
        </motion.button>
      </div>

      {/* Floating Chat Modal (Desktop & Mobile Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs sm:hidden"
              aria-hidden="true"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={CHAT_TITLE_ID}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 flex h-[85vh] sm:h-[620px] max-h-[85vh] sm:max-h-[620px] w-full sm:w-[430px] flex-col rounded-t-3xl sm:rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:bottom-24"
            >
              <ChatHeader
                titleId={CHAT_TITLE_ID}
                onClose={() => setIsOpen(false)}
                onClear={handleClearChat}
              />

              <ChatMessageList
                messages={messages}
                isLoading={isLoading}
                hasError={status === "error"}
                errorMessage={error?.message}
                onSelectPrompt={handleSelectPrompt}
                onRetry={() => regenerate()}
              />

              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} ref={chatInputRef} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
