const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'apps/web/src/app/sports'),
  path.join(__dirname, 'apps/web/src/components/sports')
];

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fileDir = path.join(dir, file);
    const stat = fs.statSync(fileDir);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fileDir));
    } else if (fileDir.endsWith('.tsx') || fileDir.endsWith('.ts')) {
      results.push(fileDir);
    }
  });
  return results;
}

let files = [];
dirs.forEach(d => files = files.concat(walk(d)));

const replacements = [
  { rx: /bg-surface-container-low/g, repl: 'bg-news-card' },
  { rx: /bg-surface-container-high/g, repl: 'bg-news-border' },
  { rx: /bg-surface-container/g, repl: 'bg-news-card' },
  { rx: /bg-surface/g, repl: 'bg-news-card' },
  { rx: /border-outline-variant/g, repl: 'border-news-border' },
  { rx: /border-outline/g, repl: 'border-news-border' },
  { rx: /text-on-surface-variant/g, repl: 'text-news-text-secondary' },
  { rx: /text-on-surface/g, repl: 'text-news-text' },
  { rx: /text-outline/g, repl: 'text-news-text-muted' },
  
  // Also we need to fix the explicit light ones that I left:
  // e.g. "bg-white dark:bg-news-card" or "bg-[#e2e6eb] dark:bg-news-card"
  // Wait, let's just make sure "bg-[#e2e6eb]" doesn't override dark mode if the class is missing.
  // Actually, wait, Tailwind needs BOTH if we're using arbitrary colors like "bg-[#e2e6eb] dark:bg-[#111111]"
  // In tailwind, if you just say `bg-[#e2e6eb]`, it's light and dark. 
  // If we change it to `bg-news-card`, it will automatically use the light variable in light mode and dark in dark mode!
  // So we can replace `bg-white dark:bg-news-card` with just `bg-news-card`.
  { rx: /bg-white dark:bg-news-card/g, repl: 'bg-news-card' },
  { rx: /bg-\[\#e2e6eb\] dark:bg-news-card/g, repl: 'bg-news-card' },
  { rx: /bg-\[\#e8eaf0\] dark:bg-news-card/g, repl: 'bg-news-card' },
  { rx: /bg-\[\#f9fafb\] dark:bg-background/g, repl: 'bg-background' },
];

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({rx, repl}) => {
    content = content.replace(rx, repl);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
    changedFiles++;
  }
});

console.log('Total files updated: ' + changedFiles);
