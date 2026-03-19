import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', '..');
const DIST = join(ROOT, 'dist');

describe('production build', () => {
	beforeAll(() => {
		execSync('npx vite build', { cwd: ROOT, stdio: 'pipe' });
	}, 30_000);

	it('produces dist/index.html', () => {
		expect(existsSync(join(DIST, 'index.html'))).toBe(true);
	});

	it('produces JS bundle in dist/assets', () => {
		const assets = readdirSync(join(DIST, 'assets'));
		const jsFiles = assets.filter((f) => f.endsWith('.js'));
		expect(jsFiles.length).toBeGreaterThanOrEqual(1);
	});

	it('produces CSS bundle in dist/assets', () => {
		const assets = readdirSync(join(DIST, 'assets'));
		const cssFiles = assets.filter((f) => f.endsWith('.css'));
		expect(cssFiles.length).toBeGreaterThanOrEqual(1);
	});

	it('index.html references relative asset paths', () => {
		const html = readFileSync(join(DIST, 'index.html'), 'utf-8');
		// Should use ./ relative paths, not absolute /
		expect(html).toContain('./assets/');
		expect(html).not.toMatch(/(?:src|href)="\/assets\//);
	});

	it('JS bundle is valid (no syntax errors on parse)', () => {
		const assets = readdirSync(join(DIST, 'assets'));
		const jsFile = assets.find((f) => f.endsWith('.js'));
		expect(jsFile).toBeDefined();
		const js = readFileSync(join(DIST, 'assets', jsFile!), 'utf-8');
		// If this throws, the JS has syntax errors
		expect(() => new Function(js)).not.toThrow();
	});

	it('CSS bundle is non-empty', () => {
		const assets = readdirSync(join(DIST, 'assets'));
		const cssFile = assets.find((f) => f.endsWith('.css'));
		expect(cssFile).toBeDefined();
		const css = readFileSync(join(DIST, 'assets', cssFile!), 'utf-8');
		expect(css.length).toBeGreaterThan(100);
	});

	it('JS bundle contains expected application code markers', () => {
		const assets = readdirSync(join(DIST, 'assets'));
		const jsFile = assets.find((f) => f.endsWith('.js'));
		const js = readFileSync(join(DIST, 'assets', jsFile!), 'utf-8');
		// The store defines essence skills — these string literals should appear in the bundle
		expect(js).toContain('athletics');
		expect(js).toContain('conditioning');
		expect(js).toContain('Unicorn');
		expect(js).toContain('Earth Pony');
		expect(js).toContain('Pegasus');
	});

	it('CSS contains expected style rules', () => {
		const assets = readdirSync(join(DIST, 'assets'));
		const cssFile = assets.find((f) => f.endsWith('.css'));
		const css = readFileSync(join(DIST, 'assets', cssFile!), 'utf-8');
		expect(css).toContain('border-radius');
		expect(css).toContain('font-family');
	});
});
