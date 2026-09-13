import profileData from '../profile.json';

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
}

export const siteConfig: SiteConfig = {
  author: profileData.author || "Harish",
  handle: profileData.handle || "@harish",
  role: profileData.role || "Security Researcher & Systems Developer",
  twitterHandle: profileData.twitterHandle || "@harish_sec",
  title: profileData.title || "Harish // Terminal Blog",
  description: profileData.description || "Security research, vulnerability analysis, and low-level systems development.",
  siteUrl: profileData.siteUrl || "https://harish.github.io",
  uid: profileData.uid || "0x03E8",
  tty: profileData.tty || "TTY:0",
  pgpKey: profileData.pgpKey || "0x4E89F19C2D4A88B1EE4089C91427AF10C9347890",
  githubUrl: profileData.githubUrl || "https://github.com/harish",
  twitterUrl: profileData.twitterUrl || "https://x.com/harish_sec",
  email: profileData.email || "harish@research.local",
  postsPerPage: profileData.postsPerPage || 10,
};
