const fs = require('fs');
const content = fs.readFileSync('src/lib/curriculum/topics/machine-learning/chunk2-ch07.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('"id": "ml-07-') || l.includes('"slug": "07-')) {
    console.log(idx + 1, l.trim());
  }
});
