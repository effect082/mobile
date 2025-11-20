
export enum BlockType {
  HEADER = 'HEADER',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  SCHEDULE = 'SCHEDULE',
  BUSINESS_INFO = 'BUSINESS_INFO',
  MAP = 'MAP',
  FORM = 'FORM',
  SOCIAL = 'SOCIAL',
  DIVIDER = 'DIVIDER',
}

export type TemplateType = 'NEWSLETTER' | 'PROMOTION' | 'INVITATION';

export interface BlockStyle {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: string;
  fontWeight?: string;
}

export interface BlockData {
  id: string;
  type: BlockType;
  content: any;
  styles: BlockStyle;
}

export interface Project {
  id: string;
  title: string;
  type: TemplateType;
  password?: string; // Simple password for deletion protection
  blocks: BlockData[];
  createdAt: number;
  themeColor: string;
}

// Specific Content Interfaces
export interface TextContent {
  text: string;
}

export interface ImageContent {
  url: string;
  alt: string;
  caption?: string;
}

export interface VideoContent {
  url: string; // YouTube or generic URL
}

export interface ScheduleContent {
  startDate: string;
  endDate: string;
  title: string;
  location: string;
}

export interface BusinessInfoItem {
  id: string;
  label: string;
  value: string;
}

export interface BusinessInfoContent {
  title: string;
  description?: string; // Added description field
  items: BusinessInfoItem[];
}

export interface MapContent {
  address: string;
  locationName: string;
}

export interface FormContent {
  buttonText: string;
  fields: { id: string; label: string; type: 'text' | 'email' | 'tel' }[];
}

export interface SocialLink {
  id: string;
  platform: 'youtube' | 'instagram' | 'blog' | 'kakao' | 'website';
  url: string;
}

export interface SocialContent {
  links: SocialLink[];
}
