"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { askAITutorAction, getUserKnowledgeModulesAction } from "@/actions/ai-actions";
import type { ChatTurn, ModuleKnowledgeItem } from "@/actions/ai-actions";
import { MemoryManagementModal } from "@/components/ai/memory-management-modal";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";
import { getActiveUserIdentifier } from "@/lib/bookmark-service";
import { AITutorHeader } from "@/components/ai/ai-tutor-header";
import { AIContextBar } from "@/components/ai/ai-context-bar";
import { AISessionSidebar, ChatSessionItem } from "@/components/ai/ai-session-sidebar";
import { AIMessageItem, AIBubbleMessage } from "@/components/ai/ai-message-item";
import { AIComposer } from "@/components/ai/ai-composer";
import { Sparkles, BookOpen } from "lucide-react";

function getAIChatStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_ai_chat_sessions_${user}`;
}

const TEXT_FILE_EXTENSIONS = [
  ".txt", ".py", ".js", ".ts", ".tsx", ".jsx", ".json", ".csv",
  ".md", ".html", ".css", ".sql", ".sh", ".c", ".cpp", ".java", ".php"
];

function AITutorContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";

  const [messages, setMessages] = useState<AIBubbleMessage[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const urlPrompt = searchParams.get("prompt");
    if (urlPrompt) {
      setInput(urlPrompt);
    }
  }, [searchParams]);

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
  const fileImageInputRef = useRef<HTMLInputElement>(null);
  const fileDocInputRef = useRef<HTMLInputElement>(null);

  // Session state & History State
  const [sessions, setSessions] = useState<ChatSessionItem[]>([]);
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
        const parsed: ChatSessionItem[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          setMessages(parsed[0].messages || []);
          return;
        }
      } catch (err) {
        console.error("Gagal memuat riwayat sesi chat:", err);
      }
    }

    // Default first session
    const initialSessionId = `session_${Date.now()}`;
    const initialSession: ChatSessionItem = {
      id: initialSessionId,
      title: "Sesi Belajar Baru",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setSessions([initialSession]);
    setActiveSessionId(initialSessionId);
    setMessages([]);
  }, []);

  // Save Sessions to localStorage whenever sessions or messages change
  const saveSessionsToStorage = (updatedSessions: ChatSessionItem[]) => {
    if (typeof window === "undefined") return;
    setSessions(updatedSessions);
    try {
      localStorage.setItem(getAIChatStorageKey(), JSON.stringify(updatedSessions));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle Switch Session
  const handleSelectSession = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      setActiveSessionId(sessionId);
      setMessages(target.messages || []);
    }
  };

  // Handle Create New Session
  const handleNewSession = () => {
    const newId = `session_${Date.now()}`;
    const newSession: ChatSessionItem = {
      id: newId,
      title: "Sesi Belajar Baru",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    const updated = [newSession, ...sessions];
    saveSessionsToStorage(updated);
    setActiveSessionId(newId);
    setMessages([]);
    setInput("");
    setSelectedImage(null);
    setSelectedFile(null);
    toast.success("Sesi konsultasi baru telah dibuka.");
  };

  // Handle Delete Session
  const handleDeleteSession = (sessionId: string) => {
    const remaining = sessions.filter((s) => s.id !== sessionId);
    if (remaining.length === 0) {
      const freshId = `session_${Date.now()}`;
      const freshSession: ChatSessionItem = {
        id: freshId,
        title: "Sesi Belajar Baru",
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      saveSessionsToStorage([freshSession]);
      setActiveSessionId(freshId);
      setMessages([]);
    } else {
      saveSessionsToStorage(remaining);
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
        setMessages(remaining[0].messages || []);
      }
    }
    toast.success("Sesi telah dihapus.");
  };

  // Image Upload Selection Handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Berkas harus berupa gambar (PNG, JPG, WebP, GIF).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 4 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(",")[1] || "";
      setSelectedImage({
        base64: base64Data,
        mimeType: file.type,
        previewUrl: result,
      });
      toast.success(`Gambar "${file.name}" berhasil terlampir.`);
    };
    reader.readAsDataURL(file);
  };

  // Document/Code File Upload Selection Handler
  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isTextFile = TEXT_FILE_EXTENSIONS.some((ext) => lowerName.endsWith(ext));

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Ukuran berkas maksimal 8 MB.");
      return;
    }

    if (isTextFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        setSelectedFile({
          fileName: file.name,
          fileText: textContent,
          sizeFormatted: formatFileSize(file.size),
        });
        toast.success(`Berkas teks/kode "${file.name}" terlampir.`);
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.split(",")[1] || "";
        setSelectedFile({
          fileName: file.name,
          base64: base64Data,
          mimeType: file.type || "application/octet-stream",
          sizeFormatted: formatFileSize(file.size),
        });
        toast.success(`Dokumen "${file.name}" terlampir.`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send Message Submission Handler
  const handleSendMessage = async (customPrompt?: string) => {
    const query = (customPrompt || input).trim();
    if (!query && !selectedImage && !selectedFile) return;

    const userMessageId = `msg_${Date.now()}`;
    const newUserMessage: AIBubbleMessage = {
      id: userMessageId,
      sender: "user",
      text: query || (selectedImage ? "[Lampiran Gambar]" : "[Lampiran Berkas]"),
      timestamp: new Date(),
      imageUrl: selectedImage?.previewUrl,
      fileAttachment: selectedFile
        ? { name: selectedFile.fileName, size: selectedFile.sizeFormatted }
        : undefined,
    };

    const currentImage = selectedImage;
    const currentFile = selectedFile;

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput("");
    setSelectedImage(null);
    setSelectedFile(null);
    setIsTyping(true);

    // Update Session Title if it's the first message
    let sessionTitle = sessions.find((s) => s.id === activeSessionId)?.title || "Sesi Belajar";
    if (messages.length === 0 && query) {
      sessionTitle = query.slice(0, 36) + (query.length > 36 ? "..." : "");
    }

    try {
      const historyTurns: ChatTurn[] = messages.slice(-8).map((m) => ({
        role: m.sender === "user" ? "user" : "ai",
        text: m.text,
      }));

      const attachmentPayload = currentFile
        ? {
            fileName: currentFile.fileName,
            fileText: currentFile.fileText,
            base64: currentFile.base64,
            mimeType: currentFile.mimeType,
          }
        : undefined;

      const aiResponseText = await askAITutorAction(
        query || "Analisis lampiran ini secara terperinci.",
        currentImage ? currentImage.base64 : undefined,
        currentImage ? currentImage.mimeType : undefined,
        attachmentPayload,
        aiProvider,
        historyTurns,
        selectedModuleId !== "all" ? selectedModuleId : undefined
      );

      const aiMessageId = `msg_ai_${Date.now()}`;
      const newAiMessage: AIBubbleMessage = {
        id: aiMessageId,
        sender: "ai",
        text: aiResponseText || "Jawaban belum dapat dimuat. Silakan coba lagi.",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, newAiMessage];
      setMessages(finalMessages);

      // Persist in session list
      const updatedSessions = sessions.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: sessionTitle,
            updatedAt: new Date().toISOString(),
            messages: finalMessages,
          };
        }
        return s;
      });
      saveSessionsToStorage(updatedSessions);
    } catch (err: any) {
      console.error("Gagal mendapatkan respons AI:", err);
      const errorMessageId = `msg_err_${Date.now()}`;
      const errorAiMessage: AIBubbleMessage = {
        id: errorMessageId,
        sender: "ai",
        text: "Terjadi kendala saat menghubungkan ke layanan AI. Silakan periksa koneksi internet atau coba beberapa saat lagi.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorAiMessage]);
      toast.error("Gagal menghubungi AI Tutor.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Teks berhasil disalin.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <SubNavTabs category="ai" />

        {/* Workspace Header */}
        <AITutorHeader
          onNewSession={handleNewSession}
          onOpenMemory={() => setIsMemoryModalOpen(true)}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar((prev) => !prev)}
          sessionCount={sessions.length}
        />

        {/* Hidden File Inputs */}
        <input
          ref={fileImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
        />
        <input
          ref={fileDocInputRef}
          type="file"
          accept={TEXT_FILE_EXTENSIONS.join(",") + ",.pdf"}
          className="hidden"
          onChange={handleDocFileChange}
        />

        {/* Context Bar */}
        <AIContextBar
          userModules={userModules}
          selectedModuleId={selectedModuleId}
          onSelectModuleId={setSelectedModuleId}
          aiProvider={aiProvider}
          onSelectProvider={setAiProvider}
        />

        {/* Main Conversation Workspace Layout */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Collapsible Session Sidebar */}
          {showSidebar && (
            <AISessionSidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              onCloseMobile={() => setShowSidebar(false)}
            />
          )}

          {/* Conversation Main Window */}
          <div className="flex-1 w-full rounded-xl border border-border bg-surface flex flex-col h-[calc(100vh-17rem)] md:h-[620px] overflow-hidden shadow-2xs">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                      Mulai Sesi Belajar
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Tanyakan konsep teori, minta tinjauan kode, atau gunakan modul pembelajaran Anda sebagai konteks konsultasi akademik.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <AIMessageItem
                    key={message.id}
                    message={message}
                    onCopy={handleCopy}
                    isCopied={copiedId === message.id}
                  />
                ))
              )}

              {/* Typing Skeleton / Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-surface-secondary text-xs text-text-secondary w-fit font-mono animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>AI Tutor sedang menyusun jawaban akademik...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Composer */}
            <div className="p-3 sm:p-4 border-t border-border bg-surface-secondary/40">
              <AIComposer
                input={input}
                onChangeInput={setInput}
                onSubmit={() => handleSendMessage()}
                isTyping={isTyping}
                selectedImage={selectedImage}
                onClearImage={() => setSelectedImage(null)}
                onSelectImageClick={() => fileImageInputRef.current?.click()}
                selectedFile={selectedFile}
                onClearFile={() => setSelectedFile(null)}
                onSelectFileClick={() => fileDocInputRef.current?.click()}
                onQuickPrompt={(prompt) => handleSendMessage(prompt)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Memory Management Modal */}
      <MemoryManagementModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
      />
    </PageContainer>
  );
}

export default function AITutorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-tertiary">Memuat AI Tutor...</div>}>
      <AITutorContent />
    </Suspense>
  );
}
