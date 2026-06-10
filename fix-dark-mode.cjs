const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps/admin/src');

function walk(dir) {
  let results = [];
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

const files = walk(srcDir);

const replacements = [
  // Wrappers
  { rx: /className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm m-4 sm:m-6"/g, repl: 'className="w-full min-w-full"' },
  { rx: /className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm m-4 sm:m-6"/g, repl: 'className="w-full min-w-full"' },
  { rx: /className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 m-4 sm:m-6 shadow-sm"/g, repl: 'className="w-full min-w-full"' },
  
  // thead
  { rx: /className="bg-slate-200 dark:bg-slate-700\/80 border-b border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 uppercase text-xs font-semibold"/g, repl: 'className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider"' },
  { rx: /className="text-xs text-gray-500 dark:text-slate-300 uppercase bg-slate-200 dark:bg-slate-700\/80 border-b border-slate-300 dark:border-slate-600"/g, repl: 'className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider"' },
  
  // tbody
  { rx: /className="divide-y divide-slate-200 dark:divide-slate-700 bg-slate-50 dark:bg-slate-800\/50"/g, repl: 'className="divide-y divide-outline-variant bg-surface"' },
  
  // tr
  { rx: /className="hover:bg-slate-100 dark:hover:bg-slate-700\/50 transition-colors duration-150"/g, repl: 'className="hover:bg-surface-container-low transition-colors duration-150"' },
  { rx: /className="hover:bg-slate-100 dark:hover:bg-slate-700\/50 transition-colors"/g, repl: 'className="hover:bg-surface-container-low transition-colors"' },
  
  // tds
  { rx: /text-slate-900 dark:text-slate-100/g, repl: 'text-on-surface' },
  { rx: /text-slate-500 dark:text-slate-400/g, repl: 'text-outline' },
  { rx: /text-slate-600 dark:text-slate-300/g, repl: 'text-on-surface-variant' },
  { rx: /text-slate-400 dark:text-slate-500/g, repl: 'text-outline-variant' },

  // Filters
  { rx: /className="flex flex-col border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-lg"/g, repl: 'className="flex flex-col w-full"' },
  { rx: /className="p-4 bg-gray-50\/50 dark:bg-slate-700\/30"/g, repl: 'className="p-4"' },
  { rx: /className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50\/50 dark:bg-slate-700\/30"/g, repl: 'className="flex flex-col sm:flex-row gap-3 p-4"' },

  // General Components
  { rx: /bg-white dark:bg-slate-800/g, repl: 'bg-surface' },
  { rx: /bg-white dark:bg-slate-700/g, repl: 'bg-surface-container-lowest' },
  { rx: /bg-slate-50 lg:bg-white/g, repl: 'bg-surface lg:bg-surface-container-lowest' },
  { rx: /bg-slate-50 dark:bg-slate-800\/50/g, repl: 'bg-surface-container-low' },
  { rx: /bg-slate-50 dark:bg-slate-700\/50/g, repl: 'bg-surface-container-low' },
  { rx: /bg-slate-50/g, repl: 'bg-surface-container-low' },
  { rx: /bg-gray-50/g, repl: 'bg-surface-container-low' },
  { rx: /bg-white/g, repl: 'bg-surface' },
  
  // Specific lingering Tailwind classes
  { rx: /border-slate-200 dark:border-slate-700/g, repl: 'border-outline-variant' },
  { rx: /border-slate-300 dark:border-slate-600/g, repl: 'border-outline' },
  { rx: /border-gray-200 dark:border-slate-700/g, repl: 'border-outline-variant' }
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
