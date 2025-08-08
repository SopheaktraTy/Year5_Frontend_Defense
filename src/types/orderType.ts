// src/types/orderType.ts
export interface CreateOrderItemDto {
  cart_item_id: string // UUID string
}

export interface CreateOrderDto {
  order_items: CreateOrderItemDto[]
}

export interface OrderItem {
  product: {
    id: string
    product_name: string
    image: string
  }
  quantity: number
  price_at_order: string
}

export interface Order {
  id: string
  user: {
    email: string
    firstname: string
    lastname: string
    gender: string
    phone_number: string
    image: string
  }
  order_no: number
  total_amount: string
  create_at: string
  status: "not_yet_approved" | "approved"
  order_items: OrderItem[]
}
