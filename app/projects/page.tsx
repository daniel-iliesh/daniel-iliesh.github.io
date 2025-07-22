import { Projects } from "app/components/projects";

export default async function Page() {
    const data = await fetch('https://thebackend.rocket-champ.com/projects')
    const ghProjects = await data.json()

    console.log(ghProjects);

    return (
        <section>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Projects</h1>
            <Projects />
        </section>
    );
}
