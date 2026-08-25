import { ChatDialogueTurn, ConversationSummary } from "./types";

/**
 * Intelligent Rolling Conversation Summarizer
 */
export function generateConversationSummary(
  history: ChatDialogueTurn[],
  previousSummary?: ConversationSummary
): ConversationSummary | undefined {
  if (!history || history.length < 4) {
    return previousSummary;
  }

  // Extract key topics, goals, and decisions from history
  const userTurns = history.filter((t) => t.role === "user");

  if (userTurns.length === 0) return undefined;

  // Extract main topic
  const initialTurn = userTurns[0].text;
  const recentTurn = userTurns[userTurns.length - 1].text;

  const topic = previousSummary?.topic || initialTurn.slice(0, 60);

  // Extract goals
  const goals: string[] = previousSummary?.goals ? [...previousSummary.goals] : [];
  if (goals.length === 0) {
    goals.push(`Mendalami topik: ${initialTurn.slice(0, 50)}`);
  }

  // Extract decisions & constraints
  const decisions: string[] = previousSummary?.decisions ? [...previousSummary.decisions] : [];
  const constraints: string[] = previousSummary?.constraints ? [...previousSummary.constraints] : [];

  for (const turn of userTurns) {
    const textLower = turn.text.toLowerCase();

    // Check for constraints & preferences
    if (textLower.includes("tidak") || textLower.includes("jangan") || textLower.includes("tanpa")) {
      if (!constraints.some((c) => c.toLowerCase() === turn.text.toLowerCase())) {
        constraints.push(turn.text.slice(0, 80));
      }
    }

    // Check for decisions
    if (textLower.includes("pilih") || textLower.includes("gunakan") || textLower.includes("pakai") || textLower.includes("arsitektur")) {
      if (!decisions.some((d) => d.toLowerCase() === turn.text.toLowerCase())) {
        decisions.push(turn.text.slice(0, 80));
      }
    }
  }

  return {
    topic,
    goals: goals.slice(0, 3),
    decisions: decisions.slice(0, 4),
    constraints: constraints.slice(0, 3),
    activeTask: recentTurn.slice(0, 80),
    lastUpdatedTurn: history.length,
  };
}

/**
 * Format conversation summary for injection into system prompt
 */
export function formatSummaryForPrompt(summary?: ConversationSummary): string {
  if (!summary) return "";

  const goalsList = summary.goals.map((g) => `- ${g}`).join("\n");
  const decisionsList = summary.decisions.length > 0
    ? `\nKeputusan Sebelumnya:\n${summary.decisions.map((d) => `- ${d}`).join("\n")}`
    : "";
  const constraintsList = summary.constraints.length > 0
    ? `\nBatasan/Preferensi:\n${summary.constraints.map((c) => `- ${c}`).join("\n")}`
    : "";
  const activeTask = summary.activeTask ? `\nFokus Saat Ini: ${summary.activeTask}` : "";

  return `
[RINGKASAN PERCAKAPAN BERJALAN (CONVERSATION SUMMARY)]
Topik Diskusi: ${summary.topic}
Tujuan Utama:
${goalsList}${decisionsList}${constraintsList}${activeTask}
`;
}
