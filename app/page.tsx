import { BlogPosts } from "app/components/posts";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { SpeakNameButton } from "app/components/speakNameButton";
import { fetchResume } from "src/features/resume/api";

export default async function Page() {
  const resume = await fetchResume();
  const basics = resume.basics;

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
      <div className="flex items-center w-full gap-4 mb-8">
        <div className="flex items-center gap-4 w-full">
          <Link
            target="_blank"
            href={basics.url ?? "#"}
          >
            <img
              src={basics.image ?? ""}
              alt="Gravatar Profile"
              width={100}
              height={100}
              className="rounded-full border-2 border-gray-200"
            />
          </Link>
          <div className="w-full gap-8">
            <div className="flex justify-between w-full">
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold tracking-tighter flex gap-1 items-center">
                  {basics.name}
                  <SpeakNameButton
                    name={basics.name ?? ""}
                  />
                </h1>
                <h2>{basics.label}</h2>
              </div>
              <div className="flex gap-4 items-center">
                <a
                  href={githubProfile?.url}
                  target="_blank"
                >
                  <FaGithub
                    color="white"
                    size={24}
                    className="hover:text-gray-300 align-top"
                  />
                </a>
                <a
                  href={linkedinProfile?.url}
                  target="_blank"
                >
                  <FaLinkedin
                    color="white"
                    size={24}
                    className="hover:text-gray-300 align-top"
                  />
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              {basics.location?.city}
            </p>
            <p className="text-sm text-gray-300 flex gap-1">
              <a href={basics.email ? `mailto:${basics.email}` : undefined}>
                {basics.email}
              </a>
              <a href={basics.phone ? `tel:${basics.phone}` : undefined}>
                {basics.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-xl text-green-400 font-bold">About me</div>
        {/* <ReadmeContent htmlContent={jsonResume.basics?.summary} /> */}
        {basics.summary}
      </div>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
