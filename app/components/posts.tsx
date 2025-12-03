'use client';

import Link from 'next/link';
import { formatDate } from 'app/utils/date';

interface Post {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
  };
}

interface BlogPostsProps {
  posts: Post[];
}

export function BlogPosts({ posts }: BlogPostsProps) {
  return (
    <div>
      {posts
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            data-blog-item
            className="flex flex-col space-y-1 mb-4 group"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col sm:flex-row sm:space-x-2 gap-1 sm:gap-0">
              <p className="text-neutral-500 dark:text-neutral-500 w-full sm:w-[100px] sm:flex-shrink-0 text-xs sm:text-sm tabular-nums group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-800 dark:text-neutral-200 tracking-tight group-hover:text-black dark:group-hover:text-white font-medium transition-colors duration-300 text-sm sm:text-base">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
