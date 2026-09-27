const fs = require('fs');
const files = ['chunk2-ch06.ts', 'chunk2-ch07.ts', 'chunk2-ch08.ts', 'chunk2-ch09.ts'];

files.forEach(f => {
  const p = `src/lib/curriculum/topics/machine-learning/${f}`;
  const content = fs.readFileSync(p, 'utf8');
  console.log(`=== ${f} ===`);
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('title') && (l.includes('0') || l.includes('BAB'))) {
      console.log(`  ${idx+1}: ${l.trim()}`);
    }
  });
});
