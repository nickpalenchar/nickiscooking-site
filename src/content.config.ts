import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
})

const recipes = defineCollection({
  loader: glob({ base: './src/content/recipes', pattern: '**/*.{md,mdx,tsx}' }),

  schema: z.object({
    title: z.string(),
    nicksRating: z.number().min(1).max(5).optional(),
    prepTimeMins: z.number().optional(),
    cookTimeMins: z.number().optional(),
    difficulty: z.number().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: z.date(),
    // main body of the recipe
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
    tips: z.array(z.string()).optional(),
    // additional sections below the recipe.
    // as an array of objects with the key as the section title and value as body
    addendum: z.array(z.record(z.string(), z.string())).optional(),
  }),
})

export const collections = { blog, recipes }
