import os from 'os';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises';
import { promisify } from 'util';
import { execFile } from 'child_process';

const execFileAsync = promisify(execFile);
const MERMAID_FENCE_REGEX = /```mermaid\s*([\s\S]*?)```/g;
const GENERATION_CACHE = new Map();
const DEFAULT_THEME = process.env.MERMAID_THEME || 'neutral';
const DEFAULT_BACKGROUND = process.env.MERMAID_BACKGROUND || 'transparent';

function sanitizeSegments(segments = []) {
  return segments
    .map((segment) => segment.replace(/\.md$/i, ''))
    .map((segment) => segment.replace(/[^a-z0-9]+/gi, '-'))
    .map((segment) => segment.replace(/-+/g, '-'))
    .map((segment) => segment.replace(/^-|-$/g, ''))
    .filter(Boolean)
    .join('-');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getMermaidBinaryPath() {
  const suffix = process.platform === 'win32' ? '.cmd' : '';
  const binPath = path.join(process.cwd(), 'node_modules', '.bin', `mmdc${suffix}`);
  return binPath;
}

async function generateMermaidSvg({ code, outputPath, theme = DEFAULT_THEME, background = DEFAULT_BACKGROUND }) {
  const mermaidBin = getMermaidBinaryPath();
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'mermaid-'));
  const inputPath = path.join(tmpRoot, 'diagram.mmd');
  const puppeteerConfigPath = path.join(tmpRoot, 'puppeteer-config.json');

  try {
    const puppeteerConfig = {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
    await fs.writeFile(inputPath, code, 'utf8');
    await fs.writeFile(puppeteerConfigPath, JSON.stringify(puppeteerConfig), 'utf8');
    const args = ['-i', inputPath, '-o', outputPath, '-e', 'svg', '-b', background, '--quiet'];
    if (theme) {
      args.push('-t', theme);
    }
    args.push('-p', puppeteerConfigPath);
    await execFileAsync(mermaidBin, args, { env: process.env });
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  }
}

async function ensureDiagramAsset({ code, prefix, lang }) {
  const hash = crypto.createHash('sha1').update(code).digest('hex').slice(0, 16);
  const sanitizedLang = lang ? sanitizeSegments([lang]) : '';
  const segments = ['mermaid'];
  if (prefix) {
    segments.push(prefix);
  }
  segments.push(hash);
  const fileName = `${segments.join('-')}.svg`;
  const folderSegments = sanitizedLang ? [sanitizedLang, 'mermaid'] : ['mermaid'];
  const outputDir = path.join(process.cwd(), 'public', ...folderSegments);
  const outputPath = path.join(outputDir, fileName);

  await fs.mkdir(outputDir, { recursive: true });

  if (await fileExists(outputPath)) {
    return { publicPath: path.posix.join('/', ...folderSegments, fileName), fileName };
  }

  const cacheKey = `${sanitizedLang || 'root'}:${fileName}`;
  if (!GENERATION_CACHE.has(cacheKey)) {
    const generationPromise = generateMermaidSvg({ code, outputPath })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        GENERATION_CACHE.delete(cacheKey);
      });
    GENERATION_CACHE.set(cacheKey, generationPromise);
  }

  await GENERATION_CACHE.get(cacheKey);

  return { publicPath: path.posix.join('/', ...folderSegments, fileName), fileName };
}

export async function renderMermaidBlocks(markdown, { lang, slugSegments } = {}) {
  if (typeof markdown !== 'string' || !markdown.includes('```mermaid')) {
    return markdown;
  }

  const prefix = sanitizeSegments(slugSegments);
  const matches = [...markdown.matchAll(MERMAID_FENCE_REGEX)];

  if (!matches.length) {
    return markdown;
  }

  let result = '';
  let lastIndex = 0;

  for (const match of matches) {
    const matchIndex = match.index ?? 0;
    const fullMatch = match[0];
    const codeBlock = match[1]?.trim();

    result += markdown.slice(lastIndex, matchIndex);

    if (!codeBlock) {
      result += fullMatch;
      lastIndex = matchIndex + fullMatch.length;
      continue;
    }

    try {
      const { publicPath } = await ensureDiagramAsset({ code: codeBlock, prefix, lang });
      result += `![Mermaid diagram](${publicPath})`;
    } catch (error) {
      console.warn('Failed to render mermaid diagram:', error);
      result += fullMatch;
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  result += markdown.slice(lastIndex);

  return result;
}
