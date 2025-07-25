"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { HeroBannerDto } from "../../types/heroBannerType"
import { getAllHeroBanners } from "../../services/heroBannerService"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Slider = dynamic(() => import("react-slick"), { ssr: false })

export default function CustomerHeroBannerComponent() {
  const [banners, setBanners] = useState<HeroBannerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [sliderKey, setSliderKey] = useState(0)

  const pathname = usePathname() // ✅ detect route changes

  useEffect(() => {
    fetchBanners()
  }, [])

  // 🔄 Remount slider when the route changes
  useEffect(() => {
    setSliderKey(prev => prev + 1)
  }, [pathname])

  const fetchBanners = async () => {
    try {
      const data = await getAllHeroBanners()
      setBanners(data)
    } catch (error) {
      console.error("Error loading banners:", error)
    } finally {
      setLoading(false)
    }
  }

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  }

  if (loading)
    return <div className="text-center py-10">Loading banners...</div>
  if (banners.length === 0)
    return <div className="text-center py-10">No hero banners found.</div>

  return (
    <div className="relative w-full">
      <Slider key={sliderKey} {...settings}>
        {banners.map(banner => (
          <div key={banner.id} className="relative w-full">
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden">
              <img
                src={banner.image || "/placeholder-banner.jpg"}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
