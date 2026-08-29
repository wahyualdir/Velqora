"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PageContainer } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { generateAIQuizAction, QuizQuestion } from "@/actions/quiz-actions";
import { addEXP } from "@/lib/gamification-service";
import { QuizHeader } from "@/components/quiz/quiz-header";
import { QuizSetupForm } from "@/components/quiz/quiz-setup-form";
import { QuizSession } from "@/components/quiz/quiz-session";
import { QuizResultView } from "@/components/quiz/quiz-result-view";

function AIQuizContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";

  // Setup State
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<"mudah" | "sedang" | "sulit">("sedang");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [customContext, setCustomContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; content: string } | null>(null);

  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    if (urlTopic) {
      setTopic(urlTopic);
    }
  }, [searchParams]);

  // Quiz Execution State
  const [quizState, setQuizState] = useState<"setup" | "playing" | "finished">("setup");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  // File Upload Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran berkas maksimal 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setAttachedFile({
        name: file.name,
        size: sizeStr,
        content: content || "",
      });

      if (!topic.trim()) {
        setTopic(`Evaluasi Berkas: ${file.name}`);
      }

      toast.success(`Berkas "${file.name}" berhasil terlampir untuk kuis!`);
    };

    reader.readAsText(file);
  };

  // Generate Quiz Handler
  const handleGenerateQuiz = async (overrideTopic?: string) => {
    const selectedTopic = overrideTopic || topic;

    if (!selectedTopic.trim() && !attachedFile) {
      toast.error("Silakan pilih topik atau unggah berkas materi kuis terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const result = await generateAIQuizAction(
        selectedTopic || `Kuis: ${attachedFile?.name}`,
        difficulty,
        questionCount,
        customContext,
        attachedFile ? { fileName: attachedFile.name, fileContent: attachedFile.content } : undefined
      );

      if (!result.questions || result.questions.length === 0) {
        toast.error("Gagal menghasilkan soal kuis. Silakan coba lagi.");
        return;
      }

      setQuizTitle(result.title);
      setQuestions(result.questions);
      setCurrentIndex(0);
      setUserAnswers({});
      setQuizState("playing");
      toast.success(`Kuis berhasil disusun! Terdapat ${result.questions.length} soal evaluasi.`);
    } catch (err: any) {
      console.error("Gagal menghasilkan kuis:", err);
      toast.error("Terjadi kendala saat menyusun soal kuis AI.");
    } finally {
      setLoading(false);
    }
  };

  // Option Selection Handler
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  // Question Navigation
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Submit Quiz Handler
  const handleSubmitQuiz = () => {
    setQuizState("finished");

    // Calculate EXP rewards
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const expGained = correct * 20 + 10;
    addEXP(expGained);
    toast.success(`Evaluasi selesai! Anda memperoleh +${expGained} EXP.`);
  };

  // Reset / Retry Handlers
  const handleResetToSetup = () => {
    setQuizState("setup");
    setCurrentIndex(0);
    setUserAnswers({});
  };

  const handleRetrySameQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setQuizState("playing");
    toast.info("Kuis dimulai kembali.");
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <SubNavTabs category="ai" />

        {/* Workspace Header */}
        <QuizHeader quizState={quizState} onReset={handleResetToSetup} />

        {/* Dynamic State Layout */}
        {quizState === "setup" && (
          <QuizSetupForm
            topic={topic}
            onChangeTopic={setTopic}
            difficulty={difficulty}
            onChangeDifficulty={setDifficulty}
            questionCount={questionCount}
            onChangeQuestionCount={setQuestionCount}
            customContext={customContext}
            onChangeCustomContext={setCustomContext}
            attachedFile={attachedFile}
            onClearFile={() => setAttachedFile(null)}
            onSelectFile={handleFileSelect}
            loading={loading}
            onSubmit={handleGenerateQuiz}
          />
        )}

        {quizState === "playing" && (
          <QuizSession
            quizTitle={quizTitle}
            questions={questions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            onSelectOption={handleSelectOption}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmitQuiz={handleSubmitQuiz}
            difficulty={difficulty}
          />
        )}

        {quizState === "finished" && (
          <QuizResultView
            quizTitle={quizTitle}
            questions={questions}
            userAnswers={userAnswers}
            onRetry={handleRetrySameQuiz}
            onNewQuiz={handleResetToSetup}
          />
        )}
      </div>
    </PageContainer>
  );
}

export default function AIQuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-tertiary">Memuat Kuis AI...</div>}>
      <AIQuizContent />
    </Suspense>
  );
}
