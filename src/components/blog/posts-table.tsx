import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import type { Post } from '@/get-posts';

export function PostsTable({ posts }: { posts: Post[] }) {
  return (
    <Table className="font-mono text-sm">
      <TableHeader>
        <TableRow className="border-foreground hover:bg-transparent">
          <TableHead className="w-[56px] text-xs">date</TableHead>
          <TableHead className="text-xs">title</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => {
          const year = new Date(post.date).getFullYear();

          return (
            <TableRow
              key={post.id}
              className="rounded border-foreground overflow-hidden hover:bg-foreground"
            >
              <TableCell className="text-gray-500 text-xs">{year}</TableCell>
              <TableCell className="p-0">
                <Link className="px-2 py-3 w-full block" href={`/${year}/${post.id}`}>
                  {post.title}
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
