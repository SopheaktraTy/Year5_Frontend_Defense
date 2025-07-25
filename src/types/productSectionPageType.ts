// src/types/productSectionPageType.ts

export interface ProductDto {
  id: string
  product_name: string
  description: string
  original_price: number
  discounted_price: number
  total_quantity: number
  discount_percentage_tag: number
  image?: string
  created_at: string
  updated_at: string
}

export interface CreateProductSectionPageDto {
  title: string
  bannerImage?: string
  productIds: string[]
}

export interface UpdateProductSectionPageDto {
  title?: string
  bannerImage?: string
  productIds?: string[]
}

export interface ProductSectionPageDto {
  id: string
  title: string
  banner_image?: string
  products: ProductDto[] // ✅ now reuses the type above
  created_at: string
  updated_at: string
}
