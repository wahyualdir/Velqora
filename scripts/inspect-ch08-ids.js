const fs = require('fs');
const content = fs.readFileSync('src/lib/curriculum/topics/machine-learning/chunk2-ch08.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('"id": "ml-08-') || l.includes('"slug": "08-')) {
    console.log(idx + 1, l.trim());
  }
});
