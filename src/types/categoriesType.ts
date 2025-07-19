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
  total_quantity?: number;
}