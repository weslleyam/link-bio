
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Product {
  id: string;
  bioPageId: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  imageUrl: string;
  isActive: boolean;
  position: number;
}

export interface BioPage {
  id: string;
  userId: string;
  title: string;
  description: string;
  profileImageUrl: string;
  themeColor: string;
  fontFamily: string;
  isActive: boolean;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundColor: string;
  backgroundGradient: string;
  backgroundImageUrl?: string;
  // Configurações do Catálogo
  catalogEnabled: boolean;
  catalogWhatsApp?: string;
  catalogTitle?: string;
  catalogCtaText?: string;
}

export interface BioLink {
  id: string;
  bioPageId: string;
  title: string;
  url: string;
  icon?: string;
  position: number;
  clicks: number;
  isActive: boolean;
}

export interface AnalyticsRecord {
  id: string;
  linkId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
