"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { HeroBannerDto } from "../types/heroBannerType"
import { getAllHeroBanners } from "../services/heroBannerService"

// ✅ Autoplay plugin for keen-slider
function AutoplayPlugin(interval = 4000) {
  return (slider: any) => {
    let timeout: NodeJS.Timeout
    let mouseOver = false

    function clearNextTimeout() {
      clearTimeout(timeout)
    }

    function nextTimeout() {
      clearTimeout(timeout)
      if (mouseOver) return
      timeout = setTimeout(() => {
        slider.next()
      }, interval)
    }

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true
        clearNextTimeout()
      })
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false
        nextTimeout()
      })
      nextTimeout()
    })

    slider.on("dragStarted", clearNextTimeout)
    slider.on("animationEnded", nextTimeout)
    slider.on("updated", nextTimeout)
  }
}

export default function CustomerHeroBannerComponent() {
  const [banners, setBanners] = useState<HeroBannerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "snap",
      slides: { perView: 1 },
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [AutoplayPlugin(4000)]
  )

  useEffect(() => {
    let isMounted = true
    const fetchBanners = async () => {
      try {
        const data = await getAllHeroBanners()
        if (isMounted) setBanners(data)
      } catch (error) {
        console.error("Error loading banners:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchBanners()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="text-center py-10 animate-pulse">Loading banners...</div>
    )
  }

  if (banners.length === 0) {
    return <div className="text-center py-10">No hero banners found.</div>
  }

  return (
    <div className="relative w-full">
      {/* ✅ Slider */}
      <div ref={sliderRef} className="keen-slider">
        {banners.map(banner => (
          <div key={banner.id} className="keen-slider__slide relative w-full">
            {/* ✅ Make each slide clickable */}
            <Link href={`/product/${banner.product?.id || ""}`}>
              <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden cursor-pointer">
                <img
                  src={banner.image || "/placeholder-banner.jpg"}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r to-transparent" />
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ✅ Dots */}
      {loaded && slider.current && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({
            length: slider.current.track.details.slides.length
          }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => slider.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
