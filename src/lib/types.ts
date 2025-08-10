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
}

export interface SiteSettingsData {
    iconUrl?: string;
    tagline?: string;
    loginEnabled?: boolean;
}

export interface AdSettingsData {
    homePageAdKey?: string;
    appDetailPageAdKey?: string;
}
