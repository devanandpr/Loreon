export interface Product {
  id: string;
  slug: string;

  name: string;
  brand: string;
  category: string;

  price: number;
  originalPrice?: number;

  rating: number;
  reviews: number;

  image: string;
  description: string;

  badge?: string;

  stock: number;

  features: string[];

  colors?: string[];

  sizes?: string[];

  isFeatured: boolean;
}