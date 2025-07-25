// src/services/cartService.ts

import API from "../utils/axios"
import {
  CreateCartDto,
  UpdateCartItemDto,
  CartWithDto,
  CartItemDto
} from "../types/cartType" // Adjust path if needed

const getToken = () => localStorage.getItem("accessToken")

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

export const addToCart = async (data: CreateCartDto): Promise<any> => {
  const response = await API.post("/carts/add-to-cart", data, authHeader())
  return response.data
}

export const getMyCart = async (): Promise<CartWithDto> => {
  const response = await API.get("/carts/view-my-cart", authHeader())
  return response.data
}

export const getCartItemById = async (
  cartItemId: string
): Promise<CartItemDto> => {
  const response = await API.get(
    `/Carts/view-a-cart-item/${cartItemId}`,
    authHeader()
  )
  return response.data
}

export const updateCartItem = async (
  cartItemId: string,
  data: UpdateCartItemDto
): Promise<any> => {
  const response = await API.put(
    `/carts/update-a-item/${cartItemId}`,
    data,
    authHeader()
  )
  return response.data
}

export const removeCartItem = async (cartItemId: string): Promise<any> => {
  const response = await API.delete(
    `/carts/remove-a-item/${cartItemId}`,
    authHeader()
  )
  return response.data
}

export const clearCart = async (): Promise<any> => {
  const response = await API.delete("/carts/remove-all-items", authHeader())
  return response.data
}
