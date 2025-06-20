import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.string(),
      excerpt: z.string().optional(),
      tags: z.array(z.string()).optional(),
      categories: z.array(z.string()).optional(),
      coverImage: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return undefined;
          // If it's just a filename (no path separators), prepend the assets path
          if (!val.includes("/") && !val.includes("\\")) {
            return `../../assets/${val}`;
          }
          return val;
        })
        .pipe(image().optional()),
    }),
});

export const collections = {
  blog,
};
