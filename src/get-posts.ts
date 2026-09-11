import fs from 'fs';
import path from 'path';

export type Post = {
  id: string;
  date: string;
  title: string;
};

const POSTS_ROOT = path.join(process.cwd(), 'src', 'app', '(posts)');

function extract(source: string, regex: RegExp, what: string, file: string): string {
  const match = source.match(regex);
  if (!match) {
    throw new Error(`Could not extract ${what} from ${file}`);
  }
  return match[2];
}

// Posts are derived from the filesystem: src/app/(posts)/{year}/{slug}/page.mdx.
// Each page.mdx must export `metadata` (with a title) and a `date` string.
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

        return {
          id: slug,
          date,
          title,
        };
      });
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
