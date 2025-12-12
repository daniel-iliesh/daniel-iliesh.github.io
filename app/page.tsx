import { fetchResume } from "src/features/resume/api";
import { ResumeProvider } from "app/components/ResumeProvider";
import { HomeClient } from "app/components/HomeClient";
import { getBlogPosts } from "app/blog/utils";

export default async function Page() {
  // Fetch once on server, then cache in Zustand
  const resume = await fetchResume().catch(() => null);
  const posts = getBlogPosts();

  return (
    <ResumeProvider initialResume={resume || undefined}>
      <HomeClient posts={posts} />
    </ResumeProvider>
  );
}
