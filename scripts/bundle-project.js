import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const outputFile = path.join(rootDir, 'workforce_project_bundle.txt');

const includeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.sql', '.html', '.css', '.md'];
const excludeDirs = ['node_modules', '.git', 'dist', '.agents', '.gemini', 'scripts'];
const excludeFiles = ['package-lock.json', 'workforce_project_bundle.txt', '.env'];

function shouldProcess(filePath) {
  const relPath = path.relative(rootDir, filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath);
  
  // Check if directory should be excluded
  const parts = relPath.split(path.sep);
  for (const part of parts) {
    if (excludeDirs.includes(part)) return false;
  }
  
  if (excludeFiles.includes(base)) return false;
  if (!includeExtensions.includes(ext) && !base.startsWith('.')) return false;
  
  return true;
}

function traverse(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath, files);
    } else {
      if (shouldProcess(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function bundle() {
  console.log('Bundling project files...');
  const files = traverse(rootDir);
  let output = '';
  
  for (const file of files) {
    const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
    console.log(`Adding ${relPath}...`);
    const content = fs.readFileSync(file, 'utf8');
    output += `================================================================================\n`;
    output += `FILE: ${relPath}\n`;
    output += `================================================================================\n`;
    output += content;
    output += `\n\n`;
  }
  
  fs.writeFileSync(outputFile, output, 'utf8');
  console.log(`Successfully bundled ${files.length} files to ${outputFile}`);
}

bundle();
