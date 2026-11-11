import fs from 'fs';
import path from 'path';

export type Heading = {
  id: string;
  title: string;
};

export type Post = {
  id: string;
  date: string;
  year: string;
  title: string;
  description: string | null;
  tag: string | null;
  minutes: number;
  headings: Heading[];
};

const POSTS_ROOT = path.join(process.cwd(), 'src', 'app', '(posts)');
const WORDS_PER_MINUTE = 230;
const DATE =
  /^(January|February|March|April|May|June|July|August|September|October|November|December) (0?[1-9]|[12]\d|3[01]), (\d{4})$/;

function extract(source: string, regex: RegExp, what: string, file: string): string {
  const match = source.match(regex);
  if (!match) {
    throw new Error(`Could not extract ${what} from ${file}`);
  }
  return match[2];
}

function optional(source: string, regex: RegExp): string | null {
  return source.match(regex)?.[2] ?? null;
}

// `## 1. Title [#id]` lines, outside fenced code blocks.
function extractHeadings(source: string): Heading[] {
  const withoutCode = source.replace(/```[\s\S]*?```/g, '');
  return [...withoutCode.matchAll(/^##\s+(.+?)\s*\[#([^\]]+)\]\s*$/gm)].map((match) => ({
    // The TOC shows plain text: drop inline code ticks, link targets and emphasis.
    title: match[1]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/\*\*?([^*]+)\*\*?/g, '$1'),
    id: match[2],
  }));
}

// Each page.mdx is read as text with the regexes below, not imported, so its exports
// must match them exactly. AGENTS.md "Writing articles" lists the rules.
export async function getPosts(): Promise<Post[]> {
  const years = fs.readdirSync(POSTS_ROOT).filter((entry) => /^\d{4}$/.test(entry));

  const posts = years.flatMap((year) => {
    const yearDir = path.join(POSTS_ROOT, year);

    return fs
      .readdirSync(yearDir)
      .filter((slug) => fs.existsSync(path.join(yearDir, slug, 'page.mdx')))
      .map((slug): Post => {
        const file = path.join(yearDir, slug, 'page.mdx');
        const source = fs.readFileSync(file, 'utf8');

        const title = extract(source, /title:\s*(['"])([\s\S]+?)\1\s*,/, 'metadata.title', file);
        const date = extract(
          source,
          /export\s+const\s+date\s*=\s*(['"])(.+?)\1/,
          'date export',
          file
        );

        if (!DATE.test(date)) {
          throw new Error(`Date "${date}" in ${file} must look like "September 10, 2026"`);
        }
        if (String(new Date(date).getFullYear()) !== year) {
          throw new Error(`Date "${date}" in ${file} does not match its "${year}" directory`);
        }

        // Count prose only: code blocks, imports, JSX tags and link targets aren't read.
        const prose = source
          .replace(/^export[\s\S]*?;\s*$/gm, '')
          .replace(/```[\s\S]*?```/g, ' ')
          .replace(/^import .*$/gm, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\]\([^)]*\)/g, ']');
        const words = prose.split(/\s+/).filter(Boolean).length;

        return {
          id: slug,
          date,
          year,
          title,
          description: optional(source, /description:\s*(['"`])([\s\S]+?)\1\s*,/),
          tag: optional(source, /export\s+const\s+tag\s*=\s*(['"])(.+?)\1/),
          minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
          headings: extractHeadings(source),
        };
      });
  });

  // Slugs key rows and links site-wide, so a slug reused in another year would collide.
  const slugs = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.id)) {
      throw new Error(`Two posts use the slug "${post.id}"; slugs must be unique across years`);
    }
    slugs.add(post.id);
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
