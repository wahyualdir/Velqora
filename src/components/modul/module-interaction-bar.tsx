"use client";

import React, { useState, useRef } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Trash2,
  Sparkles,
  User,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  MoreVertical,
  Share2,
} from "lucide-react";
import { ModuleComment, ModuleReaction } from "@/types/module-drive";
import {
  toggleModuleReaction,
  addModuleComment,
  deleteModuleComment,
} from "@/actions/study-actions";
import { validateAcademicText } from "@/lib/academic-content-filter";
import { OWNER_EMAIL, isAdminUser } from "@/lib/utils";
import { toast } from "sonner";

interface ModuleInteractionBarProps {
  moduleId: string;
  moduleTitle: string;
  comments?: ModuleComment[];
  reactions?: ModuleReaction[];
  initialComments?: ModuleComment[];
  initialReactions?: ModuleReaction[];
  initialNotes?: string | null;
  currentUser?: any;
  targetId?: string; // "module" or specific fileId
  targetName?: string;
  onDataUpdated?: (newComments: ModuleComment[], newReactions: ModuleReaction[]) => void;
  onSync?: (moduleId: string, folders: any[], files: any[]) => void;
}

// Relative time formatter helper (YouTube style)
function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) return "Baru saja";
    if (diffInSeconds < 60) return `${diffInSeconds} detik lalu`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Kemarin";
    if (diffInDays < 30) return `${diffInDays} hari lalu`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} bulan lalu`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} tahun lalu`;
  } catch {
    return dateString;
  }
}

