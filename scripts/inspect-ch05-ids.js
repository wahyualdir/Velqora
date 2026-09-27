const fs = require('fs');
const content = fs.readFileSync('src/lib/curriculum/topics/machine-learning/chunk1-ch05.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('id: "ml-05-') || line.includes('slug: "05-')) {
    console.log(idx + 1, line.trim());
  }
});
