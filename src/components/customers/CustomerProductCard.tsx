import React, { useState } from "react"
import { useRouter } from "next/router"
import { Heart, Eye, Shuffle, Check } from "lucide-react"
import { ProductInCategory } from "../../types/categoryType"
import PopupProductDetailPage from "../../components/customers/CustomerPopupProductDetail" // Import the modal

interface ProductCardProps {
  product: ProductInCategory
}

const CustomerProductCardComponent: React.FC<ProductCardProps> = ({
  product
}) => {
  const router = useRouter()
  const inStock = product.total_quantity > 0
  const [showPopup, setShowPopup] = useState(false) // Local modal control

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  const handleCardClick = () => {
    router.push(`/customer/product/${product.id}`)
  }

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="relative group border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      >
        {/* Discount Badge */}
        {product.discount_percentage_tag > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded">
            - {product.discount_percentage_tag}%
          </div>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/400x400?text=No+Image"
            }
            alt={product.product_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Hover Icons */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[Heart, Shuffle, Eye].map((Icon, index) => (
            <button
              key={index}
              onClick={handleStopPropagation}
              className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Icon className="w-4 h-4 text-gray-600" />
            </button>
          ))}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="font-medium text-base text-start text-gray-900 mb-1 line-clamp-3 leading-6">
            {product.product_name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-base font-medium  ${
                product.original_price === product.discounted_price
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {formatPrice(product.discounted_price)}
            </span>

            {product.original_price > product.discounted_price && (
              <span className="mt-1 text-sm line-through text-gray-400">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          <div
            className={`text-sm font-normal flex items-center gap-1 ${
              inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            <Check
              size={16}
              className={inStock ? "text-green-500" : "text-red-500"}
            />
            {inStock ? "In stock" : "Out of Stock"}
          </div>
        </div>

        {/* Bottom Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={e => {
              handleStopPropagation(e)
              setShowPopup(true) // Open modal
            }}
            className={`w-full px-4 py-2.5 rounded-full text-white text-xs font-semibold transition-colors ${
              inStock
                ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                : "bg-red-600 cursor-not-allowed"
            }`}
            disabled={!inStock}
          >
            {inStock ? "Select An Option" : "Out Of Stock"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showPopup && (
        <PopupProductDetailPage
          productId={product.id}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  )
}

export default CustomerProductCardComponent
