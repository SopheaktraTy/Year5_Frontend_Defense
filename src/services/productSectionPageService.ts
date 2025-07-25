// src/services/productSectionPageService.ts

import API from "../utils/axios"
import {
  CreateProductSectionPageDto,
  UpdateProductSectionPageDto,
  ProductSectionPageDto
} from "../types/productSectionPageType"

const getToken = () => localStorage.getItem("accessToken")

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

/**
 * Create a new product section page
 */
export const createProductSectionPage = async (
  data: CreateProductSectionPageDto
): Promise<ProductSectionPageDto> => {
  const response = await API.post(
    "/product-section-pages/add-section-pages",
    data,
    authHeader()
  )
  return response.data
}

/**
 * Get all product section pages
 */
export const getAllProductSectionPages = async (): Promise<
  ProductSectionPageDto[]
> => {
  const response = await API.get(
    "/product-section-pages/view-section-pages",
    authHeader()
  )
  return response.data
}

/**
 * Get a single product section page by ID
 */
export const getProductSectionPageById = async (
  sectionPageId: string
): Promise<ProductSectionPageDto> => {
  const response = await API.get(
    `/product-section-pages/view-a-section-page/${sectionPageId}`,
    authHeader()
  )
  return response.data
}

/**
 * Update a product section page
 */
export const updateProductSectionPage = async (
  sectionPageId: string,
  data: UpdateProductSectionPageDto
): Promise<ProductSectionPageDto> => {
  const response = await API.put(
    `/product-section-pages/${sectionPageId}`,
    data,
    authHeader()
  )
  return response.data
}

/**
 * Delete a product section page
 */
export const deleteProductSectionPage = async (
  sectionPageId: string
): Promise<void> => {
  await API.delete(`/product-section-pages/${sectionPageId}`, authHeader())
}

/**
 * Add a product to a section page
 */
export const addProductToSectionPage = async (
  sectionPageId: string,
  productId: string
): Promise<ProductSectionPageDto> => {
  const response = await API.put(
    `/product-section-pages/add-product-to-section-page/${sectionPageId}/${productId}`,
    {},
    authHeader()
  )
  return response.data
}

/**
 * Remove a product from a section page
 */
export const removeProductFromSectionPage = async (
  sectionPageId: string,
  productId: string
): Promise<ProductSectionPageDto> => {
  const response = await API.put(
    `/product-section-pages/remove-product-from-section-page/${sectionPageId}/${productId}`,
    {},
    authHeader()
  )
  return response.data
}
