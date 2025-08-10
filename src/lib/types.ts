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
  // New fields based on the design
  version?: string;
  downloads?: number;
  tags?: string[];
  screenshots?: string[];
}

export interface SiteSettingsData {
    iconUrl?: string;
    tagline?: string;
}

export interface AdSettingsData {
    homePageAdCode?: string;
    appDetailPageAdCode?: string;
}
