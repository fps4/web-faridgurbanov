// scripts/render-mermaid.mjs
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';
import { glob } from 'glob';

const DIAGRAMS_DIR = path.resolve(process.cwd(), 'diagrams');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const CHECKSUM_FILE = path.join(DIAGRAMS_DIR, 'render-checksum.json');

function checksum(content) {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function loadChecksums() {
    try {
        if (fs.existsSync(CHECKSUM_FILE)) {
            return fs.readJsonSync(CHECKSUM_FILE);
        }
    } catch (err) {
        console.warn('Warning: failed to read checksum file, starting fresh', err.message);
    }
    return {};
}

function saveChecksums(checksums) {
    fs.ensureDirSync(path.dirname(CHECKSUM_FILE));
    fs.writeJsonSync(CHECKSUM_FILE, checksums, { spaces: 2 });
}

function relativePosix(p, base) {
    // produce posix-style relative path regardless of platform
    return path.relative(base, p).split(path.sep).join('/');
}

async function findMmdFiles() {
    // Return list of absolute file paths
    const pattern = path.join(DIAGRAMS_DIR, '**', '*.mmd');
    return await glob(pattern, { nodir: true });
}

function destForFile(absPath) {
    // absPath: /.../diagrams/<lang>/.../sub/diagram.mmd
    const rel = path.relative(DIAGRAMS_DIR, absPath); // e.g. nl/sub/diagram.mmd
    const parts = rel.split(path.sep);
    const lang = parts.shift();
    const rest = parts.join(path.sep); // e.g. sub/diagram.mmd or diagram.mmd

    // desired: ./public/<lang>/diagrams/<preserve the folder structure>.svg
    const destRel = path.join(lang, 'diagrams', rest).replace(/\.mmd$/i, '.svg');
    return path.join(PUBLIC_DIR, destRel);
}

async function renderAll() {
    const checksums = loadChecksums();
    const files = await findMmdFiles();

    if (!files || files.length === 0) {
        console.log('No .mmd files found under', DIAGRAMS_DIR);
        return;
    }

    console.log(`Found ${files.length} .mmd file(s) to consider`);

    let rendered = 0;
    let skipped = 0;

    for (const f of files) {
        const content = fs.readFileSync(f, 'utf8');
        const sum = checksum(content);
        const rel = relativePosix(f, DIAGRAMS_DIR); // key in checksum file

        if (checksums[rel] && checksums[rel] === sum) {
            skipped++;
            console.log(`Skipping unchanged: ${rel}`);
            continue;
        }

        const dest = destForFile(f);
        fs.ensureDirSync(path.dirname(dest));

        try {
            console.log(`Rendering ${rel} -> ${path.relative(process.cwd(), dest)}`);
            // Use npx mmdc; ensure input and output paths quoted to handle spaces
            execSync(`npx mmdc -i "${f}" -o "${dest}"`, { stdio: 'inherit' });
            checksums[rel] = sum;
            rendered++;
        } catch (err) {
            console.error(`Failed to render ${rel}:`, err.message);
        }
    }

    saveChecksums(checksums);

    console.log(`Done. Rendered: ${rendered}, Skipped: ${skipped}`);
}

// Run
renderAll().catch(err => {
    console.error('Error while rendering diagrams:', err);
    process.exitCode = 1;
});