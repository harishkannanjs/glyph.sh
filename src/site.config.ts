import profileData from '../profile.json';

export interface GiscusConfig {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export interface SiteConfig {
  name: string;
  author: string;
  githubUsername: string;
  handle: string;
  avatar?: string;
  logo?: string;
  role: string;
  twitterHandle: string;
  title: string;
  description: string;
  siteUrl: string;
  githubUrl: string;
  twitterUrl: string;
  email: string;
  postsPerPage: number;
  giscus: GiscusConfig;
}

function extractGithubUsername(githubUrl?: string, handle?: string): string {
  if (githubUrl) {
    const match = githubUrl.match(/github\.com\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return match[1];
  }
  if (handle) {
    return handle.replace(/^@/, '');
  }
  return '';
}

const githubUsername = extractGithubUsername(profileData.githubUrl, profileData.handle);

export const siteConfig: SiteConfig = {
  name: "glyph.sh",
  author: profileData.author || "Author",
  githubUsername: githubUsername || "user",
  handle: profileData.handle || (githubUsername ? `@${githubUsername}` : "@user"),
  avatar: (profileData as any).avatar || (profileData as any).logo || '',
  logo: (profileData as any).logo || (profileData as any).avatar || '',
  role: profileData.role || "",
  twitterHandle: profileData.twitterHandle || "",
  title: profileData.title || "glyph.sh",
  description: profileData.description || "",
  siteUrl: profileData.siteUrl || "https://example.com",
  githubUrl: profileData.githubUrl || "",
  twitterUrl: profileData.twitterUrl || "",
  email: profileData.email || "",
  postsPerPage: profileData.postsPerPage || 10,
  giscus: (profileData as any).giscus || {
    enabled: false,
    repo: "",
    repoId: "",
    category: "General",
    categoryId: "",
  },
};
