"use client";

import React from "react";
import { CheckCircle2, XCircle, RotateCcw, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/actions/quiz-actions";

interface QuizResultViewProps {
  quizTitle: string;
  questions: QuizQuestion[];
  userAnswers: Record<number, number>;
  onRetry: () => void;
  onNewQuiz: () => void;
}

export function QuizResultView({
  quizTitle,
  questions,
  userAnswers,
  onRetry,
  onNewQuiz,
}: QuizResultViewProps) {
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });

  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* 1. Score Summary Banner */}
      <div className="p-5 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
              Hasil Evaluasi Kuis
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              {quizTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black font-mono text-brand-600 dark:text-brand-400">
                {percentage}%
              </span>
              <span className="text-[11px] font-mono text-text-tertiary block">
                {correctCount} dari {totalQuestions} benar
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-border bg-surface-secondary text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-text-secondary">Jawaban Benar:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-text-secondary">Jawaban Salah:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {totalQuestions - correctCount}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary cursor-pointer"
            aria-label="Ulangi kuis ini"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Kuis</span>
          </Button>

          <Button
            size="sm"
            onClick={onNewQuiz}
            className="gap-1.5 text-xs font-semibold shadow-2xs cursor-pointer"
            aria-label="Buat kuis baru"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Kuis Baru</span>
          </Button>
        </div>
      </div>

      {/* 2. Question Review List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Pembahasan & Tinjauan Soal</span>
        </h3>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            const correctLetter = String.fromCharCode(65 + q.correctAnswer);
            const userLetter =
              userAnswer !== undefined ? String.fromCharCode(65 + userAnswer) : "-";

            return (
              <div
                key={q.id || idx}
                className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3 shadow-2xs"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold font-mono text-brand-600 dark:text-brand-400">
                    Soal {idx + 1}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                      isCorrect
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Benar</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Belum Tepat</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Question Content */}
                <p className="text-xs sm:text-sm font-semibold text-text-primary leading-relaxed font-sans">
                  {q.question}
                </p>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg bg-surface-secondary border border-border/80">
                  <div className="space-y-0.5">
                    <span className="text-text-tertiary block text-[10px]">Jawaban Anda:</span>
                    <span
                      className={`font-semibold ${
                        isCorrect
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {userLetter}. {userAnswer !== undefined ? q.options[userAnswer] : "Tidak Dijawab"}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-text-tertiary block text-[10px]">Jawaban Benar:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {correctLetter}. {q.options[q.correctAnswer]}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="text-xs leading-relaxed text-text-secondary bg-brand-500/5 p-3 rounded-lg border border-brand-500/15 space-y-1">
                    <span className="font-bold text-brand-600 dark:text-brand-400 font-mono text-[11px] block">
                      Pembahasan:
                    </span>
                    <p className="font-sans">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
