
export interface Piece {
  id: string;
  code: string; // Product Name
  era: 'Indica' | 'Sativa' | 'Hybrid' | 'High CBD'; // Strain Type
  status: 'IN STOCK' | 'OUT OF STOCK' | 'LIMITED' | 'NEW'; 
  imageUrl: string;
  additionalImages?: string[];
  description?: string;
  material?: string; // THC %
  condition?: string; // CBD %
  classification?: 'Flower' | 'Pre-Rolls' | 'Edibles' | 'Concentrates' | 'Vapes'; // Category
  price?: number;
}

export interface CartItem extends Piece {
  quantity: number;
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
  heroMediaUrl?: string;
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
