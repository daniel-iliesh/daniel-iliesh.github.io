'use client';

import { useResumeStore } from '../../src/stores/resumeStore';
import { BlogPosts } from './posts';
import { AnimatedHero } from './AnimatedHero';
import { AnimatedAbout } from './AnimatedAbout';

interface HomeClientProps {
  posts: Array<{
    metadata: {
      title: string;
      publishedAt: string;
      summary: string;
      image?: string;
    };
    slug: string;
    content: string;
  }>;
}

export function HomeClient({ posts }: HomeClientProps) {
  const resume = useResumeStore((state) => state.resume);
  const isLoading = useResumeStore((state) => state.isLoading);

  if (isLoading && !resume) {
    return (
      <section>
        <p className="text-sm text-gray-500">Loading...</p>
      </section>
    );
  }

  if (!resume?.basics) {
    return (
      <section>
        <p className="text-sm text-gray-300">
          Resume data is unavailable right now. Please try again later.
        </p>
      </section>
    );
  }

  const basics = resume.basics;
  const profiles = basics.profiles ?? [];
  const githubProfile = profiles.find((profile) => profile.network === 'GitHub');
  const linkedinProfile = profiles.find((profile) => profile.network === 'LinkedIn');

  return (
    <section>
      <AnimatedHero
        name={basics.name ?? ''}
        label={basics.label ?? ''}
        image={basics.image ?? ''}
        url={basics.url}
        location={basics.location?.city}
        email={basics.email}
        phone={basics.phone}
        githubUrl={githubProfile?.url}
        linkedinUrl={linkedinProfile?.url}
      />
      <AnimatedAbout summary={basics.summary ?? ''} />
      <div className="my-6 sm:my-8">
        <BlogPosts posts={posts} />
      </div>
    </section>
  );
}

