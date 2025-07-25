import React, { useState, useEffect } from "react"
import { ChevronDown, ShoppingCart, BadgePercent, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import CartPopupSidebar from "@components/CartPopupSidebar"
import { getAllCategories } from "@services/categoryService"
import { CategoryDto } from "../types/categoryType"

// Utility to format price
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount)
}

const CustomerHeaderComponent = () => {
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in category:", selectedCategory)
    // Optional: router.push to a search page
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const fetchCartSummary = () => {
    // You can replace this with real cart fetching logic
    setTotalQuantity(0)
    setTotalPrice(0)
  }

  useEffect(() => {
    fetchCartSummary()
  }, [])

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        {/* Moving Banner */}
        <div className="bg-blue-600 text-white py-2 overflow-hidden">
          <div
            className="flex whitespace-nowrap animate-marquee"
            style={{ animation: "marquee 20s linear infinite", width: "200%" }}
          >
            <div className="flex w-max">
              {[...Array(20)].map((_, i) => (
                <span
                  key={i}
                  className="mx-4 text-xs flex items-center gap-1.5"
                >
                  <BadgePercent size={14} /> Special offer: enjoy 3 months of
                  shopping for $1/month
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo/Logo Horizonal.svg"
                alt="Monostore Logo"
                width={140}
                height={45}
                priority
                className="cursor-pointer"
              />
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex">
                {/* Category Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 border-r-0 rounded-l-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="whitespace-nowrap">
                      {selectedCategory}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.category_name)
                            setIsDropdownOpen(false)
                            router.push(`/category/${category.id}`)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {category.category_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 text-sm border border-gray-300 bg-gray-50 focus:outline-none focus:ring-0"
                />

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="px-6 py-1.5 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 text-sm"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-5">
              {/* Cart */}
              <div
                onClick={() => setShowCartSidebar(true)}
                className="p-2 flex items-center space-x-5 cursor-pointer rounded-lg hover:bg-gray-100"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-blue-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Your Cart</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Login/Account */}
              <Link
                href="/login"
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
              >
                <User className="h-6 w-6" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Login</span>
                  <span className="text-sm font-medium">Account</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for Cart */}
      {showCartSidebar && (
        <CartPopupSidebar
          onClose={() => setShowCartSidebar(false)}
          onCartChange={fetchCartSummary}
        />
      )}
    </>
  )
}

export default CustomerHeaderComponent
