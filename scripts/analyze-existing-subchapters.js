const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');
const files = fs.readdirSync(dir).filter(f => f.startsWith('chunk') && f.includes('-ch')).sort();

const allSubs = [];
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const chMatch = content.match(/id:\s*["'](machine-learning-ch-\d+)["']/);
  const chId = chMatch ? chMatch[1] : f;
  
  // match each subchapter block roughly
  const subRegex = /title:\s*["']([^"']+)["']/g;
  let match;
  while ((match = subRegex.exec(content)) !== null) {
    if (match[1].startsWith('BAB ')) continue;
    allSubs.push({
      file: f,
      chapter: chId,
      title: match[1]
    });
  }
});

console.log(`Total subchapters across existing files: ${allSubs.length}`);
console.log('Sample subchapters:');
allSubs.slice(0, 30).forEach(s => console.log(`[${s.file}] ${s.title}`));
