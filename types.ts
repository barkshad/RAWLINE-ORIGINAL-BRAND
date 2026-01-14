
export interface Piece {
  id: string;
  code: string;
  era: string;
  status: 'ARCHIVED' | 'ACTIVE' | 'WORN' | 'RELEASED' | 'STUDY';
  imageUrl: string;
  additionalImages?: string[];
  description?: string;
  material?: string;
  condition?: string;
  classification?: string;
}

export interface FitCheck {
  id: string;
  videoUrl: string;
  title: string;
  description?: string;
  createdAt?: any;
}

export interface SiteContent {
  heroTitle: string;
  heroSubTitle: string;
  heroMediaUrl?: string; // URL for video or image background
  archiveStatementTitle: string;
  archiveStatementText1: string;
  archiveStatementText2: string;
  footerTagline: string;
  fitChecks?: FitCheck[];
}

export interface AnalysisResult {
  era: string;
  styleNotes: string;
  reworkSuggestion: string;
  rawlineScore: number;
}
