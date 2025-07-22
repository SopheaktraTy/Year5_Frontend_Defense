// src/services/cartService.ts

import API from "../utils/axios"
import {
  CreateCartDto,
  UpdateCartItemDto,
  CartWithDto
} from "../types/cartType" // Adjust path if needed

const getToken = () => localStorage.getItem("accessToken")

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

export const addToCart = async (data: CreateCartDto): Promise<any> => {
  const response = await API.post("/Carts/add-to-cart", data, authHeader())
  return response.data
}

export const getMyCart = async (): Promise<CartWithDto> => {
  const response = await API.get("/Carts/view-my-cart", authHeader())
  return response.data
}

export const updateCartItem = async (
  cartItemId: string,
  data: UpdateCartItemDto
): Promise<any> => {
  const response = await API.put(
    `/Carts/update-a-item/${cartItemId}`,
    data,
    authHeader()
  )
  return response.data
}

export const removeCartItem = async (cartItemId: string): Promise<any> => {
  const response = await API.delete(
    `/Carts/remove-a-item/${cartItemId}`,
    authHeader()
  )
  return response.data
}

export const clearCart = async (): Promise<any> => {
  const response = await API.delete("/Carts/remove-all-items", authHeader())
  return response.data
}
