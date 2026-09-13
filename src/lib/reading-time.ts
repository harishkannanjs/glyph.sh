/**
 * Computes estimated reading time based on actual word count.
 * Average reading speed: 200 words per minute.
 */
export function getReadingTime(content: string): { minutes: number; text: string; words: number } {
  // Strip frontmatter if present
  const cleanContent = content.replace(/^---[\s\S]*?---/, '');
  
  // Strip code blocks from word count or count them reasonably
  const words = cleanContent
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[#*`~_\[\]()]/g, '') // remove markdown punctuation
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return {
    minutes,
    text: `${minutes} min read`,
    words,
  };
}
