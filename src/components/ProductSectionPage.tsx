import React, { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

import {
  ProductSectionPageDto,
  ProductDto
} from "../types/productSectionPageType"
import { ProductInCategory } from "../types/categoryType"
import { getAllProductSectionPages } from "../services/productSectionPageService"
import ProductCardComponent from "../components/ProductCard"

const ProductSectionPage: React.FC = () => {
  const [sectionPages, setSectionPages] = useState<ProductSectionPageDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [scrollStates, setScrollStates] = useState<
    Record<string, { canScrollLeft: boolean; canScrollRight: boolean }>
  >({})

  const [isDragging, setIsDragging] = useState(false)
  const [dragSection, setDragSection] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const mapToProductInCategory = (product: ProductDto): ProductInCategory => ({
    ...product,
    image: product.image || ""
  })

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getAllProductSectionPages()
        setSectionPages(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load product sections")
      } finally {
        setLoading(false)
      }
    }
    fetchSections()
  }, [])

  const updateScrollState = (sectionId: string) => {
    const container = scrollRefs.current[sectionId]
    if (!container) return
    setScrollStates(prev => ({
      ...prev,
      [sectionId]: {
        canScrollLeft: container.scrollLeft > 0,
        canScrollRight:
          container.scrollLeft + container.clientWidth < container.scrollWidth
      }
    }))
  }

  const scroll = (sectionId: string, direction: "left" | "right") => {
    const container = scrollRefs.current[sectionId]
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth"
      })
      setTimeout(() => updateScrollState(sectionId), 300)
    }
  }

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    sectionId: string
  ) => {
    setIsDragging(true)
    setDragSection(sectionId)
    const container = scrollRefs.current[sectionId]
    if (container) {
      setStartX(e.pageX - container.offsetLeft)
      setScrollLeft(container.scrollLeft)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragSection) return
    const container = scrollRefs.current[dragSection]
    if (!container) return

    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 1.5
    container.scrollLeft = scrollLeft - walk
    updateScrollState(dragSection)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragSection(null)
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error)
    return <div className="text-center text-red-600 py-10">{error}</div>

  return (
    <div className="space-y-8 py-6 w-full">
      {sectionPages.map(section => (
        <div key={section.id} className="rounded-lg border-gray-200 w-full">
          {/* ✅ Section Header */}
          <div className="flex justify-between items-center mb-3 bg-white p-4 rounded-lg w-full">
            <h2 className="text-xl font-semibold text-gray-800 uppercase">
              {section.title}
            </h2>
            <Link
              href={`section/${section.id}`}
              className="hover:underline hover:text-blue-600 text-base flex items-center gap-1"
            >
              View All Products
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* ✅ Product Row */}
          <div className="flex gap-6 w-full relative">
            {/* ✅ Banner Image */}
            {section.banner_image && (
              <div className="w-[250px] flex-shrink-0">
                <img
                  src={section.banner_image}
                  alt={section.title}
                  className="w-full h-full object-cover rounded-lg shadow"
                />
              </div>
            )}

            {/* ✅ Product Scroll Area */}
            <div className="flex-1 min-w-0 w-full relative">
              {/* Left Button */}
              <button
                className={`absolute -left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow z-10 transition ${
                  scrollStates[section.id]?.canScrollLeft
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-gray-100 opacity-50 cursor-not-allowed"
                }`}
                onClick={() => scroll(section.id, "left")}
                disabled={!scrollStates[section.id]?.canScrollLeft}
              >
                <ChevronLeft size={18} />
              </button>

              {/* ✅ Horizontal Scroll Container */}
              <div
                ref={el => {
                  scrollRefs.current[section.id] = el
                }}
                className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden  scroll-smooth snap-x snap-mandatory w-full"
                onScroll={() => updateScrollState(section.id)}
                onMouseDown={e => handleMouseDown(e, section.id)}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  cursor: isDragging ? "grabbing" : "grab",
                  userSelect: "none"
                }}
              >
                {section.products.map(product => (
                  <div
                    key={product.id}
                    className="snap-start min-w-[220px] w-[220px] h-[320px] flex-shrink-0"
                  >
                    <div className="w-full h-full">
                      <ProductCardComponent
                        product={mapToProductInCategory(product)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Button */}
              <button
                className={`absolute -right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow z-10 transition ${
                  scrollStates[section.id]?.canScrollRight
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-gray-100 opacity-50 cursor-not-allowed"
                }`}
                onClick={() => scroll(section.id, "right")}
                disabled={!scrollStates[section.id]?.canScrollRight}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductSectionPage
