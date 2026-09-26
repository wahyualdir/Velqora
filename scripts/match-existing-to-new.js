const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');
const files = fs.readdirSync(dir).filter(f => f.startsWith('chunk') && f.includes('-ch')).sort();

const existingSubs = [];
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  // extract subchapters
  const matches = [...content.matchAll(/title:\s*["'](\d+\.\d+[^"']+)["']/g)];
  matches.forEach(m => {
    existingSubs.push({
      file: f,
      title: m[1]
    });
  });
});

console.log(`Total existing subchapters found: ${existingSubs.length}`);
existingSubs.forEach(s => {
  console.log(`[${s.file}] ${s.title}`);
});
