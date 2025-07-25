// src/services/heroBannerService.ts

import API from "../utils/axios"
import {
  CreateHeroBannerDto,
  UpdateHeroBannerDto,
  HeroBannerDto
} from "../types/heroBannerType"

const getToken = () => localStorage.getItem("accessToken")

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

export const createHeroBanner = async (
  data: CreateHeroBannerDto
): Promise<HeroBannerDto> => {
  const response = await API.post(
    "/hero-banners/add-a-hero-banner",
    data,
    authHeader()
  )
  return response.data
}

export const getAllHeroBanners = async (): Promise<HeroBannerDto[]> => {
  const response = await API.get(
    "/hero-banners/view-all-hero-banner",
    authHeader()
  )
  return response.data
}

export const getHeroBannerById = async (
  heroBannerId: string
): Promise<HeroBannerDto> => {
  const response = await API.get(
    `/hero-banners/view-a-hero-banner/${heroBannerId}`,
    authHeader()
  )
  return response.data
}

export const updateHeroBanner = async (
  heroBannerId: string,
  data: UpdateHeroBannerDto
): Promise<HeroBannerDto> => {
  const response = await API.put(
    `/hero-banners/update-a-hero-banner/${heroBannerId}`,
    data,
    authHeader()
  )
  return response.data
}

export const deleteHeroBanner = async (heroBannerId: string): Promise<void> => {
  await API.delete(
    `/hero-banners/delete-a-hero-banner/${heroBannerId}`,
    authHeader()
  )
}
