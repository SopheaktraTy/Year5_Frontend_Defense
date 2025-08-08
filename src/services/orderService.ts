// src/services/orderService.ts

import API from "../utils/axios"
import { CreateOrderDto, Order } from "../types/orderType"

const getToken = () => localStorage.getItem("accessToken")

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
  const response = await API.post("/orders/add-to-order", data, authHeader())
  return response.data
}

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await API.get("/orders/view-my-orders", authHeader())
  return response.data
}

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await API.get("/orders/view-all-orders", authHeader())
  return response.data
}

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await API.get(
    `/orders/view-a-order/${orderId}`,
    authHeader()
  )
  return response.data
}

export const toggleOrderStatus = async (orderId: string): Promise<Order> => {
  const response = await API.put(
    `/orders/toggle-status/${orderId}`,
    {},
    authHeader()
  )
  return response.data
}
