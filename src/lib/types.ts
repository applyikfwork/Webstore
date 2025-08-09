import type { Timestamp } from "firebase/firestore";

export interface App {
  id?: string;
  name: string;
  type: 'apk' | 'website';
  apkUrl?: string;
  websiteUrl?: string;
  iconUrl: string;
  description: string;
  featureHighlights: string;
  createdAt: Timestamp;
}
