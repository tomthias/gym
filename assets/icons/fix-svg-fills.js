const fs = require('fs').promises;
const path = require('path');

const rootDir = path.resolve(__dirname); // script placed in assets/icons

async function walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(entries.map(async (entry) => {
		const res = path.resolve(dir, entry.name);
		return entry.isDirectory() ? walk(res) : res;
	}));
	return Array.prototype.concat(...files);
}

function transformSvg(content) {
	// 1) replace any fill="..." (double or single quotes) with currentColor
	content = content.replace(/fill\s*=\s*(['"])[^'"]*\1/gi, 'fill="currentColor"');

	// 2) replace style="...fill:...;..." occurrences to set fill:currentColor
	content = content.replace(/style\s*=\s*(['"])(.*?)\1/gi, (m, quote, inner) => {
		const updated = inner.replace(/fill\s*:\s*[^;]+/gi, 'fill:currentColor');
		return `style=${quote}${updated}${quote}`;
	});

	// 3) ensure <svg ...> has fill="currentColor" if not present
	// match opening svg tag (non-greedy)
	content = content.replace(/<svg\b([^>]*)>/i, (m, attrs) => {
		if (/fill\s*=/i.test(attrs)) return `<svg${attrs}>`;
		// preserve possible trailing whitespace
		// insert fill before closing of the opening tag
		return `<svg${attrs} fill="currentColor">`;
	});

	return content;
}

async function main() {
	const allFiles = await walk(rootDir);
	const svgFiles = allFiles.filter(f => f.toLowerCase().endsWith('.svg'));
	if (svgFiles.length === 0) {
		console.log('No SVG files found in', rootDir);
		return;
	}
	for (const file of svgFiles) {
		try {
			const data = await fs.readFile(file, 'utf8');
			const updated = transformSvg(data);
			if (updated !== data) {
				await fs.writeFile(file, updated, 'utf8');
				console.log('Updated:', file);
			} else {
				console.log('No changes needed:', file);
			}
		} catch (err) {
			console.error('Error processing', file, err);
		}
	}
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
