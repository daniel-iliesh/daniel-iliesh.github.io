'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SpeakNameButton } from './speakNameButton';

interface AnimatedHeroProps {
  name: string;
  label: string;
  image: string;
  url?: string;
  location?: string;
  email?: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export function AnimatedHero({
  name,
  label,
  image,
  url,
  location,
  email,
  phone,
  githubUrl,
  linkedinUrl,
}: AnimatedHeroProps) {
  return (
    <div className="flex items-start sm:items-center w-full gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="flex items-start gap-3 sm:gap-4 w-full">
        <Link
          target="_blank"
          href={url ?? '#'}
          className="block flex-shrink-0"
        >
          <img
            src={image}
            alt="Gravatar Profile"
            className="rounded-full border-2 border-gray-100 dark:border-neutral-800 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover aspect-square"
          />
        </Link>
        <div className="w-full min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
            <div className="flex flex-col min-w-0 flex-1">
              <h1
                className="text-xl sm:text-2xl font-semibold tracking-tighter flex gap-1 items-center flex-wrap"
              >
                <span className="break-words">{name}</span>
                <SpeakNameButton name={name} />
              </h1>
              <h2 className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">{label}</h2>
            </div>
            <div className="flex gap-3 sm:gap-4 items-center flex-shrink-0">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300 p-2 -m-2 touch-manipulation"
                  aria-label="GitHub"
                >
                  <FaGithub size={20} className="sm:w-6 sm:h-6" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  className="text-neutral-400 hover:text-[#0077b5] transition-colors duration-300 p-2 -m-2 touch-manipulation"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={20} className="sm:w-6 sm:h-6" />
                </a>
              )}
            </div>
          </div>
          <div className="mt-2 sm:mt-0">
            {location && (
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{location}</p>
            )}
            <div className="flex flex-col sm:flex-row sm:gap-3 gap-1 mt-1">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200 break-all"
                >
                  {email}
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200"
                >
                  {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
