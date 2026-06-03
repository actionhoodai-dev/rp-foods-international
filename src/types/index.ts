export interface CompanySettings {
  name: string;
  phoneNumbers: string[];
  email: string;
  address: string;
  googleMapsUrl: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  hero: {
    title: string;
    subtitle: string;
    bgImage?: string;
  };
  about: {
    title: string;
    story: string;
    mission: string;
    vision: string;
    image?: string;
  };
  footer: {
    copyright: string;
    text: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  enabled: boolean;
  productCount?: number;
  seo: {
    title: string;
    description: string;
    keywords?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  fullDescription: string;
  specifications: { label: string; value: string }[];
  packagingDetails: string[];
  benefits: string[];
  applications: string[];
  images: string[];
  status: 'draft' | 'published';
  seo: {
    title: string;
    description: string;
    keywords?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  message: string;
  type: 'general' | 'product';
  productSlug?: string;
  productName?: string;
  status: 'new' | 'read';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  timestamp: string;
}
