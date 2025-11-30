import { A } from '../posts/a';
import { P } from '../posts/p';
import { FiEdit3 } from 'react-icons/fi';
import { UL } from '../posts/ul';
import { Li } from '../posts/li';
import { getPosts } from '@/get-posts';

export const Writing = async () => {
  const posts = await getPosts();

  const getYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
            <FiEdit3 className="w-4 h-4 text-color-secondary" />
          </div>
          <h2 className="text-xl font-medium text-color-primary">Writing</h2>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="space-y-4">
        <P>
          I occasionally write about software development, performance optimization, and developer
          experience. Some of my recent articles:
        </P>
        <UL>
          {posts.map((post) => (
            <Li key={post.id}>
              <A href={`/${getYear(post.date)}/${post.id}`}>{post.title}</A>
            </Li>
          ))}
        </UL>
      </div>
    </section>
  );
};
