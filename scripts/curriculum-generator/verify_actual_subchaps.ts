import { dataAnalystCurriculum } from "../../src/lib/curriculum/topics/09-data-analyst";
import { dataScienceCurriculum } from "../../src/lib/curriculum/topics/11-data-science";
import { machineLearningCurriculum } from "../../src/lib/curriculum/topics/19-machine-learning";
import { deepLearningCurriculum } from "../../src/lib/curriculum/topics/12-deep-learning";
import { aiFundamentalsCurriculum } from "../../src/lib/curriculum/topics/05-ai-fundamentals";
import { computerVisionCurriculum } from "../../src/lib/curriculum/topics/08-computer-vision";
import { naturalLanguageProcessingCurriculum } from "../../src/lib/curriculum/topics/22-natural-language-processing";
import { largeLanguageModelCurriculum } from "../../src/lib/curriculum/topics/18-large-language-model";

const list = [
  { name: "Data Analyst", curr: dataAnalystCurriculum, expectedUserCh: 10, expectedUserSub: 100, fullTargetSub: 100 },
  { name: "Data Science", curr: dataScienceCurriculum, expectedUserCh: 16, expectedUserSub: 160, fullTargetSub: 160 },
  { name: "Machine Learning", curr: machineLearningCurriculum, expectedUserCh: 22, expectedUserSub: 220, fullTargetSub: 220 },
  { name: "Deep Learning", curr: deepLearningCurriculum, expectedUserCh: 18, expectedUserSub: 180, fullTargetSub: 180 },
  { name: "AI Fundamentals", curr: aiFundamentalsCurriculum, expectedUserCh: 10, expectedUserSub: 100, fullTargetSub: 100 },
  { name: "Computer Vision", curr: computerVisionCurriculum, expectedUserCh: 18, expectedUserSub: 180, fullTargetSub: 180 },
  { name: "Natural Language Processing", curr: naturalLanguageProcessingCurriculum, expectedUserCh: 18, expectedUserSub: 180, fullTargetSub: 180 },
  { name: "Large Language Models (Topik 18)", curr: largeLanguageModelCurriculum, expectedUserCh: 18, expectedUserSub: 180, fullTargetSub: 180 }
];

console.log("=== AUDIT VERIFIKASI AKTUAL DATA KURIKULUM .TS ===");
console.log("Nama Topik".padEnd(32) + " | Bab Total | Subbab Total | Subbab Verified | Status Progres");
console.log("-".repeat(95));

let totalSubVerifiedAcrossPlatform = 0;

for (const item of list) {
  const chCount = item.curr.chapters.length;
  let subCount = 0;
  let substantiveVerifiedCount = 0;
  
  for (const ch of item.curr.chapters) {
    subCount += ch.subchapters.length;
    for (const sub of ch.subchapters) {
      if ((sub as any).contentStatus === "substantive-verified") {
        substantiveVerifiedCount++;
      }
    }
  }

  totalSubVerifiedAcrossPlatform += substantiveVerifiedCount;
  const progressPct = ((substantiveVerifiedCount / item.fullTargetSub) * 100).toFixed(1);
  const statusLabel = substantiveVerifiedCount === item.fullTargetSub 
    ? "SELESAI 100% (VERIFIED)" 
    : `PROGRES: ${substantiveVerifiedCount}/${item.fullTargetSub} (${progressPct}%)`;

  console.log(
    item.name.padEnd(32) + " | " +
    String(chCount).padEnd(9) + " | " +
    String(subCount).padEnd(12) + " | " +
    String(substantiveVerifiedCount).padEnd(15) + " | " +
    statusLabel
  );
}

console.log("-".repeat(95));
console.log(`TOTAL SUBBAB TERVERIFIKASI SUBSTANTIF DI SELURUH PLATFORM: ${totalSubVerifiedAcrossPlatform} SUBBAB`);
