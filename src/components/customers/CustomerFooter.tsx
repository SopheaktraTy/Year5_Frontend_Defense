import React, { useState } from "react"
import {
  Truck,
  CreditCard,
  Shield,
  MessageCircle,
  FileText
} from "lucide-react"

const CustomerFooterComponent = () => {
  const [email, setEmail] = useState("")

  const handleSubscribe = () => {
    if (email) {
      console.log("Subscribing email:", email)
      setEmail("")
      // Add your subscription logic here
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubscribe()
    }
  }

  return (
    <footer className="bg-white">
      {/* Features Section */}
      <div className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Fast Delivery */}
            <div className="flex flex-col items-center text-center">
              <Truck className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                FAST DELIVERY
              </h3>
              <p className="text-xs text-gray-600">Across West & East India</p>
            </div>

            {/* Safe Payment */}
            <div className="flex flex-col items-center text-center">
              <CreditCard className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                SAFE PAYMENT
              </h3>
              <p className="text-xs text-gray-600">100% Secure Payment</p>
            </div>

            {/* Online Discount */}
            <div className="flex flex-col items-center text-center">
              <Shield className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                ONLINE DISCOUNT
              </h3>
              <p className="text-xs text-gray-600">Add Multi-buy Discount</p>
            </div>

            {/* Help Center */}
            <div className="flex flex-col items-center text-center">
              <MessageCircle className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                HELP CENTER
              </h3>
              <p className="text-xs text-gray-600">Dedicated 24/7 Support</p>
            </div>

            {/* Curated Items */}
            <div className="flex flex-col items-center text-center">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                CURATED ITEMS
              </h3>
              <p className="text-xs text-gray-600">From Handpicked Sellers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About the Store */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                ABOUT THE STORE
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Got Question? Call us 24/7
                </p>
                <div className="text-blue-600 font-bold text-xl">
                  +222-1800-262
                </div>
                <p className="text-gray-600 text-sm">
                  268 St, Toulkork/ 12500, Phnom Penh
                </p>
                <p className="text-gray-600 text-sm">
                  Customersupport@example.com
                </p>
              </div>
            </div>

            {/* Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                INFORMATION
              </h3>
              <p className="text-gray-500 text-sm italic">
                You have not selected the footer menu
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                QUICK LINKS
              </h3>
              <p className="text-gray-500 text-sm italic">
                You have not selected the footer menu
              </p>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                NEWSLETTER SIGNUP
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Join 20.000+ subscribers and get a new discount coupon on every
                Saturday. Updates information on Sales and Offers.
              </p>
              <div className="flex mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Your email address..."
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  onClick={handleSubscribe}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-medium"
                >
                  SUBSCRIBE
                </button>
              </div>
              <p className="text-gray-500 text-xs">
                Subscribe for Uminex and get 20% off your first purchase.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-gray-600 mb-4 md:mb-0">
              Copyright ©{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Uminex
              </span>{" "}
              all rights reserved. Powered by{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Alothemes
              </span>
              .
            </div>
            <div className="flex items-center space-x-2">
              {/* Payment Icons */}
              <div className="flex items-center space-x-1">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DISC</span>
                </div>
                <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center">
                  <span className="text-black text-xs font-bold">WU</span>
                </div>
                <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AMEX</span>
                </div>
                <div className="w-10 h-6 bg-blue-700 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CITI</span>
                </div>
                <div className="w-10 h-6 bg-blue-800 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CustomerFooterComponent
