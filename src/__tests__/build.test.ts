import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', '..');
const OUTPUT = join(ROOT, '.svelte-kit', 'cloudflare');
const APP = join(OUTPUT, '_app', 'immutable');

describe('production build', () => {
    beforeAll(() => {
        execSync('npx vite build', { cwd: ROOT, stdio: 'pipe' });
    }, 60_000);

    it('produces _worker.js', () => {
        const worker = readFileSync(join(OUTPUT, '_worker.js'), 'utf-8');
        expect(worker.length).toBeGreaterThan(100);
    });

    it('produces JS chunks', () => {
        const chunks = readdirSync(join(APP, 'chunks'));
        const jsFiles = chunks.filter((f: string) => f.endsWith('.js'));
        expect(jsFiles.length).toBeGreaterThanOrEqual(1);
    });

    it('produces CSS assets', () => {
        const assets = readdirSync(join(APP, 'assets'));
        const cssFiles = assets.filter((f: string) => f.endsWith('.css'));
        expect(cssFiles.length).toBeGreaterThanOrEqual(1);
    });

    it('JS chunks are well-formed', () => {
        const chunks = readdirSync(join(APP, 'chunks'));
        const jsFiles = chunks.filter((f: string) => f.endsWith('.js'));
        for (const file of jsFiles) {
            const js = readFileSync(join(APP, 'chunks', file), 'utf-8');
            // Empty chunks are valid bundler artifacts (module boundary markers)
            if (js.length === 0) continue;
            // Should not contain obvious build errors
            expect(js).not.toContain('__VITE_ERROR__');
        }
    });

    it('CSS assets are non-empty', () => {
        const assets = readdirSync(join(APP, 'assets'));
        const cssFiles = assets.filter((f: string) => f.endsWith('.css'));
        for (const file of cssFiles) {
            const css = readFileSync(join(APP, 'assets', file), 'utf-8');
            expect(css.length).toBeGreaterThan(100);
        }
    });

    it('page JS contains expected application code markers', () => {
        const nodes = readdirSync(join(APP, 'nodes'));
        const chunks = readdirSync(join(APP, 'chunks'));
        const allJs = [...nodes, ...chunks]
            .filter((f: string) => f.endsWith('.js'))
            .map((f: string) => {
                const dir = nodes.includes(f) ? 'nodes' : 'chunks';
                return readFileSync(join(APP, dir, f), 'utf-8');
            })
            .join('\n');
        expect(allJs).toContain('athletics');
        expect(allJs).toContain('conditioning');
        expect(allJs).toContain('Unicorn');
        expect(allJs).toContain('Earth Pony');
        expect(allJs).toContain('Pegasus');
    });

    it('CSS contains expected style rules', () => {
        const assets = readdirSync(join(APP, 'assets'));
        const allCss = assets
            .filter((f: string) => f.endsWith('.css'))
            .map((f: string) => readFileSync(join(APP, 'assets', f), 'utf-8'))
            .join('\n');
        expect(allCss).toContain('border-radius');
        expect(allCss).toContain('font-family');
    });
});
