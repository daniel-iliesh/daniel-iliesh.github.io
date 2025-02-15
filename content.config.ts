import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: "page",
      source: "projects/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        technologies: z.array(z.string()),
        links: z.object({
          demo: z.string().url().optional(),
          repo: z.string().url().optional(),
          blog: z.string().optional(),
        }),
        image: z.string().optional(),
      }),
    }),
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        tags: z.array(z.string()),
        image: z.string().optional(),
      }),
    }),
  },
});
