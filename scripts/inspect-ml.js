const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

const files = fs.readdirSync(dir).filter(f => f.match(/^chunk\d+-ch\d+\.ts$/)).sort();
console.log(`Found ${files.length} active chapter files:`);

let totalSubchapters = 0;
const chaptersInfo = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  
  // Match id: "machine-learning-ch-..." or "id": "machine-learning-ch-..."
  const idMatch = content.match(/["']?id["']?\s*:\s*["'](machine-learning-ch-\d+)["']/);
  const titleMatch = content.match(/["']?title["']?\s*:\s*["']([^"']+)["']/);
  const orderMatch = content.match(/["']?orderIndex["']?\s*:\s*(\d+)/);
  
  // Count subchapters: each subchapter object has orderIndex inside subchapters array, or createSubchapter / { id: "ml-
  // Let's count subchapters via regex matching `["']?id["']?\s*:\s*["']ml-\d+-\d+`
  const subMatches = content.match(/["']?id["']?\s*:\s*["']ml-\d+-\d+[^"']*["']/g) || [];
  const nSubs = subMatches.length;
  totalSubchapters += nSubs;
  
  chaptersInfo.push({
    file: f,
    id: idMatch ? idMatch[1] : 'N/A',
    order: orderMatch ? parseInt(orderMatch[1]) : 0,
    title: titleMatch ? titleMatch[1] : 'N/A',
    subchaptersCount: nSubs
  });
});

chaptersInfo.sort((a, b) => a.order - b.order);

chaptersInfo.forEach(c => {
  console.log(`Bab ${String(c.order).padStart(2, '0')} [${c.id}]: ${c.title} -> ${c.subchaptersCount} subbab (${c.file})`);
});

console.log("\n=================================");
console.log(`TOTAL ACTIVE CHAPTERS: ${chaptersInfo.length}`);
console.log(`TOTAL SUBCHAPTERS: ${totalSubchapters}`);
console.log("=================================");
