import { defineCollection, z } from 'astro:content';
import { createBlogLoader } from '@/lib/blog-loader';

export const changelogItemSchema = z.object({
  date: z.coerce.date(),
  summary: z.string().min(1, "Changelog summary must not be empty"),
  diff: z.string().optional(),
});

export const blogSchema = z.object({
  title: z.string({ required_error: "Post title is required" }).min(1, "Post title must not be empty"),
  description: z.string({ required_error: "Post description is required" }).min(1, "Post description must not be empty"),
  pubDate: z.coerce.date({ required_error: "Publication date (pubDate) is required" }),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  draft: z.boolean().default(false),
  heroImage: z.string().optional(),
  series: z.string().optional(),
  seriesPart: z.number().int().positive().optional(),
  seriesTotal: z.number().int().positive().optional(),
  words: z.number().optional(),
  changelog: z.array(changelogItemSchema).optional(),
}).refine((data) => {
  const hasSeries = Boolean(data.series);
  const hasSeriesPart = data.seriesPart !== undefined;
  const hasSeriesTotal = data.seriesTotal !== undefined;

  if (hasSeries) {
    return hasSeriesPart && hasSeriesTotal;
  } else {
    return !hasSeriesPart && !hasSeriesTotal;
  }
}, {
  message: "If 'series' is specified, both 'seriesPart' and 'seriesTotal' must also be specified. If 'series' is omitted, neither 'seriesPart' nor 'seriesTotal' may be specified.",
  path: ["series"],
});

export const blog = defineCollection({
  loader: createBlogLoader(),
  schema: blogSchema,
});

export const collections = { blog };
