export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_ship: number;
  price_local: number;
  category: string | null;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};