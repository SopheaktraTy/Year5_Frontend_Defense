import React, { useState } from "react"

interface FilterProps {
  categories: { id: string; name: string }[]
  selectedCategoryId?: string
  onCategoryChange: (id: string) => void
  onPriceChange: (min: number, max: number) => void
  onAvailabilityChange: (availability: "in" | "out" | null) => void
  onDiscountChange: (range: "low" | "high" | null) => void
}

const CategoriesSidebar: React.FC<FilterProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onPriceChange,
  onAvailabilityChange,
  onDiscountChange
}) => {
  const [priceFrom, setPriceFrom] = useState("")
  const [priceTo, setPriceTo] = useState("")
  const [availability, setAvailability] = useState<"in" | "out" | null>(null)
  const [discount, setDiscount] = useState<"low" | "high" | null>(null)

  const handlePriceSubmit = () => {
    const min = parseFloat(priceFrom) || 0
    const max = parseFloat(priceTo) || 10000
    onPriceChange(min, max)
  }

  const handleAvailabilityChange = (value: "in" | "out") => {
    const newValue = availability === value ? null : value
    setAvailability(newValue)
    onAvailabilityChange(newValue)
  }

  const handleDiscountChange = (value: "low" | "high") => {
    const newValue = discount === value ? null : value
    setDiscount(newValue)
    onDiscountChange(newValue)
  }

  return (
    <aside className="w-full max-w-xs bg-white rounded-lg">
      <div className="p-7">
        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 ">
            PRODUCT CATEGORIES
          </h3>
          <div className="space-y-2">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map(cat => (
                <label
                  key={cat.id}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryId === cat.id}
                    onChange={() => onCategoryChange(cat.id)}
                    className="w-4 h-4 text-blue-600 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span
                    className={`ml-3 text-sm  ${
                      selectedCategoryId === cat.id
                        ? "text-blue-600 font-medium"
                        : "text-gray-700 group-hover:text-gray-900"
                    }`}
                  >
                    {cat.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No categories available</p>
            )}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-8 ">
          <h3 className="text-base font-bold text-gray-900 mb-4 ">PRICE</h3>
          <div className="space-y-3">
            <div className="flex gap-2 ">
              <input
                type="number"
                placeholder="From"
                value={priceFrom}
                onChange={e => setPriceFrom(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
              />
              <input
                type="number"
                placeholder="To"
                value={priceTo}
                onChange={e => setPriceTo(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
              />
            </div>
            <button
              onClick={handlePriceSubmit}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 ">
            AVAILABILITY
          </h3>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={availability === "in"}
                onChange={() => handleAvailabilityChange("in")}
                className="w-4 h-4 text-green-600 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                In stock
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={availability === "out"}
                onChange={() => handleAvailabilityChange("out")}
                className="w-4 h-4 text-red-600 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                Out of stock
              </span>
            </label>
          </div>
        </div>

        {/* Discount Filter */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 ">DISCOUNT</h3>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={discount === "low"}
                onChange={() => handleDiscountChange("low")}
                className="w-4 h-4 text-orange-600 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:ring-offset-0"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                0% - 50%
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={discount === "high"}
                onChange={() => handleDiscountChange("high")}
                className="w-4 h-4 text-red-600 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                Above 50%
              </span>
            </label>
          </div>
        </div>

        {/* Clear All Filters */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setPriceFrom("")
              setPriceTo("")
              setAvailability(null)
              setDiscount(null)
              onAvailabilityChange(null)
              onDiscountChange(null)
            }}
            className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </aside>
  )
}

export default CategoriesSidebar
