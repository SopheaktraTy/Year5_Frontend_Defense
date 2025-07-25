import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getProductById } from "../../services/productService"
import {
  ProductDto,
  ProductVariableInProductDto
} from "../../types/productType"
import {
  Minus,
  Plus,
  RulerDimensionLine,
  Shield,
  Mail,
  Ship,
  CircleFadingArrowUp
} from "lucide-react"
import { addToCart } from "../../services/cartService"
import { toast } from "react-hot-toast"

interface ProductDetailPageProps {
  onProductLoaded?: (productName: string) => void
  onAddToCart?: () => void
}

const CustomerProductDetailComponent: React.FC<ProductDetailPageProps> = ({
  onProductLoaded,
  onAddToCart
}) => {
  const router = useRouter()
  const { productId } = router.query

  const [product, setProduct] = useState<ProductDto | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (productId && typeof productId === "string") {
      getProductById(productId)
        .then(res => {
          const data = res?.data || res
          setProduct({
            ...data,
            product_variables: Array.isArray(data.product_variables)
              ? data.product_variables
              : []
          })
          if (onProductLoaded) {
            onProductLoaded(data.product_name)
          }
        })
        .catch(console.error)
    }
  }, [productId, onProductLoaded])

  useEffect(() => {
    setQuantity(1)
  }, [selectedSize])

  if (!product)
    return <div className="text-center py-10">Loading product...</div>

  const selectedVariable: ProductVariableInProductDto | undefined =
    product.product_variables.find(v => v.size === selectedSize)

  const isInStock = selectedSize
    ? selectedVariable && selectedVariable.quantity > 0
    : product.total_quantity > 0

  const originalPrice =
    typeof product.original_price === "number" ? product.original_price : 0
  const discountedPrice =
    typeof product.discounted_price === "number" ? product.discounted_price : 0
  const discountAmount = (originalPrice - discountedPrice).toFixed(2)

  const lowStockWarning = selectedSize
    ? selectedVariable && selectedVariable.quantity < 3
    : product.total_quantity < 3

  const currentStock = selectedSize
    ? selectedVariable?.quantity ?? 0
    : product.total_quantity

  const handleAddToCart = async () => {
    if (
      !product ||
      !isInStock ||
      (product.product_variables.length > 0 && !selectedSize)
    )
      return

    try {
      setAdding(true)
      await addToCart({
        items: [{ productId: product.id, size: selectedSize, quantity }]
      })
      toast.success("Product added to cart!")
      if (onAddToCart) onAddToCart()
    } catch (error) {
      console.error("Add to cart failed:", error)
      toast.error("Failed to add product to cart.")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-lg">
      <div className="relative">
        <img
          src={product.image || "https://via.placeholder.com/500"}
          alt={product.product_name}
          className="w-full rounded-lg border object-contain"
        />
      </div>

      <div className="">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4 line-clamp-2 break-words">
          {product.product_name}
        </h1>

        <hr className="my-4 border-gray-200 rounded-lg" />
        <div className="flex items-end gap-3 mb-1">
          <span className="text-3xl font-semibold text-blue-600">
            ${discountedPrice.toFixed(2)}
          </span>

          {originalPrice !== discountedPrice && (
            <span className="line-through font-normal text-gray-400 text-sm">
              <div className="font-normal text-gray-400 text-lg">
                ${originalPrice.toFixed(2)}
              </div>
            </span>
          )}
        </div>

        {originalPrice !== discountedPrice && (
          <p className="text-red-500 mb-4 text-sm">
            Discount: ${discountAmount} ({product.discount_percentage_tag}%)
          </p>
        )}

        <p className="font-normal text-base text-gray-600 mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-start gap-4 ">
          <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
            <RulerDimensionLine size={17} />
            <span>Size chart</span>
          </button>

          <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
            <Shield size={17} />
            <span>Shipping and Returns</span>
          </button>

          <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
            <Mail size={16} />
            <span>Contact us</span>
          </button>
        </div>
        <hr className="my-4 border-gray-200 rounded-lg" />

        <div className="mb-4">
          <p className="font-medium text-gray-700 mb-2 text-base">
            Size:{" "}
            <span className="text-sm font-semibold text-gray-900">
              {selectedSize || "Select Size"}
            </span>
          </p>

          <div className="flex gap-2">
            {product.product_variables.length === 0 ? (
              <span className="text-gray-500 text-sm">N/A</span>
            ) : (
              product.product_variables.map(variable => (
                <button
                  key={variable.id}
                  className={`border px-4 py-2 rounded-md text-sm transition-colors ${
                    selectedSize === variable.size
                      ? "border-blue-600 text-blue-600"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedSize(variable.size)}
                >
                  {variable.size}
                </button>
              ))
            )}
          </div>
        </div>
        <hr className="my-4 border-gray-200 rounded-lg" />

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border rounded-full overflow-hidden">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-3 py-2 text-gray-600"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <div className="px-3 py-2">{quantity}</div>
            <button
              onClick={() => setQuantity(q => (q < currentStock ? q + 1 : q))}
              className="px-3 py-2 text-gray-600"
              disabled={quantity >= currentStock}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white rounded-full py-3 px-6 text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              product.product_variables.length > 0
                ? !selectedSize || !isInStock
                : !isInStock
            }
          >
            Add to Cart
          </button>
        </div>
        {lowStockWarning && (
          <div className="mb-4 flex flex-rol items-center gap-2 ">
            <div className="h-1.5 w-1.5 bg-red-500 rounded-full mt-1" />
            <p className="text-sm text-red-500 text-center">
              {currentStock === 0
                ? "The product is out of stock!!!"
                : `Hurry Up! Only ${currentStock} Left in Stock!`}
            </p>
          </div>
        )}

        <hr className="my-4 border-gray-200 rounded-lg" />
        <div className="font-normal text-base text-gray-600 mb-6 flex flex-col">
          <div className="flex flex-rol items-center gap-1.5 ">
            <Ship size={16} />
            <p>
              Estimated Delivery:{" "}
              <strong className="font-bold text-base text-gray-700">
                Jul 26 - Jul 30
              </strong>
            </p>
          </div>
          <div className="flex flex-rol items-center gap-1.5">
            <CircleFadingArrowUp size={16} />
            <p>
              Return within{" "}
              <strong className="font-bold text-base text-gray-700">
                30 days
              </strong>{" "}
              of purchase. Taxes are non-refundable.
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-200 rounded-lg" />
        <div className="font-normal text-base text-gray-600">
          <p className="flex flex-rol gap-4">
            Availability:{" "}
            <span className={isInStock ? "text-green-600" : "text-red-600"}>
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          <p className="flex flex-rol gap-4">
            Categories: <span>{product.category?.category_name}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CustomerProductDetailComponent
