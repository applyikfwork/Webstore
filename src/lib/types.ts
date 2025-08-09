import type { Timestamp } from "firebase/firestore";

export interface App {
  id?: string;
  name: string;
  type: 'apk' | 'website';
  apkUrl?: string;
  apkPath?: string;
  websiteUrl?: string;
  iconUrl: string;
  iconPath: string;
  description: string;
  featureHighlights: string;
  createdAt: Timestamp;
}
