// scripts/validate-dl-topic.ts
import { deepLearningCurriculum } from '../src/lib/curriculum/topics/12-deep-learning';

console.log('=== VALIDASI DETAIL TOPIK DEEP LEARNING (FULL: BAB 1-18) ===');
console.log('ID:', deepLearningCurriculum.id);
console.log('Title:', deepLearningCurriculum.title);
console.log('Version:', deepLearningCurriculum.version);
console.log('Level:', deepLearningCurriculum.level);
console.log('Audit Status:', deepLearningCurriculum.auditStatus);
console.log('Total Chapters:', deepLearningCurriculum.chapters.length);
console.log('Total Subchapters:', deepLearningCurriculum.chapters.reduce((a, c) => a + c.subchapters.length, 0));

let emptyConcept = 0;
let emptyCode = 0;
let emptyOutput = 0;
let placeholderCount = 0;
let totalSnippets = 0;

for (const ch of deepLearningCurriculum.chapters) {
  console.log(`\n[${ch.id}] ${ch.title} (${ch.subchapters.length} Subbab)`);
  for (const sub of ch.subchapters) {
    if (!sub.content_markdown || sub.content_markdown.length < 200) emptyConcept++;
    if (!sub.codeExamples || sub.codeExamples.length === 0) emptyCode++;
    else {
      totalSnippets += sub.codeExamples.length;
      if (!sub.codeExamples[0].expectedOutput) emptyOutput++;
    }
    if (sub.content_markdown.includes('lorem ipsum') || sub.content_markdown.includes('TODO')) placeholderCount++;
  }
}

console.log('\n--- RINGKASAN VALIDASI KONTEN ---');
console.log('Total Code Snippets:', totalSnippets);
console.log('Subchapters with short/empty markdown:', emptyConcept);
console.log('Subchapters with missing code:', emptyCode);
console.log('Subchapters with missing expected output:', emptyOutput);
console.log('Placeholders found:', placeholderCount);

if (emptyConcept === 0 && emptyCode === 0 && emptyOutput === 0 && placeholderCount === 0 && deepLearningCurriculum.chapters.length === 18 && totalSnippets === 180) {
  console.log('\n✅ VALIDASI 100% SUKSES: Semua 180 subbab Bab 1-18 terverifikasi substantif dan lengkap!');
} else {
  console.log('\n❌ VALIDASI GAGAL: Ditemukan kelemahan konten.');
  process.exit(1);
}
