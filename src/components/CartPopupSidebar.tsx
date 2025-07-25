import React, { useState } from "react"
import { CartWithProductDto } from "../types/cartType"
import { X, ShoppingBag } from "lucide-react"
import { useRouter } from "next/router"

const CartPopupSidebarComponent = ({
  onClose,
  onCartChange
}: {
  onClose: () => void
  onCartChange: () => void
}) => {
  const router = useRouter()

  const [cartItems, setCartItems] = useState<CartWithProductDto[]>([])
  const [loading, setLoading] = useState(false)

  const formatCurrency = (amount: number) =>
    `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`

  // Clear cart handler
  const handleClearCart = () => {
    setCartItems([])
    onCartChange()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-900">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Clear All */}
        {cartItems.length > 0 && (
          <div className="text-end py-3 px-6">
            <button
              onClick={handleClearCart}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ShoppingBag className="h-16 w-16 mb-4 text-gray-300" />
            <p>Your cart is empty</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPopupSidebarComponent
