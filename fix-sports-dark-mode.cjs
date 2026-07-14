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
  { rx: /bg-white dark:bg-surface/g, repl: 'bg-surface' },
  { rx: /bg-white dark:bg-\[\#111\]/g, repl: 'bg-surface' },
  { rx: /bg-\[\#f9fafb\] dark:bg-background/g, repl: 'bg-background' },
  { rx: /border-gray-200 dark:border-gray-800/g, repl: 'border-outline-variant' },
  { rx: /border-gray-100 dark:border-outline-variant\/30/g, repl: 'border-outline-variant' },
  { rx: /text-gray-600 dark:text-gray-400/g, repl: 'text-on-surface-variant' },
  { rx: /text-gray-700 dark:text-gray-300/g, repl: 'text-on-surface' },
  { rx: /bg-\[\#e8eaf0\] dark:bg-surface-container-low/g, repl: 'bg-surface-container-low' },
  { rx: /text-black dark:text-white/g, repl: 'text-on-surface' },
  { rx: /bg-slate-50 dark:bg-slate-800\/50/g, repl: 'bg-surface-container-low' },
  { rx: /bg-white dark:bg-surface-container/g, repl: 'bg-surface-container' },
  { rx: /border-gray-200 dark:border-slate-700/g, repl: 'border-outline-variant' },
  { rx: /text-gray-500 dark:text-gray-400/g, repl: 'text-on-surface-variant' },
  { rx: /text-gray-900 dark:text-gray-100/g, repl: 'text-on-surface' },
  { rx: /bg-gray-50 dark:bg-surface-container-low/g, repl: 'bg-surface-container-low' },
  { rx: /bg-gray-100 dark:bg-surface-container/g, repl: 'bg-surface-container' },
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
