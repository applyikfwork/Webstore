import type { Timestamp } from "firebase/firestore";

export interface App {
  id?: string;
  name: string;
  websiteUrl?: string;
  apkUrl?: string;
  iconUrl: string;
  description: string;
  featureHighlights: string;
  createdAt: Timestamp;
}
