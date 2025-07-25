import React, { useEffect, useState } from "react"
import {
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../../services/cartService"
import { CartWithProductDto } from "../../types/cartType"
import { X, Minus, Plus, Trash2, ShoppingBag, ShieldAlert } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

const CustomerCartPopupSidebarComponent = ({
  onClose,
  onCartChange
}: {
  onClose: () => void
  onCartChange: () => void
}) => {
  const [cartItems, setCartItems] = useState<CartWithProductDto[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formatCurrency = (amount: number) =>
    `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`

  const fetchCart = async () => {
    try {
      setLoading(true)
      const data = await getMyCart()
      setCartItems(data.cart_items)
      const allIds = new Set(data.cart_items.map(item => item.id))
      setSelectedItems(allIds)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (index: number, delta: number) => {
    const item = cartItems[index]
    const maxStock = item.product.total_quantity
    const newQuantity = item.quantity + delta
    if (newQuantity < 1 || newQuantity > maxStock) return

    try {
      await updateCartItem(item.id, {
        size: item.size,
        quantity: newQuantity
      })
      await fetchCart()
      onCartChange()
    } catch (error) {
      console.error("Failed to update cart item:", error)
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeCartItem(cartItemId)
      setCartItems(prev => prev.filter(item => item.id !== cartItemId))
      setSelectedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(cartItemId)
        return newSet
      })
      onCartChange()
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
      setCartItems([])
      setSelectedItems(new Set())
      onCartChange()
    } catch (error) {
      console.error("Failed to clear cart:", error)
    }
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleCheckout = () => {
    const payload = Array.from(selectedItems).map(id => ({
      cart_item_id: id
    }))
    localStorage.setItem("selectedCartItems", JSON.stringify(payload))
    router.push("/customer/checkout")
  }

  const selectedTotal = cartItems.reduce((sum, item) => {
    if (selectedItems.has(item.id)) {
      return sum + Number(item.price_at_cart || 0)
    }
    return sum
  }, 0)

  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-900">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="text-end py-3 px-6">
          <button
            onClick={handleClearCart}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag className="h-16 w-16 mb-4 text-gray-300" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/customer/product/${item.product.id}`}
                  className="flex gap-3 pb-4 border-b border-gray-200 rounded-md transition-colors p-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onClick={e => e.stopPropagation()}
                    onChange={() => toggleItemSelection(item.id)}
                    className="mt-2"
                  />

                  <Image
                    src={item.product.image || "/placeholder.png"}
                    alt={item.product.product_name}
                    width={64}
                    height={64}
                    className="w-16 h-full object-cover rounded-md flex-shrink-0"
                    onClick={e => e.stopPropagation()}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 break-words pr-2">
                        {item.product.product_name}
                      </h3>
                      <button
                        onClick={e => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemoveItem(item.id)
                        }}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-row gap-4">
                        <span className="text-base font-semibold text-blue-600">
                          {formatCurrency(Number(item.price_at_cart))}
                        </span>
                        <span className="text-xs font-semibold text-gray-600 border border-gray-500 rounded-md px-3 py-0.5 text-center">
                          {item.size}
                        </span>
                      </div>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={e => {
                            e.preventDefault()
                            handleQuantityChange(index, -1)
                          }}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 py-1 text-xs font-medium bg-white min-w-[40px] text-center border-x border-gray-300">
                          {item.quantity.toString().padStart(2, "0")}
                        </span>
                        <button
                          onClick={e => {
                            e.preventDefault()
                            handleQuantityChange(index, 1)
                          }}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-100">
            <div className="flex items-center gap-2 rounded-lg mb-4">
              <ShieldAlert className="w-4 h-4" />
              <p className="text-sm text-gray-600">
                Please check the price carefully before checkout.
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-900">
                ORDER TOTAL:
              </span>
              <span className="text-base font-semibold text-red-600">
                {formatCurrency(selectedTotal)}
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/customer/cart")}
                className="w-full py-3 px-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-200 transition-colors text-xs"
              >
                VIEW CART
              </button>
              <button
                onClick={handleCheckout}
                disabled={selectedItems.size === 0}
                className={`w-full py-3 px-4 rounded-full text-xs font-medium transition-colors ${
                  selectedItems.size === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                CHECK OUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerCartPopupSidebarComponent
