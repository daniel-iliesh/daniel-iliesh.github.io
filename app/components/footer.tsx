'use client';

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  const ghProfile = {
    html_url: 'https://github.com/daniel-iliesh',
    blog: 'daniel-iliesh.github.io',
  };

  return (
    <footer className="mb-16">
      <ul className="font-sm mt-6 sm:mt-8 flex flex-col space-x-0 space-y-3 sm:space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100 hover:translate-x-1 duration-200 group touch-manipulation py-1"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <span className="transition-transform duration-300 group-hover:-rotate-45 flex-shrink-0">
            <ArrowIcon />
            </span>
            <p className="ml-2 text-sm sm:text-base">rss</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100 hover:translate-x-1 duration-200 group touch-manipulation py-1"
            rel="noopener noreferrer"
            target="_blank"
            href={ghProfile.html_url}
          >
            <span className="transition-transform duration-300 group-hover:-rotate-45 flex-shrink-0">
            <ArrowIcon />
            </span>
            <p className="ml-2 text-sm sm:text-base">github</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100 hover:translate-x-1 duration-200 group touch-manipulation py-1"
            rel="noopener noreferrer"
            target="_blank"
            href={`${ghProfile.html_url}/${ghProfile.blog}`}
          >
            <span className="transition-transform duration-300 group-hover:-rotate-45 flex-shrink-0">
            <ArrowIcon />
            </span>
            <p className="ml-2 text-sm sm:text-base">view source</p>
          </a>
        </li>
      </ul>
      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-neutral-600 dark:text-neutral-300">
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()} Daniel Ilies. All rights reserved.
      </p>
        <div className="text-xs sm:text-sm space-y-1 text-neutral-500 dark:text-neutral-400 leading-relaxed">
          <p className="font-semibold text-neutral-700 dark:text-neutral-300">Legal Information:</p>
          <p>ILIEŞ VEACESLAV DANIEL PERSOANĂ FIZICĂ AUTORIZATĂ</p>
          <p>Registered in Romania (EU)</p>
          <p>VAT/CUI: 53031652</p>
          <p>Reg. Com: F2025049231008</p>
          <p>EUID: ROONRC.F2025049231008</p>
          <p>Address: Str. Vasile Conta Nr. 1, Iași, Romania</p>
        </div>
      </div>
    </footer>
  )
}
