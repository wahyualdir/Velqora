const fs = require('fs');
const content = fs.readFileSync('src/lib/curriculum/topics/machine-learning/chunk1-ch04.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('title: "04.')) {
    console.log(idx + 1, line.trim());
  }
});
