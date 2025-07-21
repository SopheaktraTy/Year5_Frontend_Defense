// src/types/productType.ts
export interface CreateProductVariableDto {
  size: string;
  quantity: number;
}

export interface CreateProductDto {
  categoryId?: string;
  productName: string;
  image?: string;
  description?: string;
  originalPrice: number;
  discountPercentageTag?: number;
  productVariables: CreateProductVariableDto[];
}

export interface UpdateProductDto {
  categoryId: string;
  productName: string;
  image: string;
  description?: string;
  originalPrice: number;
  discountPercentageTag: number;
  productVariables: EditableProductVariableDto[];
}

export interface EditableProductVariableDto {
  id?: string;
  size: string;
  quantity: number;
}

export interface ProductVariableInProductDto {
  id: string;
  size: string;
  quantity: number;
}

export interface CategoryInProductDto {
  id: string;
  category_name: string;
  description: string;
  image: string;
}

export interface ProductDto {
  id: string;
  category: CategoryInProductDto;
  product_name: string;
  description: string;
  original_price: number;
  discounted_price: number;
  total_quantity: number;
  discount_percentage_tag: number;
  product_variables: ProductVariableInProductDto[];
  image: string;
}

