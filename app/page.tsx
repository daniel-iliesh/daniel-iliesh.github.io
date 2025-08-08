import { BlogPosts } from "app/components/posts";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ReadmeContent from "./components/readmeContent";
import Link from "next/link";
import { SpeakNameButton } from "app/components/speakNameButton";
import { GravatarProfile } from "./api/gravatar/types";

export default async function Page() {
  let data = await fetch("https://thebackend.rocket-champ.com/gravatar");
  const gravatarProfile: GravatarProfile = await data.json();
  console.log(gravatarProfile.verified_accounts);

  data = await fetch("https://thebackend.rocket-champ.com/readme");
  const ghReadme = await data.text();

  return (
    <section>
      <div className="flex items-center w-full gap-4 mb-8">
        <div className="flex items-center gap-4 w-full">
          <Link target="_blank" href={gravatarProfile.profile_url}>
            <img
              src={gravatarProfile.avatar_url}
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
                  {gravatarProfile.display_name}
                  <SpeakNameButton name={gravatarProfile.pronunciation} />
                </h1>
                <h2>{gravatarProfile.job_title}</h2>
              </div>
              <div className="flex gap-4 items-center">
                <a
                  href={
                    gravatarProfile.verified_accounts.find(
                      (a) => a.service_type == "github"
                    )?.url
                  }
                  target="_blank"
                >
                  <FaGithub
                    color="white"
                    size={24}
                    className="hover:text-gray-300 align-top"
                  />
                </a>
                <a
                  href={
                    gravatarProfile.verified_accounts.find(
                      (a) => a.service_type == "linkedin"
                    )?.url
                  }
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
              {gravatarProfile.location} | {gravatarProfile.company}
            </p>
            <p className="text-sm text-gray-300 flex gap-1">
              <a href={`mailto:${gravatarProfile.contact_info.email}`}>
                {gravatarProfile.contact_info.email}
              </a>
              <a href={`tel:${gravatarProfile.contact_info.cell_phone}`}>
                {gravatarProfile.contact_info.cell_phone}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-xl text-green-400 font-bold">About me</div>
        <ReadmeContent htmlContent={ghReadme} />
      </div>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
