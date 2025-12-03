import { BlogPosts } from "app/components/posts";
import { fetchResume } from "src/features/resume/api";
import { AnimatedHero } from "app/components/AnimatedHero";
import { AnimatedAbout } from "app/components/AnimatedAbout";
import { getBlogPosts } from "app/blog/utils";

export default async function Page() {
  const resume = await fetchResume();
  const basics = resume.basics;
  const posts = getBlogPosts();

  if (!basics) {
    return (
      <section>
        <p className="text-sm text-gray-300">
          Resume data is unavailable right now. Please try again later.
        </p>
      </section>
    );
  }

  const profiles = basics.profiles ?? [];
  const githubProfile = profiles.find((profile) => profile.network === "GitHub");
  const linkedinProfile = profiles.find((profile) => profile.network === "LinkedIn");

  return (
    <section>
      <AnimatedHero
        name={basics.name ?? ""}
        label={basics.label ?? ""}
        image={basics.image ?? ""}
        url={basics.url}
        location={basics.location?.city}
        email={basics.email}
        phone={basics.phone}
        githubUrl={githubProfile?.url}
        linkedinUrl={linkedinProfile?.url}
      />
      <AnimatedAbout summary={basics.summary ?? ""} />
      <div className="my-6 sm:my-8">
        <BlogPosts posts={posts} />
      </div>
    </section>
  );
}
