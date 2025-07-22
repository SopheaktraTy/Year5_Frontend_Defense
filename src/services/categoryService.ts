// src/services/categoriesService.ts

import API from "../utils/axios"
import { CreateCategoryDto, UpdateCategoryDto } from "../types/categoryType"

const getToken = () => localStorage.getItem("accessToken")

export const createCategory = async (data: CreateCategoryDto) => {
  const response = await API.post("/categories/add-a-category", data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
  return response.data
}

export const getAllCategories = async () => {
  const response = await API.get("/categories/view-all-categories", {})
  return response.data
}

export const getCategoryById = async (categoryId: string) => {
  const response = await API.get(
    `/categories/view-a-category/${categoryId}`,
    {}
  )
  return response.data
}

export const updateCategory = async (
  categoryId: string,
  data: UpdateCategoryDto
) => {
  const response = await API.put(
    `/categories/update-a-category/${categoryId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  )
  return response.data
}

export const deleteCategory = async (categoryId: string) => {
  const response = await API.delete(
    `/categories/remove-a-category/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  )
  return response.data
}
