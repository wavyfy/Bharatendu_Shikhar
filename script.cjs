const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      filelist = walkSync(p, filelist);
    } else {
      if (p.endsWith('.tsx')) filelist.push(p);
    }
  });
  return filelist;
};

// Also apply color replacements to Sidebar, Topbar, DashboardShell
const dirs = [
  'apps/admin/src/app/(dashboard)',
  'apps/admin/src/components/layout'
];

let files = [];
dirs.forEach(d => {
  files = files.concat(walkSync(d));
});

const colorMap = {
  '#0058c3': 'primary',
  '#181b23': 'on-surface',
  '#414754': 'on-surface-variant',
  '#faf9ff': 'surface',
  '#e0e2ed': 'surface-variant',
  '#c1c6d7': 'outline-variant',
  '#727786': 'outline',
  '#f2f3fe': 'surface-container-low',
  '#ecedf8': 'surface-container',
  '#d8e2ff': 'primary-fixed',
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace colors
  for (const [hex, name] of Object.entries(colorMap)) {
    // Regex for: bg-[#181b23], text-[#181b23], border-[#181b23], ring-[#181b23]
    const regex = new RegExp('\\[(?i)' + hex + '\\]', 'g');
    content = content.replace(regex, name);
  }

  // Add AnimatedPage wrap (only to page.tsx files)
  if (file.endsWith('page.tsx')) {
    if (!content.includes('AnimatedPage')) {
      // Find the last import statement
      const importMatches = [...content.matchAll(/import .*;/g)];
      if (importMatches.length > 0) {
        const lastImportIndex = importMatches[importMatches.length - 1].index + importMatches[importMatches.length - 1][0].length;
        content = content.slice(0, lastImportIndex) + '\nimport { AnimatedPage } from "@/components/ui/AnimatedPage";' + content.slice(lastImportIndex);
      }
    }

    // Replace the opening div with AnimatedPage
    const initialContent = content;
    content = content.replace(/<div className="space-y-6">/, '<AnimatedPage className="space-y-6">');
    
    // Replace the closing div matching the root space-y-6 div
    if (content !== initialContent && content.includes('<AnimatedPage')) {
      const parts = content.split('</AnimatedPage>');
      if (parts.length === 1) { // Not replaced closing tag yet
        const lines = content.split('\n');
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].includes('</div>')) {
            lines[i] = lines[i].replace('</div>', '</AnimatedPage>');
            break;
          }
        }
        content = lines.join('\n');
      }
    }
  }

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});
