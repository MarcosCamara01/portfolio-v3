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
    title: match[1],
    id: match[2],
  }));
}

// Posts are derived from the filesystem: src/app/(posts)/{year}/{slug}/page.mdx.
// Each page.mdx must export `metadata` (with a title) and a `date` string.
// `metadata.description` and `export const tag` are optional.
export const getPosts = async (): Promise<Post[]> => {
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

        if (String(new Date(date).getFullYear()) !== year) {
          throw new Error(`Date "${date}" in ${file} does not match its "${year}" directory`);
        }

        const body = source.replace(/^export[\s\S]*?;\s*$/gm, '');
        const words = body.split(/\s+/).filter(Boolean).length;

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

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
