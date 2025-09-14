import { BlogPosts } from "app/components/posts";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { SpeakNameButton } from "app/components/speakNameButton";
import jsonResume from "../public/resume.json";

export default async function Page() {

  return (
    <section>
      <div className="flex items-center w-full gap-4 mb-8">
        <div className="flex items-center gap-4 w-full">
          <Link
            target="_blank"
            href={jsonResume.basics.url}
          >
            <img
              src={jsonResume.basics.image}
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
                  {jsonResume.basics.name}
                  <SpeakNameButton
                    name={jsonResume.basics.name}
                  />
                </h1>
                <h2>{jsonResume.basics.label}</h2>
              </div>
              <div className="flex gap-4 items-center">
                <a
                  href={
                    jsonResume.basics.profiles.find(
                      (a) => a.network == "GitHub"
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
                    jsonResume.basics.profiles.find(
                      (a) => a.network == "LinkedIn"
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
              {jsonResume.basics.location.city}
            </p>
            <p className="text-sm text-gray-300 flex gap-1">
              <a href={`mailto:${jsonResume.basics.email}`}>
                {jsonResume.basics.email}
              </a>
              <a href={`tel:${jsonResume.basics.phone}`}>
                {jsonResume.basics.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-xl text-green-400 font-bold">About me</div>
        {/* <ReadmeContent htmlContent={jsonResume.basics?.summary} /> */}
        {jsonResume.basics.summary}
      </div>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
