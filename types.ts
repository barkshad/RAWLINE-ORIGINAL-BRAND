
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

export interface SiteContent {
  heroTitle: string;
  heroSubTitle: string;
  archiveStatementTitle: string;
  archiveStatementText1: string;
  archiveStatementText2: string;
  footerTagline: string;
}

export interface AnalysisResult {
  era: string;
  styleNotes: string;
  reworkSuggestion: string;
  rawlineScore: number;
}
