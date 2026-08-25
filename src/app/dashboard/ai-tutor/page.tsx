"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Brain,
  Code2,
  Eye,
  MessageSquare,
  Image as ImageIcon,
  X,
  Paperclip,
  FileText,
  FileCode,
  Crown,
  Lock,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  History,
  MessageSquarePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { askAITutorAction, getUserKnowledgeModulesAction } from "@/actions/ai-actions";
import type { ChatTurn, ModuleKnowledgeItem } from "@/actions/ai-actions";
import { MemoryManagementModal } from "@/components/ai/memory-management-modal";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";
import { GeminiIcon, ClaudeIcon } from "@/components/ui/brand-logos";
import { getActiveUserIdentifier } from "@/lib/bookmark-service";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";

function getAIChatStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_ai_chat_sessions_${user}`;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  imageUrl?: string;
  fileAttachment?: {
    name: string;
    size: string;
  };
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const QUICK_PROMPTS = [
  { label: "Apa itu Python?", icon: Code2, prompt: "Jelaskan Python dan contoh kodenya" },
  { label: "Machine Learning", icon: Brain, prompt: "Jelaskan konsep Machine Learning secara lengkap" },
  { label: "Deep Learning", icon: Brain, prompt: "Apa itu Deep Learning dan Neural Networks?" },
  { label: "Generative AI", icon: Sparkles, prompt: "Jelaskan Generative AI dan Large Language Models" },
  { label: "Computer Vision", icon: Eye, prompt: "Apa itu Computer Vision dan contoh penggunaannya?" },
  { label: "NLP", icon: MessageSquare, prompt: "Jelaskan Natural Language Processing (NLP)" },
  { label: "System Design", icon: Code2, prompt: "Jelaskan prinsip System Design untuk aplikasi skala besar" },
  { label: "Data Engineering", icon: Brain, prompt: "Jelaskan pipeline Data Engineering modern end-to-end" },
  { label: "DevOps & CI/CD", icon: Sparkles, prompt: "Jelaskan best practices DevOps, Docker, Kubernetes, dan CI/CD pipeline" },
];

const TEXT_FILE_EXTENSIONS = [
  ".txt", ".py", ".js", ".ts", ".tsx", ".jsx", ".json", ".csv",
  ".md", ".html", ".css", ".sql", ".sh", ".c", ".cpp", ".java", ".php"
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Module Knowledge Memory state
  const [userModules, setUserModules] = useState<ModuleKnowledgeItem[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("all");

  // Engine state
  const [aiProvider, setAiProvider] = useState<"gemini" | "claude">("gemini");

  // Selected Image state
  const [selectedImage, setSelectedImage] = useState<{
    base64: string;
    mimeType: string;
    previewUrl: string;
  } | null>(null);

  // Selected Document/Code File state
  const [selectedFile, setSelectedFile] = useState<{
    fileName: string;
    fileText?: string;
    base64?: string;
    mimeType?: string;
    sizeFormatted: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileImageInputRef = useRef<HTMLInputElement>(null);
  const fileDocInputRef = useRef<HTMLInputElement>(null);

  // Session state & History State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState<boolean>(false);

  // Fetch Ingested User Modules for AI Knowledge Base
  useEffect(() => {
    getUserKnowledgeModulesAction().then((mods) => {
      if (mods && Array.isArray(mods)) {
        setUserModules(mods);
      }
    });
  }, []);

  // Load Sessions from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = getAIChatStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          const hydrated = parsed.map((s) => ({
            ...s,
            messages: (s.messages || []).map((m) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
          }));
          setSessions(hydrated);
          setActiveSessionId(hydrated[0].id);
          setMessages(hydrated[0].messages);
          return;
        }
      } catch (e) {
        console.error("Failed to parse chat sessions:", e);
      }
    }

    const initialId = "session-" + Date.now();
    const defaultSession: ChatSession = {
      id: initialId,
      title: "Chat Baru",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setSessions([defaultSession]);
    setActiveSessionId(initialId);
    setMessages([]);
  }, []);

  const saveSessions = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    if (typeof window !== "undefined") {
      const key = getAIChatStorageKey();
      localStorage.setItem(key, JSON.stringify(updatedSessions));
    }
  };

  const handleNewChat = () => {
    const newId = "session-" + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: "Chat Baru",
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setActiveSessionId(newId);
    setMessages([]);
    setSelectedImage(null);
    setSelectedFile(null);
    toast.success("Sesi Chat Baru dibuat");
  };

  const handleSelectSession = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (!target) return;
    setActiveSessionId(sessionId);
    setMessages(target.messages || []);
    setSelectedImage(null);
    setSelectedFile(null);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remainingSessions = sessions.filter((s) => s.id !== sessionId);

    if (remainingSessions.length === 0) {
      handleNewChat();
    } else {
      saveSessions(remainingSessions);
      if (activeSessionId === sessionId) {
        setActiveSessionId(remainingSessions[0].id);
        setMessages(remainingSessions[0].messages || []);
      }
    }
    toast.success("Sesi chat berhasil dihapus");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File yang diunggah harus berupa gambar (JPG, PNG, WebP, dll)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage({
        base64: result,
        mimeType: file.type,
        previewUrl: result,
      });
      toast.success("Foto berhasil dilampirkan");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran berkas maksimal 10MB");
      return;
    }

    const fileName = file.name;
    const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
    const sizeFormatted = formatFileSize(file.size);

    const isText = TEXT_FILE_EXTENSIONS.includes(ext) || file.type.startsWith("text/");

    if (isText) {
      const reader = new FileReader();
      reader.onload = () => {
        const textContent = reader.result as string;
        setSelectedFile({
          fileName,
          fileText: textContent,
          sizeFormatted,
        });
        toast.success(`Berkas ${fileName} berhasil dilampirkan!`);
      };
      reader.readAsText(file);
    } else {
      // Binary file (PDF, etc)
      const reader = new FileReader();
      reader.onload = () => {
        const base64Content = reader.result as string;
        setSelectedFile({
          fileName,
          base64: base64Content,
          mimeType: file.type || "application/pdf",
          sizeFormatted,
        });
        toast.success(`Berkas ${fileName} berhasil dilampirkan!`);
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const handleSend = async (text?: string) => {
    const prompt = (text || input).trim();
    if ((!prompt && !selectedImage && !selectedFile) || isTyping) return;

    const currentImage = selectedImage;
    const currentFile = selectedFile;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date(),
      imageUrl: currentImage?.previewUrl,
      fileAttachment: currentFile
        ? { name: currentFile.fileName, size: currentFile.sizeFormatted }
        : undefined,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setSelectedImage(null);
    setSelectedFile(null);
    setIsTyping(true);

    try {
      // Build chat history for multi-turn context (max 10 recent messages)
      const chatHistoryForAI: ChatTurn[] = messages
        .slice(-10)
        .map((m) => ({
          role: m.sender === "user" ? ("user" as const) : ("ai" as const),
          text: m.text,
        }));

      const reply = await askAITutorAction(
        prompt,
        currentImage?.base64,
        currentImage?.mimeType,
        currentFile
          ? {
              fileName: currentFile.fileName,
              fileText: currentFile.fileText,
              base64: currentFile.base64,
              mimeType: currentFile.mimeType,
            }
          : undefined,
        aiProvider,
        chatHistoryForAI,
        selectedModuleId !== "all" ? selectedModuleId : undefined
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Sync active session history & title
      const updatedSessions = sessions.map((s) => {
        if (s.id === activeSessionId) {
          const titleToUse =
            s.title === "Chat Baru" && prompt
              ? prompt.length > 25
                ? prompt.slice(0, 25) + "..."
                : prompt
              : s.title;
          return {
            ...s,
            title: titleToUse,
            updatedAt: new Date().toISOString(),
            messages: finalMessages,
          };
        }
        return s;
      });
      saveSessions(updatedSessions);
    } catch (err: any) {
      toast.error("Tidak dapat terhubung ke AI Tutor saat ini. Silakan coba sesaat lagi.");
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Teks berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    setSelectedImage(null);
    setSelectedFile(null);
    toast.success("Riwayat chat dibersihkan");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = QUICK_PROMPTS;

  const renderAIText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).split("\n");
        const lang = lines[0]?.trim() || "";
        const code = (lang ? lines.slice(1) : lines).join("\n").trim();
        return (
          <div key={idx} className="my-3 rounded-xl overflow-hidden border border-white/10">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1f2e] text-[10px] text-slate-400 font-mono uppercase">
              <span>{lang || "code"}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  toast.success("Kode disalin!");
                }}
                className="hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <pre className="p-4 bg-[#0d1117] text-[13px] text-emerald-300 font-mono overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={idx} className="whitespace-pre-wrap leading-relaxed space-y-1 my-1">
          {part}
        </div>
      );
    });
  };

  return (
    <>
      <div className="flex gap-3 sm:gap-4 h-[calc(100dvh-75px)] md:h-[calc(100vh-80px)] page-container overflow-hidden px-1 sm:px-2 animate-fade-in">
      {/* Left Chat History Sidebar (Desktop & Mobile Slide-over Drawer) */}
      {showSidebar && (
        <>
          {/* Mobile Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
            onClick={() => setShowSidebar(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-surface border-r border-border flex flex-col shadow-xl md:static md:z-auto md:w-64 md:h-full md:rounded-2xl md:border shrink-0 overflow-hidden transition-all duration-200 animate-fade-in">
            {/* Sidebar Top: New Chat Button & Close Icon */}
            <div className="p-3 border-b border-border space-y-2">
              <button
                onClick={() => {
                  handleNewChat();
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    setShowSidebar(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Chat Baru</span>
              </button>

              <div className="flex items-center justify-between px-1 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-text-tertiary uppercase tracking-wider">
                  <History className="w-3.5 h-3.5 text-brand-400" />
                  <span>Riwayat Chat</span>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  title="Sembunyikan Panel Riwayat"
                  className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Session Items List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {sessions.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-2 text-xs text-text-tertiary">
                  <MessageSquarePlus className="w-8 h-8 mx-auto text-text-tertiary/60" />
                  <p>Belum ada riwayat chat</p>
                  <p className="text-[10px] text-text-tertiary">Klik &quot;Chat Baru&quot; untuk mulai</p>
                </div>
              ) : (
                sessions.map((s) => {
                  const isActive = s.id === activeSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        handleSelectSession(s.id);
                        if (typeof window !== "undefined" && window.innerWidth < 768) {
                          setShowSidebar(false);
                        }
                      }}
                      className={`group relative flex items-center justify-between p-2.5 px-3 rounded-xl cursor-pointer text-xs transition-all duration-150 ${
                        isActive
                          ? "bg-surface-secondary border border-brand-500/30 text-text-primary font-semibold shadow-xs"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70 border border-transparent"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-brand-500 rounded-r-full" />
                      )}

                      <div className="flex items-center gap-2.5 overflow-hidden pl-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? "text-brand-400" : "text-text-tertiary group-hover:text-text-secondary"}`} />
                        <span className="truncate">{s.title || "Chat Sesi"}</span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        title="Hapus Sesi Chat"
                        className="opacity-0 group-hover:opacity-100 p-1 text-text-tertiary hover:text-rose-500 hover:bg-rose-500/10 transition-all rounded-lg shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full overflow-hidden space-y-2">
        {/* Sub Navigation */}
        <SubNavTabs category="ai" className="shrink-0" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 sm:pb-2.5 border-b border-border gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              title={showSidebar ? "Sembunyikan Panel Riwayat" : "Tampilkan Panel Riwayat Chat"}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold transition-all duration-150 shrink-0 cursor-pointer ${
                showSidebar
                  ? "bg-brand-500/15 border-brand-500/30 text-brand-600 dark:text-brand-400"
                  : "bg-surface-secondary border-border text-text-secondary hover:text-text-primary hover:bg-surface-tertiary shadow-xs"
              }`}
            >
              {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              <span>{showSidebar ? "Tutup" : "Riwayat"}</span>
            </button>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 bg-brand-600 text-white shadow-xs">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display">
                Velqora AI Tutor
              </h1>
              <p className="text-[11px] text-text-secondary truncate hidden xs:block">
                Tanya konsep, diskusikan silabus modul, atau debug kode secara interaktif.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-0.5 max-w-full">
            {/* Live Module Memory Selector */}
            <div className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-border bg-surface-secondary text-xs text-text-primary shrink-0">
              <Brain className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-semibold text-brand-400 hidden sm:inline">
                Memori:
              </span>
              <select
                value={selectedModuleId}
                onChange={(e) => {
                  setSelectedModuleId(e.target.value);
                  if (e.target.value !== "all") {
                    const mod = userModules.find((m) => m.id === e.target.value);
                    toast.success(`Fokus Memori: ${mod?.title || "Modul Terpilih"}`);
                  } else {
                    toast.info("AI Tutor menggunakan memori seluruh modul");
                  }
                }}
                className="bg-transparent text-text-primary font-medium text-[11px] sm:text-xs focus:outline-none cursor-pointer pr-1 truncate max-w-[140px] sm:max-w-[180px]"
              >
                <option value="all" className="bg-surface text-text-primary">
                  Semua Modul ({userModules.length})
                </option>
                {userModules.map((mod) => (
                  <option key={mod.id} value={mod.id} className="bg-surface text-text-primary">
                    {mod.title}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Engine Provider Selector with Official Brand Logo */}
            <div className="relative inline-flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-xl border border-border bg-surface-secondary text-[11px] sm:text-xs font-semibold text-text-primary">
              {aiProvider === "gemini" ? (
                <GeminiIcon className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ClaudeIcon className="w-3.5 h-3.5 shrink-0" />
              )}
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as "gemini" | "claude")}
                className="bg-transparent text-text-primary font-semibold text-[11px] sm:text-xs focus:outline-none cursor-pointer"
              >
                <option value="gemini" className="bg-surface text-text-primary">Google Gemini</option>
                <option value="claude" className="bg-surface text-text-primary">Anthropic Claude</option>
              </select>
            </div>

            {/* Memory Management Center Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMemoryModalOpen(true)}
              className="text-xs bg-surface border-border text-text-secondary hover:text-brand-500 hover:border-brand-500/30 gap-1.5 shrink-0 cursor-pointer"
              title="Buka Pusat Memori & Konteks AI"
            >
              <Brain className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden sm:inline">Pusat Memori</span>
            </Button>

            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="text-xs text-text-tertiary hover:text-red-500 gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Bersihkan
              </Button>
            )}
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileImageInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={fileDocInputRef}
          onChange={handleDocumentSelect}
          accept=".pdf,.txt,.py,.js,.ts,.tsx,.jsx,.json,.csv,.md,.html,.css,.sql,.doc,.docx"
          className="hidden"
        />

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-thin">
          {/* Empty State — Quick Prompts & Ingested Modules */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in py-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border bg-brand-500/10 border-brand-500/25 mx-auto text-brand-400">
                  <Bot className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary font-display">
                  AI Tutor dengan Memori Modul Belajar
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                  Seluruh modul dan bahan ajar yang Anda miliki otomatis tersambung ke dalam sistem memori AI Tutor.
                </p>
              </div>

              {/* Connected User Modules Chips if available */}
              {userModules.length > 0 && (
                <div className="w-full max-w-xl space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-400 font-bold flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" />
                      MODUL ANDA DI MEMORI AI
                    </span>
                    <span className="text-[10px] text-text-tertiary font-mono">{userModules.length} Modul Aktif</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {userModules.slice(0, 4).map((mod) => (
                      <button
                        key={mod.id}
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          handleSend(`Tolong buatkan rangkuman dan 3 soal latihan pemahaman dari Modul "${mod.title}"!`);
                        }}
                        className="p-3 rounded-xl bg-surface border border-border hover:border-brand-500/40 hover:bg-surface-secondary text-left transition-all group flex flex-col justify-between space-y-1.5 cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/25">
                            {mod.level}
                          </span>
                          <span className="text-[10px] text-text-tertiary font-mono">{mod.chapters.length} Bab</span>
                        </div>
                        <h4 className="text-xs font-bold text-text-primary group-hover:text-brand-400 transition-colors truncate font-display">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-text-tertiary group-hover:text-text-secondary">
                          Klik untuk tanya / buat kuis dari modul ini
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Quick Prompt Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-xl w-full">
                {QUICK_PROMPTS.map((qp) => {
                  const Icon = qp.icon;
                  return (
                    <button
                      key={qp.label}
                      onClick={() => handleSend(qp.prompt)}
                      className="group flex flex-col items-center gap-2 p-3 sm:p-3.5 rounded-xl bg-surface border border-border hover:border-brand-500/40 hover:bg-surface-secondary transition-all duration-150 text-center active:scale-95 cursor-pointer shadow-xs"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-secondary border border-border flex items-center justify-center group-hover:border-brand-500/40 transition-all text-brand-400">
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                        {qp.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        {/* Message Bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-fade-in ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar */}
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 bg-brand-600 text-white shadow-xs">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[90%] sm:max-w-[78%] rounded-2xl px-4 sm:px-5 py-3.5 text-xs sm:text-sm transition-all ${
                msg.sender === "user"
                  ? "bg-brand-600 text-white rounded-tr-xs shadow-xs"
                  : "bg-surface text-text-primary border border-border rounded-tl-xs shadow-xs"
              }`}
            >
              {/* User Attached Image if any */}
              {msg.imageUrl && (
                <div className="mb-2.5 rounded-xl overflow-hidden border border-border bg-surface-secondary">
                  <img
                    src={msg.imageUrl}
                    alt="Terlampir"
                    className="max-h-60 w-auto object-contain rounded-lg"
                  />
                </div>
              )}

              {/* User Attached Document/Code File if any */}
              {msg.fileAttachment && (
                <div className="mb-2.5 flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-secondary border border-border text-xs">
                  <FileCode className="w-4 h-4 text-brand-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="font-semibold text-text-primary block truncate">{msg.fileAttachment.name}</span>
                    <span className="text-[10px] text-text-tertiary">{msg.fileAttachment.size}</span>
                  </div>
                </div>
              )}

              {msg.sender === "ai" ? (
                <div className="space-y-1 leading-relaxed">{renderAIText(msg.text)}</div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              )}

              {/* Message Footer */}
              <div
                className={`flex items-center gap-3 mt-3 pt-2 border-t ${
                  msg.sender === "user"
                    ? "border-white/20 text-white/80"
                    : "border-border text-text-tertiary"
                }`}
              >
                <span className="text-[10px] font-mono">
                  {msg.timestamp.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {msg.sender === "ai" && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="ml-auto text-[10px] hover:text-text-primary flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-surface-secondary cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Salin
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-xl bg-surface-secondary border border-border flex items-center justify-center shrink-0 mt-1 shadow-xs text-text-primary text-xs font-bold font-mono">
                U
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 items-start animate-fade-in">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-brand-600 text-white">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs">
                  Menganalisis pertanyaan Anda...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-4 border-t border-border space-y-2">
        {/* Attachment Previews */}
        <div className="flex flex-wrap gap-2">
          {/* Selected Image Preview Thumbnail */}
          {selectedImage && (
            <div className="flex items-center gap-3 p-2 bg-surface-secondary rounded-xl border border-brand-500/30 w-fit animate-fade-in">
              <img
                src={selectedImage.previewUrl}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover border border-border"
              />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-text-primary block">Foto Terlampir</span>
                <span className="text-[10px] text-text-tertiary">Siap dikirim ke AI</span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-lg text-text-tertiary hover:text-accent-red hover:bg-surface-tertiary transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Selected Document File Preview */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-2 px-3 bg-surface-secondary rounded-xl border border-indigo-500/30 w-fit animate-fade-in">
              <FileCode className="w-6 h-6 text-indigo-400 shrink-0" />
              <div className="text-xs space-y-0.5 max-w-[200px]">
                <span className="font-semibold text-text-primary block truncate">{selectedFile.fileName}</span>
                <span className="text-[10px] text-text-tertiary">{selectedFile.sizeFormatted}</span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 rounded-lg text-text-tertiary hover:text-accent-red hover:bg-surface-tertiary transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-end gap-2 bg-surface border border-border rounded-2xl p-2 pl-3 focus-within:border-brand-500/50 focus-within:shadow-lg focus-within:shadow-brand-500/5 transition-all">
          {/* Upload Image Button */}
          <button
            type="button"
            onClick={() => {
              fileImageInputRef.current?.click();
            }}
            title="Unggah Foto / Gambar"
            className="p-2 rounded-xl transition-colors shrink-0 relative text-text-secondary hover:text-brand-400 hover:bg-surface-tertiary"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Upload Document / Code File Button */}
          <button
            type="button"
            onClick={() => {
              fileDocInputRef.current?.click();
            }}
            title="Unggah Berkas Kode / Dokumen"
            className="p-2 rounded-xl transition-colors shrink-0 relative text-text-secondary hover:text-indigo-400 hover:bg-surface-tertiary"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedImage || selectedFile
                ? "Tulis pertanyaan / instruksi untuk berkas ini... (Enter untuk kirim)"
                : "Ketik pertanyaan, unggah foto, atau berkas kode... (Enter untuk kirim)"
            }
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary resize-none outline-none py-2 max-h-32 scrollbar-thin"
            style={{ minHeight: "40px" }}
            disabled={isTyping}
          />

          <Button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage && !selectedFile) || isTyping}
            className="rounded-xl px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-[10px] text-text-tertiary text-center">
          Asisten belajar cerdas berbasis pengetahuan materi dan modul Anda.
        </p>
      </div>
    </div>
  </div>

  {/* Memory & Long-term Context Management Center */}
  <MemoryManagementModal
    isOpen={isMemoryModalOpen}
    onClose={() => setIsMemoryModalOpen(false)}
  />
</>
);
}