export function ModuleInteractionBar({
  moduleId,
  moduleTitle,
  comments,
  reactions,
  initialComments,
  initialReactions,
  initialNotes,
  currentUser,
  targetId = "module",
  targetName,
  onDataUpdated,
  onSync,
}: ModuleInteractionBarProps) {
  const effectiveComments = comments || initialComments || [];
  const effectiveReactions = reactions || initialReactions || [];
  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<string, { liked: boolean; disliked: boolean; count: number }>>({});
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Compute reaction counts for target
  const targetReactions = (effectiveReactions || []).filter((r) => r.targetId === targetId);
  const likeCount = targetReactions.filter((r) => r.type === "like").length;
  const dislikeCount = targetReactions.filter((r) => r.type === "dislike").length;

  const userReaction = currentUser
    ? targetReactions.find((r) => r.userId === currentUser.id)?.type || null
    : null;

  // Filter comments for target or all
  const filteredComments = (effectiveComments || []).filter((c) =>
    targetId === "module" ? true : c.targetId === targetId
  );

  // Handle Like / Dislike Toggle on Main Module
  const handleReaction = async (type: "like" | "dislike") => {
    if (!currentUser) {
      toast.info("Silakan masuk untuk memberikan Like atau Dislike.");
      return;
    }

    if (reacting) return;
    setReacting(true);

    const prevReactions = [...(effectiveReactions || [])];
    const nextReactions = [...(effectiveReactions || [])];
    const existingIndex = nextReactions.findIndex(
      (r) => r.userId === currentUser.id && r.targetId === targetId
    );

    if (existingIndex >= 0) {
      if (nextReactions[existingIndex].type === type) {
        nextReactions.splice(existingIndex, 1);
      } else {
        nextReactions[existingIndex] = {
          ...nextReactions[existingIndex],
          type,
          createdAt: new Date().toISOString(),
        };
      }
    } else {
      nextReactions.push({
        userId: currentUser.id,
        userName:
          currentUser.user_metadata?.full_name ||
          currentUser.user_metadata?.name ||
          currentUser.email?.split("@")[0] ||
          "Pengguna",
        type,
        targetId,
        createdAt: new Date().toISOString(),
      });
    }

    if (onDataUpdated) onDataUpdated(comments || [], nextReactions);

    try {
      const updated = await toggleModuleReaction(moduleId, targetId, type);
      if (onDataUpdated) onDataUpdated(comments || [], updated);
    } catch (err: any) {
      if (onDataUpdated) onDataUpdated(comments || [], prevReactions);
      toast.error(err.message || "Gagal memperbarui respon");
    } finally {
      setReacting(false);
    }
  };

  // Handle Individual Comment Like/Dislike (Local UI state)
  const handleCommentReaction = (commentId: string, type: "like" | "dislike") => {
    if (!currentUser) {
      toast.info("Silakan masuk untuk memberikan respon pada komentar.");
      return;
    }
    setCommentLikes((prev) => {
      const current = prev[commentId] || { liked: false, disliked: false, count: 0 };
      if (type === "like") {
        const isNowLiked = !current.liked;
        return {
          ...prev,
          [commentId]: {
            liked: isNowLiked,
            disliked: false,
            count: isNowLiked ? current.count + 1 : Math.max(0, current.count - 1),
          },
        };
      } else {
        const isNowDisliked = !current.disliked;
        return {
          ...prev,
          [commentId]: {
            liked: false,
            disliked: isNowDisliked,
            count: current.liked ? Math.max(0, current.count - 1) : current.count,
          },
        };
      }
    });
  };

  // Handle Submit Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.info("Silakan masuk untuk menulis komentar.");
      return;
    }

    const trimmed = commentText.trim();
    if (!trimmed) return;

    // Academic safety check
    const check = validateAcademicText(trimmed);
    if (!check.isValid) {
      toast.error(check.reason || "Komentar terdeteksi tidak sesuai dengan etika akademik.");
      return;
    }

    setSubmittingComment(true);
    try {
      const newComment = await addModuleComment(
        moduleId,
        targetId,
        trimmed,
        targetName
      );

      const nextComments = [newComment, ...(comments || [])];
      setCommentText("");
      setIsInputFocused(false);
      if (onDataUpdated) onDataUpdated(nextComments, reactions || []);
      toast.success("Komentar berhasil dipublikasikan!");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim komentar");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle Delete Comment
  const handleDeleteComment = async (commentId: string) => {
    const prevComments = [...(comments || [])];
    const nextComments = (comments || []).filter((c) => c.id !== commentId);
    if (onDataUpdated) onDataUpdated(nextComments, reactions || []);

    try {
      await deleteModuleComment(moduleId, commentId);
      toast.success("Komentar dihapus");
    } catch (err: any) {
      if (onDataUpdated) onDataUpdated(prevComments, reactions || []);
      toast.error(err.message || "Gagal menghapus komentar");
    }
  };

  const userInitial =
    currentUser?.user_metadata?.full_name?.charAt(0) ||
    currentUser?.user_metadata?.name?.charAt(0) ||
    currentUser?.email?.charAt(0) ||
    "U";

  return (
    <div className="w-full space-y-4 pt-1">
      {/* 1. YouTube-style Top Action Bar: Segmented Pill Like/Dislike + Comment Counter */}
      <div className="flex items-center justify-between gap-2.5 pb-2 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Segmented Pill: Like | Dislike */}
          <div className="inline-flex items-center rounded-full bg-surface-secondary hover:bg-surface-tertiary border border-border p-0.5 transition-all shadow-2xs">
            <button
              type="button"
              onClick={() => handleReaction("like")}
              disabled={reacting}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                userReaction === "like"
                  ? "text-emerald-500 bg-emerald-500/15"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
              }`}
              title="Suka"
            >
              <ThumbsUp
                className={`w-3.5 h-3.5 ${
                  userReaction === "like" ? "fill-emerald-500 text-emerald-500" : ""
                }`}
              />
              <span>{likeCount}</span>
            </button>

            {/* Subtle Divider */}
            <div className="w-[1px] h-4 bg-border mx-0.5" />

            <button
              type="button"
              onClick={() => handleReaction("dislike")}
              disabled={reacting}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                userReaction === "dislike"
                  ? "text-rose-500 bg-rose-500/15"
                  : "text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary"
              }`}
              title="Tidak Suka"
            >
              <ThumbsDown
                className={`w-3.5 h-3.5 ${
                  userReaction === "dislike" ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
              {dislikeCount > 0 && <span>{dislikeCount}</span>}
            </button>
          </div>

          {/* Comment Toggle Pill */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-semibold transition-all ${
              showComments
                ? "bg-surface-secondary text-text-primary border border-border shadow-2xs"
                : "bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-border"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-text-tertiary" />
            <span>{filteredComments.length} Komentar</span>
            {showComments ? (
              <ChevronUp className="w-3.5 h-3.5 ml-0.5 text-text-tertiary" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-text-tertiary" />
            )}
          </button>
        </div>

        {targetName && (
          <span className="text-[10px] text-text-tertiary font-mono hidden sm:inline-block">
            Berkas: <strong className="text-text-primary">{targetName}</strong>
          </span>
        )}
      </div>

      {/* 2. YouTube Comment Section */}
      {showComments && (
        <div className="space-y-4 animate-fade-in">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display flex items-center gap-2">
              <span>Diskusi & Komentar ({filteredComments.length})</span>
            </h4>
          </div>

          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="flex gap-3 items-start">
            {/* User Avatar */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-xs font-bold text-text-primary shrink-0 shadow-inner mt-0.5">
              {userInitial.toUpperCase()}
            </div>

            {/* Input & Action Buttons */}
            <div className="flex-1 space-y-2">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={commentText}
                  onFocus={() => setIsInputFocused(true)}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={isInputFocused || commentText ? 2 : 1}
                  placeholder={
                    currentUser
                      ? "Tulis komentar atau pertanyaan terkait modul ini..."
                      : "Silakan masuk untuk menambahkan komentar..."
                  }
                  disabled={!currentUser || submittingComment}
                  className="w-full px-0 py-1.5 text-xs sm:text-sm bg-transparent border-b border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons (Cancel & Submit) */}
              {(isInputFocused || commentText.trim().length > 0) && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCommentText("");
                      setIsInputFocused(false);
                    }}
                    className="h-8 px-3 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={!currentUser || submittingComment || !commentText.trim()}
                    className="h-8 px-3.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 disabled:hover:bg-brand-600 disabled:cursor-not-allowed transition-colors"
                  >
                    {submittingComment ? "Mengirim..." : "Kirim"}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Comments Feed */}
          <div className="space-y-4 pt-2">
            {filteredComments.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-tertiary border border-dashed border-border rounded-2xl bg-surface-secondary/20 p-4">
                Belum ada komentar. Jadilah yang pertama memberikan pendapat tentang modul ini.
              </div>
            ) : (
              filteredComments.map((c) => {
                const isAuthor = currentUser && c.userId === currentUser.id;
                const isOwner = currentUser?.email === OWNER_EMAIL || (currentUser?.email && isAdminUser(currentUser.email));
                const canDelete = isAuthor || isOwner;

                const cReaction = commentLikes[c.id] || { liked: false, disliked: false, count: 0 };
                const initialChar = c.authorName?.charAt(0)?.toUpperCase() || "U";

                return (
                  <div key={c.id} className="flex items-start gap-3 group text-left">
                    {/* Author Circle Avatar */}
                    <div className="w-8 h-8 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-xs font-bold text-text-primary shrink-0 shadow-2xs mt-0.5">
                      {initialChar}
                    </div>

                    {/* Comment Content Block */}
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Author Info & Timestamp */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-text-primary hover:underline cursor-pointer">
                          @{c.authorName.toLowerCase().replace(/\s+/g, "_")}
                        </span>

                        {c.authorRole && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border">
                            {c.authorRole}
                          </span>
                        )}

                        <span className="text-[11px] text-text-tertiary font-normal">
                          {formatRelativeTime(c.createdAt)}
                        </span>

                        {c.targetName && c.targetId !== "module" && (
                          <span className="text-[10px] font-mono text-text-secondary bg-surface-secondary px-1.5 py-0.5 rounded border border-border">
                            di {c.targetName}
                          </span>
                        )}
                      </div>

                      {/* Comment Message Body */}
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed break-words whitespace-pre-wrap">
                        {c.content}
                      </p>

                      {/* Comment Action Toolbar: Like, Dislike, Reply, Delete */}
                      <div className="flex items-center gap-2 pt-1">
                        {/* Like Button */}
                        <button
                          type="button"
                          onClick={() => handleCommentReaction(c.id, "like")}
                          className={`flex items-center gap-1 p-1.5 rounded-full text-xs transition-colors ${
                            cReaction.liked
                              ? "text-emerald-500"
                              : "text-text-tertiary hover:text-text-primary"
                          }`}
                          title="Suka"
                        >
                          <ThumbsUp
                            className={`w-3.5 h-3.5 ${
                              cReaction.liked ? "fill-emerald-500 text-emerald-500" : ""
                            }`}
                          />
                          {cReaction.count > 0 && <span className="text-[11px] font-mono">{cReaction.count}</span>}
                        </button>

                        {/* Dislike Button */}
                        <button
                          type="button"
                          onClick={() => handleCommentReaction(c.id, "dislike")}
                          className={`flex items-center gap-1 p-1.5 rounded-full text-xs transition-colors ${
                            cReaction.disliked
                              ? "text-rose-500"
                              : "text-text-tertiary hover:text-text-primary"
                          }`}
                          title="Tidak Suka"
                        >
                          <ThumbsDown
                            className={`w-3.5 h-3.5 ${
                              cReaction.disliked ? "fill-rose-500 text-rose-500" : ""
                            }`}
                          />
                        </button>

                        {/* Reply Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (textareaRef.current) {
                              textareaRef.current.focus();
                              setCommentText(`@${c.authorName.toLowerCase().replace(/\s+/g, "_")} `);
                              setIsInputFocused(true);
                            }
                          }}
                          className="px-2 py-1 rounded-full text-[11px] font-semibold text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                        >
                          Balas
                        </button>

                        {/* Delete Comment (if Author or Owner) */}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(c.id)}
                            className="p-1.5 rounded-full text-text-tertiary hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100 ml-auto"
                            title="Hapus Komentar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

