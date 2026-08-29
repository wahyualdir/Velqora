import {
  HealthTrendReport,
  HealthTrendDirection,
} from "./types";

export interface HistoricalHealthEntry {
  score: number;
  recordedAt: string;
}

/**
 * Evaluates chronological Academic Health Score trends.
 * Never invents fake trends if historical baseline data is absent.
 */
export function evaluateHealthTrend(
  currentScore: number,
  history: HistoricalHealthEntry[] = []
): HealthTrendReport {
  if (!history || history.length === 0) {
    return {
      currentScore,
      previousScore: null,
      scoreDelta: 0,
      trend: "INSUFFICIENT_DATA",
      historicalSnapshotsCount: 1,
      statusLabel: "Data Awal",
      explanation:
        "Skor kesehatan akademik saat ini adalah baseline awal. Tren perkembangan akan dihitung setelah ada riwayat evaluasi berikutnya.",
    };
  }

  // Get most recent past entry
  const previousEntry = history[history.length - 1];
  const prevScore = previousEntry.score;
  const delta = currentScore - prevScore;

  let trend: HealthTrendDirection = "STABLE";
  let statusLabel = "Stabil";
  let explanation = `Kesehatan jadwal akademik stabil di angka ${currentScore}/100 dibandingkan periode sebelumnya (${prevScore}/100).`;

  if (delta >= 3) {
    trend = "IMPROVING";
    statusLabel = "Meningkat (+ " + delta + ")";
    explanation = `Kesehatan jadwal akademik meningkat sebesar +${delta} poin dari ${prevScore} menjadi ${currentScore}/100. Distribusi beban dan cakupan deadline berada pada kondisi optimal.`;
  } else if (delta <= -3) {
    trend = "DECLINING";
    statusLabel = "Menurun (" + delta + ")";
    explanation = `Kesehatan jadwal akademik mengalami penurunan sebesar ${delta} poin dari ${prevScore} menjadi ${currentScore}/100. Periksa peringatan dini terkait bentrok atau akumulasi beban harian.`;
  }

  return {
    currentScore,
    previousScore: prevScore,
    scoreDelta: delta,
    trend,
    historicalSnapshotsCount: history.length + 1,
    statusLabel,
    explanation,
  };
}
