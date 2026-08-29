"use client";

import React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/actions/quiz-actions";

interface QuizSessionProps {
  quizTitle: string;
  questions: QuizQuestion[];
  currentIndex: number;
  userAnswers: Record<number, number>;
  onSelectOption: (optionIndex: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmitQuiz: () => void;
  difficulty: string;
}

export function QuizSession({
  quizTitle,
  questions,
  currentIndex,
  userAnswers,
  onSelectOption,
  onPrevious,
  onNext,
  onSubmitQuiz,
  difficulty,
}: QuizSessionProps) {
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const totalQuestions = questions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const selectedAnswer = userAnswers[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Session Progress Header */}
      <div className="p-4 rounded-xl border border-border bg-surface space-y-3 shadow-2xs">
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">
              Soal {currentIndex + 1} dari {totalQuestions}
            </span>
            <span className="text-text-tertiary">|</span>
            <span className="text-text-secondary truncate max-w-[200px] sm:max-w-xs">
              {quizTitle}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            {difficulty}
          </span>
        </div>

        {/* Linear Progress Track */}
        <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden border border-border/50">
          <div
            className="bg-brand-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-5 sm:p-6 rounded-xl border border-border bg-surface space-y-6 shadow-2xs">
        {/* Question Text */}
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            Pertanyaan
          </span>
          <h2 className="text-base sm:text-lg font-semibold text-text-primary leading-relaxed font-sans">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-2.5" role="radiogroup" aria-label="Pilihan jawaban">
          {currentQuestion.options.map((opt, optIdx) => {
            const isSelected = selectedAnswer === optIdx;
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

            return (
              <button
                key={optIdx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectOption(optIdx)}
                className={`w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left min-h-[48px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400 shadow-2xs font-medium"
                    : "bg-surface-secondary/60 border-border text-text-primary hover:border-border-hover hover:bg-surface-secondary"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 border ${
                    isSelected
                      ? "bg-brand-500 text-white border-brand-600"
                      : "bg-surface border-border text-text-secondary"
                  }`}
                >
                  {letter}
                </div>
                <span className="text-xs sm:text-sm leading-relaxed flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Question Navigation Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/70">
          <Button
            size="sm"
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className="gap-1.5 text-xs text-text-secondary cursor-pointer disabled:opacity-40"
            aria-label="Soal sebelumnya"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </Button>

          {isLast ? (
            <Button
              size="sm"
              onClick={onSubmitQuiz}
              disabled={selectedAnswer === undefined}
              className="gap-1.5 text-xs font-semibold px-4 cursor-pointer shadow-2xs"
              aria-label="Selesaikan kuis"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesaikan Kuis</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onNext}
              disabled={selectedAnswer === undefined}
              className="gap-1.5 text-xs font-semibold px-4 cursor-pointer shadow-2xs"
              aria-label="Soal berikutnya"
            >
              <span>Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
