import { BlogPosts } from "app/components/posts";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";
import ReadmeContent from "./components/readmeContent";

export default async function Page() {
  let data = await fetch('https://thebackend.rocket-champ.com/')
  const ghProfile = await data.json()

  data = await fetch('https://thebackend.rocket-champ.com/readme')
  const ghReadme = await data.text()

  return (
    <section>
      <div className="flex items-center w-full gap-4 mb-8">
        <div className="flex items-center gap-4 w-full">
          <img src={ghProfile.avatar_url} alt="avatar" width={100} height={100} className="rounded-full border-2 border-gray-200" />
          <div className="w-full gap-8">
            <div className="flex justify-between w-full">
              <h1 className="text-2xl font-semibold tracking-tighter">{ghProfile.name} - {ghProfile.bio}</h1>
              <div className="flex gap-4 items-center">
                <a href={ghProfile.html_url} target="_blank">
                  <FaGithub color="white" size={24} className="hover:text-gray-300 align-top" />
                </a>
                <a href={`mailto:${ghProfile.email}`}>
                  <FaEnvelope color="white" size={24} className="hover:text-gray-300 align-top" />
                </a>
                <a href={`https://linkedin.com/in/${ghProfile.login}`} target="_blank">
                  <FaLinkedin color="white" size={24} className="hover:text-gray-300 align-top" />
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {ghProfile.location} | {ghProfile.company}
            </p>
            <p className="text-sm text-gray-500">
              {ghProfile.email}
            </p>
          </div>
        </div>
      </div>
      <p className="mb-4">
        <ReadmeContent htmlContent={ghReadme} />
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
