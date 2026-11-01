export type ProductCategory =
  | 'Technology & Gadgets'
  | 'Digital Products'
  | 'Online Courses'
  | 'Business & Finance'
  | 'Software & AI Tools'
  | 'Beauty & Lifestyle'
  | 'Health & Wellness'
  | 'Personal Development';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  price: number;
  previousPrice?: number;
  discountPercentage?: number;
  rating?: number;
  reviewsCount?: number;
  buttonText: string;
  affiliateUrl: string;
  imageUrl: string;
  additionalImages?: string[];
  features?: string[];
  benefits?: string[];
  isFeatured: boolean;
  isTrending: boolean;
  status: 'published' | 'draft';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  createdBy?: string;
  tags?: string[];
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  description: string;
  iconName: string;
  image: string;
  featuredCount?: number;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  subscribedAt: string;
  consent: boolean;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'superadmin' | 'editor';
}
