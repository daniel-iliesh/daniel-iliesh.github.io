import { BlogPosts } from 'app/components/posts'
import { AnimatedSection } from 'app/components/AnimatedSection'
import { getBlogPosts } from 'app/blog/utils'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  const posts = getBlogPosts()
  return (
    <section>
      <AnimatedSection>
        <h1 className="font-semibold text-xl sm:text-2xl mb-6 sm:mb-8 tracking-tighter">My Blog</h1>
      </AnimatedSection>
      <BlogPosts posts={posts} />
    </section>
  )
}
