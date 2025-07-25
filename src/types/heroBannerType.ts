// src/types/HeroBanneType.ts
export interface HeroBannerDto {
  id: string
  title: string
  image?: string
  product?: {
    id: string
    product_name: string
    description?: string
    original_price: number
    discounted_price: number
    total_quantity: number
    discount_percentage_tag: number
    created_at: string
    updated_at: string
    image?: string
  }
  created_at: string
  updated_at: string
}

export interface CreateHeroBannerDto {
  title: string
  image?: string
  productId?: string
}

export interface UpdateHeroBannerDto {
  title?: string
  image?: string
  productId?: string
}
