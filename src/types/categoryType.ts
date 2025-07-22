// src/types/categorieType.ts

export interface CreateCategoryDto {
  categoryName: string;
  description: string;
  image?: string;  // Optional field
}

export interface UpdateCategoryDto {
  categoryName?: string;  // Optional for updates
  description?: string;
  image?: string;
}

export interface CategoryDto {
  id: string;
  category_name: string;
  image?: string;
}

// Types
export interface ProductInCategory {
  id: string;
  product_name: string;
  description: string;
  original_price: number;
  discounted_price: number;
  total_quantity: number;
  discount_percentage_tag: number;
  created_at: string;
  updated_at: string;
  image: string;
}

export interface CategoryWithProductsDto {
  id: string;
  category_name: string;
  description: string;
  products: ProductInCategory[];
}