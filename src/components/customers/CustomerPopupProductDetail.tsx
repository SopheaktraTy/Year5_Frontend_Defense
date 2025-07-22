import React, { useEffect, useState } from "react"
import { getProductById } from "../../services/productService"
import {
  ProductDto,
  ProductVariableInProductDto
} from "../../types/productType"
import { Minus, Plus, X } from "lucide-react"
import { addToCart } from "../../services/cartService"
import { toast } from "react-hot-toast"

interface PopupProductDetailPageProps {
  productId: string
  onClose: () => void
  onProductLoaded?: (productName: string) => void
  onAddToCart?: () => void
}

const PopupProductDetailPage: React.FC<PopupProductDetailPageProps> = ({
  productId,
  onClose,
  onProductLoaded,
  onAddToCart
}) => {
  const [product, setProduct] = useState<ProductDto | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    if (productId) {
      getProductById(productId)
        .then(res => {
          const data = res?.data || res
          setProduct({
            ...data,
            product_variables: Array.isArray(data.product_variables)
              ? data.product_variables
              : []
          })
          onProductLoaded?.(data.product_name)
        })
        .catch(console.error)
    }
  }, [productId, onProductLoaded])

  useEffect(() => {
    setQuantity(1)
  }, [selectedSize])

  if (!product) return null

  const selectedVariable: ProductVariableInProductDto | undefined =
    product.product_variables.find(v => v.size === selectedSize)

  const originalPrice =
    typeof product.original_price === "number" ? product.original_price : 0
  const discountedPrice =
    typeof product.discounted_price === "number" ? product.discounted_price : 0

  const currentStock = selectedSize
    ? selectedVariable?.quantity ?? 0
    : product.total_quantity
  const isInStock = selectedSize
    ? (selectedVariable?.quantity ?? 0) > 0
    : product.total_quantity > 0
  const lowStockWarning = currentStock < 3

  const handleAddToCart = async () => {
    if (
      !product ||
      !isInStock ||
      (product.product_variables.length > 0 && !selectedSize)
    ) {
      return
    }

    try {
      await addToCart({
        items: [
          {
            productId: product.id,
            size: selectedSize,
            quantity
          }
        ]
      })

      toast.success("Product added to cart!")
      onAddToCart?.() // ✅ Open Cart Sidebar
      onClose() // ✅ Close the Popup
    } catch (err) {
      console.error("Failed to add to cart:", err)
      toast.error("Failed to add product to cart.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-3xl w-full rounded-lg shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 border-b border-gray-200">
          <h3 className="text-base font-bold text-gray-800">OPTION FOR YOU</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Left - Image & Info */}
          <div className="flex gap-4 border-r border-dashed">
            <img
              src={product.image || "https://via.placeholder.com/80"}
              alt={product.product_name}
              className="w-24 h-24 object-contain"
            />
            <div className="flex flex-col gap-1.5">
              <h2 className="font-medium text-gray-900 text-base leading-tight truncate max-w-56">
                {product.product_name}
              </h2>

              {/* Price */}
              <div className="flex items-end gap-2">
                <span
                  className={`text-lg font-semibold ${
                    originalPrice === discountedPrice
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  ${discountedPrice.toFixed(2)}
                </span>
                {originalPrice !== discountedPrice && (
                  <span className="text-sm line-through text-gray-400">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-1.5 mt-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm transition-colors ${
                    quantity <= 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
                  }`}
                >
                  <Minus
                    size={10}
                    className={
                      quantity <= 1 ? "text-gray-300" : "text-gray-600"
                    }
                  />
                </button>

                <div className="w-20 h-8 flex items-center justify-center border border-gray-300 bg-gray-100 font-medium text-gray-900">
                  {quantity}
                </div>

                <button
                  onClick={() =>
                    setQuantity(q => (q < currentStock ? q + 1 : q))
                  }
                  disabled={quantity >= currentStock}
                  aria-label="Increase quantity"
                  className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm transition-colors ${
                    quantity >= currentStock
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Plus
                    size={10}
                    className={
                      quantity >= currentStock
                        ? "text-gray-300"
                        : "text-gray-600"
                    }
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right - Size & Stock */}
          <div className="flex flex-col justify-between gap-4">
            {product.product_variables.length > 0 && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Size:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedSize || "Select Size"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.product_variables.map(variable => (
                      <button
                        key={variable.id}
                        onClick={() => setSelectedSize(variable.size)}
                        className={`px-4 py-1 border rounded-sm text-sm font-medium transition-all ${
                          selectedSize === variable.size
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {variable.size}
                      </button>
                    ))}
                  </div>
                </div>

                {lowStockWarning && (
                  <p className="text-sm font-medium">
                    {currentStock === 0 ? (
                      <span className="text-red-600">
                        The product is out of stock!
                      </span>
                    ) : (
                      <span className="text-orange-600">
                        Hurry Up! Only {currentStock} Left in Stock!
                      </span>
                    )}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            disabled={
              product.product_variables.length > 0
                ? !selectedSize || !isInStock
                : !isInStock
            }
            className={`w-full py-3 rounded-full text-xs font-semibold transition-all ${
              product.product_variables.length > 0
                ? !selectedSize || !isInStock
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl"
                : !isInStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl"
            }`}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopupProductDetailPage
