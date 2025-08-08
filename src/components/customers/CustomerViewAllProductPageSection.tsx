import React, { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/router"
import {
  getProductSectionPageById,
  getAllProductSectionPages
} from "../../services/productSectionPageService"
import {
  ProductSectionPageDto,
  ProductDto
} from "../../types/productSectionPageType"
import { ProductInCategory } from "../../types/categoryType"
import CustomerProductCardComponent from "./CustomerProductCard"

// ✅ Helper: map ProductDto to ProductInCategory (guarantee image is a string)
const mapToProductInCategory = (product: ProductDto): ProductInCategory => ({
  ...product,
  image: product.image || "" // fallback to empty string
})

const CustomerViewAllProductPageSection: React.FC = () => {
  const router = useRouter()
  const { sectionId } = router.query

  const [section, setSection] = useState<ProductSectionPageDto | null>(null)
  const [allSections, setAllSections] = useState<ProductSectionPageDto[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("az")

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8) // default 8 items per page

  useEffect(() => {
    if (sectionId && typeof sectionId === "string") {
      fetchSectionData(sectionId)
    }
  }, [sectionId])

  useEffect(() => {
    fetchAllSections()
  }, [])

  const fetchSectionData = async (id: string) => {
    try {
      setLoading(true)
      const data = await getProductSectionPageById(id)
      setSection(data)
    } catch (err) {
      console.error("Failed to load section:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllSections = async () => {
    try {
      const data = await getAllProductSectionPages()
      setAllSections(data)
    } catch (err) {
      console.error("Failed to load all sections:", err)
    }
  }

  const sortedProducts = useMemo(() => {
    if (!section) return []

    return [...section.products].sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.product_name.localeCompare(b.product_name)
        case "za":
          return b.product_name.localeCompare(a.product_name)
        case "price-low-high":
          return a.discounted_price - b.discounted_price
        case "price-high-low":
          return b.discounted_price - a.discounted_price
        default:
          return 0
      }
    })
  }, [section, sortBy])

  // ✅ Pagination calculations
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!section)
    return <div className="text-center py-20">Section not found.</div>

  return (
    <div className="min-h-screen">
      {/* ✅ Banner/Header Section */}
      <div className="bg-gray-900 text-white py-16 px-4 relative">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{section.title}</h1>
          <p className="text-sm text-gray-300">
            Browse all products in this section
          </p>
        </div>
      </div>

      {/* ✅ Content */}
      <div className="container mx-auto py-8 flex gap-6">
        {/* ✅ Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 rounded-lg bg-white p-4 shadow">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-2">{section.title}</h1>
              <span className="text-gray-600 text-base font-normal">
                {sortedProducts.length} products
              </span>
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white min-w-32"
            >
              <option value="az">Name: A-Z</option>
              <option value="za">Name: Z-A</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          {/* ✅ Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map(product => (
              <CustomerProductCardComponent
                key={product.id}
                product={mapToProductInCategory(product)}
              />
            ))}
          </div>

          {paginatedProducts.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              No products found in this section.
            </div>
          )}

          {/* ✅ Pagination */}
          {sortedProducts.length > 0 && (
            <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-md">
              {/* Items per page dropdown */}
              <div className="flex items-center gap-2 text-sm">
                <span>Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={e => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1) // reset page when changing per-page count
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>items</span>
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerViewAllProductPageSection
