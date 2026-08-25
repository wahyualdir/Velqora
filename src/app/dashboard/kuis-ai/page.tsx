"use client";

// Interactive AI Quiz Page Component with File Attachment Support
import { useState, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  BookOpen,
  BrainCircuit,
  Code,
  Database,
  Layers,
  Terminal,
  Loader2,
  FileText,
  Upload,
  FileCode,
  Trash2,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { generateAIQuizAction, QuizQuestion } from "@/actions/quiz-actions";
import { addEXP } from "@/lib/gamification-service";
import {
  PythonIcon,
  ReactIcon,
  TypeScriptIcon,
  SupabaseIcon,
  GeminiIcon,
  TailwindIcon,
  AntigravityIcon,
} from "@/components/ui/brand-logos";

const PRESET_TOPICS = [
  { label: "Python Fundamentals", icon: PythonIcon, color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300" },
  { label: "React & Next.js Web Dev", icon: ReactIcon, color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-300" },
  { label: "TypeScript & Modern JS", icon: TypeScriptIcon, color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300" },
  { label: "SQL & Supabase Database", icon: SupabaseIcon, color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300" },
  { label: "Kecerdasan Buatan (Google Gemini)", icon: GeminiIcon, color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300" },
  { label: "Antigravity & Agentic AI", icon: AntigravityIcon, color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300" },
  { label: "Tailwind CSS & UI Styling", icon: TailwindIcon, color: "from-sky-500/20 to-cyan-500/20 border-sky-500/30 text-sky-300" },
];

export default function AIQuizPage() {
  // Setup State
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"mudah" | "sedang" | "sulit">("sedang");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [customContext, setCustomContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for quiz file
      toast.error("Ukuran berkas maksimal 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setAttachedFile({
        name: file.name,
        size: sizeStr,
        content: content || "",
      });

      // Auto-set topic title to file name if empty
      if (!topic.trim()) {
        setTopic(`Evaluasi Berkas: ${file.name}`);
      }

      toast.success(`Berkas "${file.name}" berhasil terlampir untuk kuis!`);
    };

    reader.readAsText(file);
  };

  // Quiz Execution State
  const [quizState, setQuizState] = useState<"setup" | "playing" | "finished">("setup");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Score Calculations
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

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
      setQuizTitle(result.title);
      setQuestions(result.questions);
      setCurrentIndex(0);
      setUserAnswers({});
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setQuizState("playing");
      toast.success("Kuis AI berhasil dibuat! Selamat mengerjakan.");
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat kuis");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      toast.error("Pilih salah satu jawaban terlebih dahulu.");
      return;
    }
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizState("finished");
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer) correctCount++;
      });
      const earnedEXP = Math.max(30, correctCount * 25);
      const res = addEXP(earnedEXP);
      if (res.levelUp) {
        toast.success(`Selamat! Anda naik ke ${res.newLevelTitle}! Total EXP: ${res.newEXP}`);
      } else {
        toast.success(`Selamat! Anda mendapatkan +${earnedEXP} EXP (${correctCount}/${questions.length} benar).`);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizState("playing");
  };

  const currentQ = questions[currentIndex];
  const scoreResult = quizState === "finished" ? calculateScore() : null;

  return (
    <div className="page-container space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* Page Title Header */}
      <PageHeader
        eyebrow="~/assessment"
        technicalMark="< adaptive // testing />"
        title="Uji pemahamanmu"
        description="Coba latihan soal adaptif untuk mengukur seberapa dalam pemahaman konsepmu."
      />

      {/* =========================================================
          MODE 1: SETUP KUIS
          ========================================================= */}
      {quizState === "setup" && (
        <div className="space-y-6 animate-fade-in">
          {/* Preset Topics */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" />
              Pilih Topik Pembelajaran
            </h2>

            <div className="card-grid">
              {PRESET_TOPICS.map((pt) => {
                const Icon = pt.icon;
                const isSelected = topic === pt.label;
                return (
                  <button
                    key={pt.label}
                    onClick={() => setTopic(pt.label)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-semibold transition-all duration-150 ${
                      isSelected
                        ? "bg-brand-600/15 border-brand-500/50 text-text-primary shadow-sm"
                        : "bg-surface hover:bg-surface-secondary border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{pt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Topic Input & Parameters Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface space-y-5 shadow-xs dark:before:pointer-events-none dark:before:absolute dark:before:inset-x-0 dark:before:top-0 dark:before:h-px dark:before:bg-white/[0.08] relative overflow-hidden">
            {/* Input Topik Kustom */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-primary block font-display">
                Atau Ketik Topik Kuis Kustom:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Dasar Machine Learning, Docker & Kubernetes, Pemrograman C++..."
                className="w-full py-2.5 px-4 rounded-xl border border-border bg-surface-secondary text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors font-sans"
              />
            </div>

            {/* Tingkat Kesulitan & Jumlah Soal (Bebas 1 - 50 Soal) */}
            <div className="space-y-4 pt-2">
              {/* Difficulty */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-primary block font-display">Tingkat Kesulitan:</label>
                <div className="flex items-center gap-2">
                  {(["mudah", "sedang", "sulit"] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                        difficulty === d
                          ? d === "mudah"
                            ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                            : d === "sedang"
                            ? "bg-brand-500/15 border-brand-500/35 text-brand-600 dark:text-brand-400 shadow-2xs"
                            : "bg-amber-500/15 border-amber-500/35 text-amber-600 dark:text-amber-400 shadow-2xs"
                          : "bg-surface-secondary border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count Selector (Slider + Direct Input 1 to 50 + Preset Chips) */}
              <div className="space-y-3 p-4 rounded-xl bg-surface-secondary/70 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-text-primary block font-display">
                      Jumlah Butir Soal Kuis (Maksimal 50):
                    </label>
                    <span className="text-[10px] text-text-tertiary">
                      Tentukan bebas dari 1 hingga 50 soal
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-text-tertiary">Total:</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={questionCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (isNaN(val)) setQuestionCount(1);
                        else setQuestionCount(Math.min(50, Math.max(1, val)));
                      }}
                      className="w-16 h-8 text-center text-xs font-mono font-bold rounded-lg border border-brand-500/40 bg-brand-500/10 text-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                    />
                    <span className="text-xs font-bold text-text-secondary">Soal</span>
                  </div>
                </div>

                {/* Interactive Range Slider (1 to 50) */}
                <div className="space-y-1.5 pt-1">
                  <input
                    type="range"
                    min={1}
                    max={50}
                    step={1}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-text-tertiary">
                    <span>1 Soal</span>
                    <span>15</span>
                    <span>25</span>
                    <span>35</span>
                    <span className="font-bold text-brand-400">50 Soal (Maks)</span>
                  </div>
                </div>

                {/* Quick Select Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border">
                  <span className="text-[10px] font-semibold text-text-tertiary mr-1 font-mono">PILIHAN:</span>
                  {[5, 10, 15, 20, 25, 30, 40, 50].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                        questionCount === cnt
                          ? "bg-brand-600 text-white shadow-2xs border border-brand-500"
                          : "bg-surface text-text-secondary hover:bg-surface-tertiary hover:text-text-primary border border-border"
                      }`}
                    >
                      {cnt} Soal {cnt === 50 && "(Maks)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Notes / Material Context & File Upload */}
            <div className="space-y-3 pt-2 border-t border-border">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".txt,.pdf,.py,.js,.ts,.json,.md,.html,.css,.sql,.doc,.docx"
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-primary block font-display">
                  Unggah Berkas Modul / Catatan Materi:
                </label>
                <span className="text-[10px] font-mono text-brand-400">.txt, .pdf, .py, .js, .json, .md</span>
              </div>

              {!attachedFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2.5 p-4 rounded-xl border border-dashed border-border hover:border-brand-500/50 bg-surface-secondary/40 hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-all duration-200 group cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Pilih Berkas Materi (.pdf, .txt, .py, .md)</span>
                </button>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileCode className="w-5 h-5 text-brand-400 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="font-semibold text-text-primary block truncate">{attachedFile.name}</span>
                      <span className="text-[10px] font-mono text-brand-400">{attachedFile.size} • Siap diuji oleh AI</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    title="Hapus Berkas"
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <label className="text-xs font-semibold text-text-primary flex items-center justify-between font-display">
                  <span>Catatan Teks Tambahan (Opsional):</span>
                  <span className="text-[10px] text-text-tertiary font-normal">Informasi opsional penjelas</span>
                </label>
                <textarea
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="Tempelkan ringkasan materi tambahan atau poin penting di sini..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-border bg-surface-secondary text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 resize-none transition-colors"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => handleGenerateQuiz()}
              disabled={loading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI sedang meracik {questionCount} butir kuis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Buat Kuis ({questionCount} Soal)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODE 2: MEMERIKSA & MENJAWAB KUIS (PLAYING)
          ========================================================= */}
      {quizState === "playing" && currentQ && (
        <div className="space-y-5 animate-fade-in">
          {/* Progress Header Bar */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface space-y-3 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-wider block">
                  {quizTitle}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-text-primary font-display">
                  Soal {currentIndex + 1} dari {questions.length}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/25 capitalize">
                  {difficulty}
                </span>
                <button
                  onClick={() => setQuizState("setup")}
                  className="text-xs text-text-tertiary hover:text-text-primary underline ml-2 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-surface-secondary border border-border/60 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-brand-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* CBT Style Question Navigator Pills (Especially Useful for up to 50 Questions) */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-[11px] text-text-tertiary mb-2 font-mono">
                <span>Navigasi Soal ({Object.keys(userAnswers).length}/{questions.length} terjawab):</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                {questions.map((_, idx) => {
                  const isCurrent = currentIndex === idx;
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isCorrect = userAnswers[idx] === questions[idx]?.correctAnswer;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setSelectedOption(userAnswers[idx] ?? null);
                        setIsAnswerSubmitted(userAnswers[idx] !== undefined);
                      }}
                      className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-brand-600 text-white ring-2 ring-brand-400 shadow-xs scale-105"
                          : isAnswered
                          ? isCorrect
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/15 text-red-600 dark:text-red-400 border border-rose-500/30"
                          : "bg-surface-secondary text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary border border-border"
                      }`}
                      title={`Pindah ke Soal ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface space-y-6 shadow-xs dark:before:pointer-events-none dark:before:absolute dark:before:inset-x-0 dark:before:top-0 dark:before:h-px dark:before:bg-white/[0.08] relative overflow-hidden">
            <h2 className="text-base sm:text-lg font-bold text-text-primary leading-relaxed font-display">
              {currentIndex + 1}. {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswer;

                let optionStyle =
                  "border-border bg-surface-secondary/50 text-text-secondary hover:bg-surface-secondary hover:border-border-hover hover:text-text-primary";

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle =
                      "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-semibold shadow-xs";
                  } else if (isSelected) {
                    optionStyle = "border-rose-500/50 bg-rose-500/10 text-red-600 dark:text-red-300 font-semibold";
                  } else {
                    optionStyle = "border-border/60 bg-surface-secondary/20 text-text-tertiary opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle =
                    "border-brand-500 bg-brand-500/10 text-text-primary font-semibold shadow-xs";
                }

                const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 cursor-pointer ${optionStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 text-text-primary">
                      {optionLetter}
                    </span>
                    <span className="flex-1">{opt}</span>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Banner */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl border border-brand-500/30 bg-brand-500/5 space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-400 font-display">
                  <HelpCircle className="w-4 h-4 text-brand-400" />
                  <span>Pembahasan AI:</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
              {/* Back button if not at first question */}
              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx = currentIndex - 1;
                    setCurrentIndex(prevIdx);
                    setSelectedOption(userAnswers[prevIdx] ?? null);
                    setIsAnswerSubmitted(userAnswers[prevIdx] !== undefined);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer border border-border"
                >
                  ‹ Soal Sebelumnya
                </button>
              )}

              <div className="ml-auto flex items-center gap-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                  >
                    Verifikasi Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>{currentIndex < questions.length - 1 ? "Soal Berikutnya" : "Lihat Hasil Akhir"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODE 3: HASIL KUIS & SKOR (FINISHED)
          ========================================================= */}
      {quizState === "finished" && scoreResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Victory Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface text-center space-y-5 shadow-xs relative overflow-hidden dark:before:pointer-events-none dark:before:absolute dark:before:inset-x-0 dark:before:top-0 dark:before:h-px dark:before:bg-white/[0.08]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-500 shadow-xs">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-display">Kuis Selesai!</h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                {scoreResult.percentage >= 80
                  ? "Luar biasa! Pemahaman Anda sangat tinggi pada topik ini."
                  : scoreResult.percentage >= 60
                  ? "Bagus! Terus tingkatkan pemahaman materi ini."
                  : "Jangan berkecil hati! Pelajari kembali penjelasan soal di bawah."}
              </p>
            </div>

            {/* Score Pill */}
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl border border-border bg-surface-secondary">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-bold text-amber-500 dark:text-amber-400 font-mono block">{scoreResult.percentage}%</span>
                <span className="text-[10px] font-mono text-text-tertiary font-semibold uppercase">Skor Akhir</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-left text-xs font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block">{scoreResult.correct} Benar</span>
                <span className="text-red-600 dark:text-red-400 font-bold block">{scoreResult.total - scoreResult.correct} Salah</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestartQuiz}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-tertiary text-xs font-semibold text-text-primary transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-text-tertiary" />
                <span>Ulangi Kuis Ini</span>
              </button>

              <button
                onClick={() => setQuizState("setup")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buat Kuis Topik Lain</span>
              </button>
            </div>
          </div>

          {/* Breakdown Review List */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 font-display">
              <FileText className="w-4 h-4 text-brand-400" /> Review Seluruh Pembahasan Soal
            </h3>

            <div className="space-y-4 divide-y divide-border">
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div key={q.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-text-primary font-display">
                        {idx + 1}. {q.question}
                      </span>
                      {isCorrect ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0">
                          BENAR
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-red-600 dark:text-red-400 border border-rose-500/25 shrink-0">
                          SALAH
                        </span>
                      )}
                    </div>

                    <div className="pl-3 border-l-2 border-brand-500 space-y-1 text-text-secondary">
                      <p>
                        Jawaban Anda:{" "}
                        <strong className={isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                          {userAns !== undefined ? q.options[userAns] : "Tidak dijawab"}
                        </strong>
                      </p>
                      {!isCorrect && (
                        <p>
                          Jawaban Benar:{" "}
                          <strong className="text-emerald-600 dark:text-emerald-400">{q.options[q.correctAnswer]}</strong>
                        </p>
                      )}
                      <p className="text-text-tertiary pt-1 leading-relaxed">Pembahasan: {q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
