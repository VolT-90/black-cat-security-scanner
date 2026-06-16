import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Plus,
  MessageSquare,
  Send,
  Trash2,
  Bot,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Home,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  createChatSession,
  deleteChatSession,
  getAllChatSessions,
  getSessionMessages,
  sendChatMessage,
} from "../services/chatbotService";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  lastMessage?: string;
  messages: Message[];
};

const MarkdownMessage = ({ content }: { content: string }) => {
  return (
    <div className="max-w-none text-sm leading-7 text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-4 text-lg font-black text-neon-cyan">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-4 text-base font-black text-neon-cyan">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-3 text-sm font-bold text-neon-cyan">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-sm leading-7 text-slate-200">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 ml-5 list-disc space-y-1 text-sm text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-5 list-decimal space-y-1 text-sm text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 text-sm leading-7 text-slate-200">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-black text-white">{children}</strong>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");

            if (!isBlock) {
              return (
                <code className="rounded-md bg-black/40 px-1.5 py-0.5 text-neon-cyan">
                  {children}
                </code>
              );
            }

            return (
              <code className="block whitespace-pre overflow-x-auto rounded-2xl border border-neon-cyan/20 bg-black/50 p-4 text-xs leading-6 text-slate-100 sm:text-sm">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <div className="my-3">{children}</div>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export const ChatbotPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [message, setMessage] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastUserMessageRef = useRef<HTMLDivElement | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const lastUserMessageIndex =
    activeSession?.messages.reduce((lastIndex, msg, index) => {
      return msg.role === "user" ? index : lastIndex;
    }, -1) ?? -1;

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  const scrollToLastUserMessage = () => {
    setTimeout(() => {
      lastUserMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const normalizeSession = (session: any): ChatSession => ({
    id: session._id || session.id,
    title: session.title || "New Chat",
    lastMessage: session.lastMessage || "",
    messages: [],
  });

  const normalizeMessages = (messages: any[]): Message[] => {
    return messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content || msg.message || msg.text || "",
    }));
  };

  const loadSessions = async () => {
    try {
      setIsLoadingSessions(true);

      const response = await getAllChatSessions();
      const apiSessions = response.data || [];

      const normalized = apiSessions.map(normalizeSession);
      setSessions(normalized);

      if (normalized.length > 0) {
        setActiveSessionId(normalized[0].id);
      }
    } catch (error) {
      console.log("Get sessions error:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      setIsLoadingMessages(true);

      const response = await getSessionMessages(sessionId);
      const apiMessages = response.data || response.messages || [];

      const normalizedMessages = normalizeMessages(apiMessages);

      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, messages: normalizedMessages }
            : session,
        ),
      );

      scrollToBottom();
    } catch (error) {
      console.log("Get messages error:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      loadMessages(activeSessionId);
    }
  }, [activeSessionId]);

  const createNewChat = async () => {
    try {
      const response = await createChatSession();
      const newSession = normalizeSession(response.data);

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setIsSidebarOpen(false);
    } catch (error) {
      console.log("Create session error:", error);
    }
  };

  const deleteChat = async (id: string) => {
    try {
      setDeletingId(id);

      await deleteChatSession(id);

      const filtered = sessions.filter((s) => s.id !== id);
      setSessions(filtered);

      if (activeSessionId === id) {
        setActiveSessionId(filtered[0]?.id || "");
      }
    } catch (error) {
      console.log("Delete session error:", error);
    } finally {
      setDeletingId("");
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeSession || isSending) return;

    const userText = message.trim();
    setMessage("");

    const userMessage: Message = {
      role: "user",
      content: userText,
    };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              title:
                session.title === "New Chat"
                  ? userText.slice(0, 28)
                  : session.title,
              messages: [...session.messages, userMessage],
            }
          : session,
      ),
    );

    scrollToLastUserMessage();

    try {
      setIsSending(true);

      const response = await sendChatMessage(activeSessionId, userText);

      const assistantText =
        response.data?.content ||
        response.data?.data?.content ||
        response.data?.reply?.content ||
        response.data?.ai_response ||
        response.data?.answer ||
        "No response returned from AI.";

      const aiMessage: Message = {
        role: "assistant",
        content: assistantText,
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: [...session.messages, aiMessage],
              }
            : session,
        ),
      );
    } catch (error: any) {
      console.log("Send message error:", error);

      const errorMessage: Message = {
        role: "assistant",
        content:
          error?.response?.data?.err_message ||
          error?.response?.data?.message ||
          "Failed to send message. Please try again.",
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: [...session.messages, errorMessage],
              }
            : session,
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="mb-6 rounded-3xl border border-neon-cyan/20 bg-neon-cyan/5 p-5 shadow-lg shadow-neon-cyan/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
            <Bot size={24} />
          </div>

          <div>
            <h2 className="text-lg font-black text-white">AI Assistant</h2>
            <p className="text-xs text-slate-400">Black Cat Security AI</p>
          </div>
        </div>
      </div>

      <button
        onClick={createNewChat}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neon-cyan px-4 py-3 font-black text-navy-900 shadow-lg shadow-neon-cyan/20 transition hover:bg-neon-cyan/80"
      >
        <Plus size={18} />
        New Chat
      </button>

      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            History Chats
          </h3>

          <span className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-2 py-1 text-xs font-bold text-neon-cyan">
            {sessions.length}
          </span>
        </div>

        <div className="max-h-[calc(100vh-360px)] space-y-2 overflow-y-auto pr-1">
          {isLoadingSessions ? (
            <div className="flex justify-center py-6 text-neon-cyan">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  setIsSidebarOpen(false);
                }}
                className={`group flex cursor-pointer items-center justify-between gap-2 rounded-2xl border px-4 py-3 transition ${
                  activeSessionId === session.id
                    ? "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan shadow-lg shadow-neon-cyan/10"
                    : "border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-neon-cyan/20 hover:bg-slate-800/80"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <MessageSquare size={17} />
                  <span className="truncate text-sm font-semibold">
                    {session.title}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(session.id);
                  }}
                  disabled={deletingId === session.id}
                  className="text-red-400 opacity-100 transition hover:text-red-300 disabled:opacity-50 md:opacity-0 md:group-hover:opacity-100"
                >
                  {deletingId === session.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );

  return (
    <section className="relative flex h-[calc(100vh-116px)] flex-col overflow-hidden bg-[#030712] px-3 py-3 text-slate-200 sm:px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,245,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,245,255,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-neon-cyan/20 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-neon-cyan/10 blur-[140px]" />
      <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-neon-cyan/10 blur-[130px]" />

      <div className="relative z-20 mx-auto mb-3 flex w-full max-w-7xl shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-neon-cyan/30 bg-[#020617]/90 px-4 py-3 text-sm font-bold text-neon-cyan shadow-lg shadow-neon-cyan/20 backdrop-blur-xl transition hover:bg-neon-cyan/10 md:hidden"
          >
            <Menu size={20} />
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-2xl border border-neon-cyan/20 bg-[#020617]/90 px-4 py-3 text-sm font-bold text-neon-cyan shadow-lg shadow-neon-cyan/10 backdrop-blur-xl transition hover:bg-neon-cyan/10"
          >
            <Home size={18} />
            Back to Home Page
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />

            <motion.aside
              className="fixed left-0 top-0 z-50 h-full w-[85%] max-w-[340px] border-r border-neon-cyan/20 bg-[#020617] p-5 shadow-2xl shadow-neon-cyan/20 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="mb-5 ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan"
              >
                <X size={22} />
              </button>

              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden rounded-[2rem] border border-neon-cyan/20 bg-slate-950/70 shadow-2xl shadow-neon-cyan/10 backdrop-blur-xl">
        <aside className="hidden w-80 shrink-0 border-r border-neon-cyan/10 bg-[#020617]/80 p-5 md:block">
          <SidebarContent />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-neon-cyan/10 bg-[#020617]/60 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-xs font-bold text-neon-cyan">
                  <Sparkles size={14} />
                  Black Cat AI
                </div>

                <h1 className="text-xl font-black text-white sm:text-2xl">
                  Black Cat Chatbot
                </h1>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Ask about vulnerabilities, scan results, and security
                  concepts.
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 px-4 py-3 text-neon-cyan lg:flex">
                <ShieldCheck size={18} />
                <span className="text-sm font-bold">Protected</span>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-5">
              {isLoadingMessages ? (
                <div className="flex min-h-[260px] items-center justify-center text-neon-cyan">
                  <Loader2 size={34} className="animate-spin" />
                </div>
              ) : activeSession?.messages.length ? (
                activeSession.messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    ref={
                      msg.role === "user" && index === lastUserMessageIndex
                        ? lastUserMessageRef
                        : null
                    }
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[92%] gap-2 sm:max-w-[85%] sm:gap-3 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border sm:h-9 sm:w-9 ${
                          msg.role === "user"
                            ? "border-neon-cyan/30 bg-neon-cyan text-navy-900"
                            : "border-neon-cyan/20 bg-slate-900 text-neon-cyan"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <MessageSquare size={16} />
                        ) : (
                          <Bot size={17} />
                        )}
                      </div>

                      <div
                        className={`rounded-3xl border px-4 py-3 text-sm leading-6 shadow-lg sm:px-5 ${
                          msg.role === "user"
                            ? "border-neon-cyan/30 bg-neon-cyan text-navy-900 shadow-neon-cyan/10"
                            : "border-slate-800 bg-slate-900/90 text-slate-200 shadow-black/20"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <MarkdownMessage content={msg.content} />
                        ) : (
                          <span className="whitespace-pre-wrap">
                            {msg.content}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex min-h-[260px] items-center justify-center text-center text-slate-400">
                  Start a new chat and ask anything about security.
                </div>
              )}

              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/90 px-5 py-3 text-sm text-slate-300">
                    <Loader2
                      size={16}
                      className="animate-spin text-neon-cyan"
                    />
                    AI is thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="shrink-0 border-t border-neon-cyan/10 bg-[#020617]/80 px-3 py-2 sm:px-5 sm:py-3">
            <div className="flex items-center gap-2 rounded-3xl border border-neon-cyan/20 bg-slate-950/90 px-3 py-3 shadow-lg shadow-neon-cyan/10 sm:gap-3 sm:px-4">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask something about security..."
                disabled={!activeSessionId || isSending}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
              />

              <button
                onClick={sendMessage}
                disabled={!activeSessionId || isSending || !message.trim()}
                className="rounded-2xl bg-neon-cyan p-3 text-navy-900 shadow-lg shadow-neon-cyan/20 transition hover:bg-neon-cyan/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};
