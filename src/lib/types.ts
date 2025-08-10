
import type { Timestamp } from "firebase/firestore";

export interface App {
  id?: string;
  name: string;
  websiteUrl?: string;
  apkUrl?: string;
  iconUrl: string;
  description: string;
  featureHighlights: string;
  createdAt: Timestamp | string;
  version?: string;
  downloads?: number;
  tags?: string[];
  screenshots?: string[];
  featured?: boolean;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface SiteSettingsData {
    iconUrl?: string;
    tagline?: string;
    loginEnabled?: boolean;
    twitterUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
}

export interface AdSettingsData {
    homePageAdKey?: string;
    appDetailPageAdKey?: string;
}
