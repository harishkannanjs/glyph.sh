import profileData from '../profile.json';

export interface GiscusConfig {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export interface SiteConfig {
  author: string;
  handle: string;
  role: string;
  twitterHandle: string;
  title: string;
  description: string;
  siteUrl: string;
  uid: string;
  tty: string;
  pgpKey: string;
  githubUrl: string;
  twitterUrl: string;
  email: string;
  postsPerPage: number;
  giscus: GiscusConfig;
}

export const siteConfig: SiteConfig = {
  author: profileData.author || "Harish",
  handle: profileData.handle || "@harishkannanjs",
  role: profileData.role || "Security Researcher & Systems Developer",
  twitterHandle: profileData.twitterHandle || "@harishkannanjs",
  title: profileData.title || "Harish // Terminal Blog",
  description: profileData.description || "Security research, vulnerability analysis, and low-level systems development.",
  siteUrl: profileData.siteUrl || "https://harish.github.io",
  uid: profileData.uid || "0x03E8",
  tty: profileData.tty || "TTY:0",
  pgpKey: profileData.pgpKey || "0x4E89F19C2D4A88B1EE4089C91427AF10C9347890",
  githubUrl: profileData.githubUrl || "https://github.com/harishkannanjs",
  twitterUrl: profileData.twitterUrl || "https://x.com/harishkannanjs",
  email: profileData.email || "harish@research.local",
  postsPerPage: profileData.postsPerPage || 10,
  giscus: (profileData as any).giscus || {
    enabled: true,
    repo: "harishkannanjs/blog",
    repoId: "",
    category: "General",
    categoryId: "",
  },
};
