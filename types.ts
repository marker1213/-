
export enum AnomalyLevel {
  STABLE = 'STABLE',
  FLUCTUATING = 'FLUCTUATING',
  CRITICAL = 'CRITICAL',
  COLLAPSE = 'COLLAPSE'
}

export type FactionType = 'UNION' | 'RSCP' | 'OBSERVER';
export type ContainmentClass = 'SAFE' | 'EUCLID' | 'KETER' | 'THAUMIEL' | 'APOLLYON' | 'N/A';
export type HazardLevel = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface WorldEntity {
  id: string;
  name: string;
  type: 'CHARACTER' | 'LOCATION' | 'ARTIFACT' | 'PHENOMENON';
  faction: FactionType;
  containmentClass: ContainmentClass;
  hazardLevel: HazardLevel;
  status: string;
  resonance: number; // 0-100
  coordinates: { x: number; y: number }; // 0-100 scale (x: horizontal, y: vertical)
  description: string; // Public/Surface level info
  secretData?: string; // Decrypted/Hidden info
  isVerified?: boolean;
}

export interface TimelineEvent {
  id: string;
  era: string;
  year: string;
  title: string;
  description: string;
  affectedEntities: string[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  code?: string;
}

export interface GeminiAnalysisResult {
  analysis: string;
  threatLevel: number;
  recommendation: string;
}
