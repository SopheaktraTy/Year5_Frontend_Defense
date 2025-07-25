import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getCartItemById } from "../../services/cartService"
import { createOrder } from "../../services/orderService"
import { CartItemDto } from "../../types/cartType"
import { CreateOrderDto } from "../../types/orderType"

import {
  Truck,
  Package,
  ChevronDown,
  ShieldCheck,
  CheckCircle,
  XCircle
} from "lucide-react"
import Image from "next/image"

const CustomerCheckoutComponent = () => {
  const [cartItems, setCartItems] = useState<CartItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter()

  const formatCurrency = (amount: number) =>
    `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`

  const fetchSelectedCartItems = async () => {
    try {
      const stored = localStorage.getItem("selectedCartItems")
      const selected = stored ? JSON.parse(stored) : []

      const fetches = await Promise.all(
        selected.map((item: { cart_item_id: string }) =>
          getCartItemById(item.cart_item_id)
        )
      )

      setCartItems(fetches)
    } catch (err) {
      console.error("Failed to load cart items:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePayNow = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        cart_item_id: item.id
      }))
      const orderData: CreateOrderDto = {
        order_items: orderItems
      }

      await createOrder(orderData)
      localStorage.removeItem("selectedCartItems")
      setShowSuccess(true)
    } catch (err) {
      console.error("Order creation failed:", err)
    }
  }

  useEffect(() => {
    fetchSelectedCartItems()
  }, [])

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price_at_cart),
    0
  )

  return (
    <>
      <div className="flex flex-col lg:flex-row p-6 gap-6 w-full bg-white">
        {/* Left: Shipping Form */}
        <div className="w-full lg:w-1/2 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Shipping Information
          </h2>

          {/* Delivery Type Selection */}
          <div className="flex gap-2 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium bg-blue-50 border-blue-200 text-blue-700">
              <Truck className="w-4 h-4" />
              Delivery
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium bg-white border-gray-200 text-gray-600 hover:bg-gray-50">
              <Package className="w-4 h-4" />
              Pick up
            </button>
          </div>

          {/* Shipping Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center px-3 py-3 border border-r-0 border-gray-300 rounded-l-md bg-white">
                  <img
                    src="data:image/svg+xml;base64,..."
                    alt="US Flag"
                    className="w-5 h-3 mr-2"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-r-md text-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-400 bg-white appearance-none">
                  <option value="">Choose country</option>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="th">Thailand</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="City"
                className="px-3 py-3 border border-gray-300 rounded-md text-gray-500"
              />
              <input
                type="text"
                placeholder="State"
                className="px-3 py-3 border border-gray-300 rounded-md text-gray-500"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                className="px-3 py-3 border border-gray-300 rounded-md text-gray-500"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 mt-4">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I have read and agree to the Terms and Conditions.
              </label>
            </div>
          </div>
        </div>

        {/* Right: Cart Summary */}
        <div className="w-full lg:w-1/2 bg-white pl-6 border-l border-dashed space-y-4">
          <h3 className="font-semibold text-lg">Review your cart</h3>

          {loading ? (
            <p>Loading...</p>
          ) : cartItems.length === 0 ? (
            <p>No items selected.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={
                      item.product_variable.product.image || "/placeholder.png"
                    }
                    alt={item.product_variable.product.product_name}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.product_variable.product.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-right text-sm text-gray-800">
                    {formatCurrency(item.price_at_cart)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total</span>
                <span className="text-grey-600 text-lg">
                  {formatCurrency(total)}
                </span>
              </div>

              <button
                onClick={handlePayNow}
                disabled={cartItems.length === 0}
                className={`w-full py-3 rounded-full text-white text-sm font-semibold ${
                  cartItems.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Pay Now
              </button>

              <div className="text-sm font-semibold text-gray-700 flex items-center gap-2 pt-4">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Secure Checkout - SSL Encrypted</span>
              </div>
              <div className="text-sm text-gray-500">
                We protect your personal and financial info with care.
              </div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 mt-2">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* ✅ Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-xl">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Your order has been placed. Thank you for shopping with us!
            </p>
            <button
              onClick={() => router.push("/customer")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CustomerCheckoutComponent
