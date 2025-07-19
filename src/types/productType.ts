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




