import React, { useEffect, useState } from "react"
import {
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../../services/cartService"
import { CartWithProductDto } from "../../types/cartType"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

const CustomerCartComponent = () => {
  const [cartItems, setCartItems] = useState<CartWithProductDto[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [agree, setAgree] = useState(false)
  const router = useRouter()

  const fetchCart = async () => {
    try {
      setLoading(true)
      const data = await getMyCart()
      setCartItems(data.cart_items)
      const allIds = new Set(
        data.cart_items.map((item: CartWithProductDto) => item.id)
      )
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
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  const toggleSelection = (cartItemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cartItemId)) {
        newSet.delete(cartItemId)
      } else {
        newSet.add(cartItemId)
      }
      return newSet
    })
  }

  const formatCurrency = (amount: number) =>
    `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price_at_cart || 0),
    0
  )

  const selectedTotal = cartItems.reduce((sum, item) => {
    if (selectedItems.has(item.id)) {
      return sum + Number(item.price_at_cart || 0)
    }
    return sum
  }, 0)

  useEffect(() => {
    fetchCart()
  }, [])

  const handleCheckout = () => {
    const selectedPayload = Array.from(selectedItems).map(id => ({
      cart_item_id: id
    }))
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedPayload))
    router.push("/customer/checkout")
  }

  return (
    <div className="p-6 gap-8 w-full flex flex-col lg:flex-row bg-white rounded-lg shadow-sm">
      {/* Cart Items */}
      <div className="flex flex-col w-full ">
        <h2 className="text-lg font-semibold ">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="=">
            {cartItems.map((item, index) => (
              <Link
                key={item.id}
                href={`/customer/product/${item.product.id}`}
                className="flex items-center gap-4 pb-4 hover:bg-gray-50 p-3 rounded-md"
              >
                {/* Checkbox */}
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onClick={e => e.stopPropagation()}
                    onChange={() => toggleSelection(item.id)}
                    className="w-4 h-4"
                  />
                </div>

                {/* Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.product.image || "/placeholder.png"}
                    alt={item.product.product_name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-md"
                    onClick={e => e.stopPropagation()}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product.product_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size || "N/A"}
                  </p>
                  <p className="text-red-500 text-sm font-semibold">
                    {formatCurrency(Number(item.price_at_cart))}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div
                  className="flex items-center gap-2"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleQuantityChange(index, -1)}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[30px] text-center">
                    {item.quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(index, 1)}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemoveItem(item.id)
                  }}
                  className="text-gray-500 hover:text-red-500 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/customer"
            className="inline-block px-6 py-2 bg-blue-700 text-white rounded-full text-sm font-semibold hover:bg-blue-800"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Order Note */}
        <div className="mt-10">
          <h3 className="text-base font-semibold mb-2">Add Order Note</h3>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-gray-200 p-4 text-sm text-gray-700 bg-gray-50"
            placeholder="How can we help you?"
          ></textarea>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="rounded-lg border-2 border-blue-700 p-4 sm:p-6 bg-white shadow-sm w-full h-full">
        <h3 className="text-lg font-semibold mb-4">Cart Totals</h3>
        <div className="flex justify-between py-2 border-b text-base font-semibold">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between py-2 border-b text-base font-semibold">
          <span>Order Totals</span>
          <span className="text-red-600 font-semibold text-lg">
            {formatCurrency(selectedTotal)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2 mb-4 whitespace-nowrap">
          Taxes and shipping calculated at checkout
        </p>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="terms"
            className="mr-2"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <label htmlFor="terms" className="text-sm">
            I agree with{" "}
            <span className="text-blue-700 underline">Terms & Conditions</span>
          </label>
        </div>
        <button
          disabled={!agree || selectedItems.size === 0}
          onClick={handleCheckout}
          className={`w-full py-3 text-xs font-semibold rounded-full ${
            agree && selectedItems.size > 0
              ? "bg-indigo-400 text-white hover:bg-indigo-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          CHECK OUT
        </button>
      </div>
    </div>
  )
}

export default CustomerCartComponent
