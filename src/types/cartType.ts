// src/types/cartType.ts

export interface CreateCartItemDto {
  productId: string
  quantity: number
  size: string
}

export interface CreateCartDto {
  items: CreateCartItemDto[]
}

export interface UpdateCartItemDto {
  cartItemId?: string
  quantity?: number
  size?: string
}

export interface UpdateCartDto {
  items: UpdateCartItemDto[]
}

export interface ProductDto {
  id: string
  product_name: string
  original_price: number
  discounted_price: number
  total_quantity: number
  discount_percentage_tag: number
  image: string
}

export interface CartWithProductDto {
  id: string
  product: ProductDto
  quantity: number
  size: string
  price_at_cart: number
}

export interface CartWithDto {
  id: string
  cart_items: CartWithProductDto[]
}

export interface CartItemDto {
  id: string
  quantity: number
  size: string
  price_at_cart: number
  product_variable: {
    id: string
    size: string
    product: {
      id: string
      product_name: string
      image: string // base64 image string
    }
  }
}
