import Link from 'next/link'
import { formatDate } from 'app/blog/utils'
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";

export async function Projects() {
  // TODO: fix hardcoded backend url
  const data = await fetch('https://thebackend.rocket-champ.com/projects')
  const ghProjects = await data.json()

  return (
    <div>
      {ghProjects
       .sort((a, b) => {
         if (
           new Date(a.created_at) > new Date(b.created_at)
         ) {
           return -1
         }
         return 1
       })
       .map((project) => (
         <Link
           key={project.name}
           className="flex flex-col space-y-1 mb-4"
           href={`/projects/${project.name}`}
         >
           <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
             <p className="text-neutral-600 dark:text-neutral-400 w-[150px] tabular-nums">
               {formatDate(project.created_at, false)}
             </p>
             {/* <img src={project.favimage} className="rounded-full contain" width={24} height={24} alt="favimage" /> */}
             <p className="flex flex-col w-full">
               <div className="flex justify-between w-full align-center">
                 <span className="font-bold text-xl">
                   {project.name}
                 </span>
                 <Link href={project.html_url}>
                   <FaGithub size={24} />
                 </Link>
               </div>
               <span className="text-neutral-900 dark:text-neutral-100 tracking-tight" >
                 {project.description}
               </span>
             </p>
           </div>
         </Link>
       ))}
    </div>
  )
}
