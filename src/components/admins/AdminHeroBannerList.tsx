"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  createHeroBanner,
  getAllHeroBanners,
  updateHeroBanner,
  deleteHeroBanner
} from "../../services/heroBannerService"
import { getAllProducts } from "../../services/productService"
import {
  HeroBannerDto,
  CreateHeroBannerDto,
  UpdateHeroBannerDto
} from "../../types/heroBannerType"
import { ProductDto } from "../../types/productType"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Search,
  CheckCircle,
  XCircle,
  EllipsisVertical
} from "lucide-react"
import dayjs from "dayjs"

export default function AdminHeroBannerListComponent() {
  // ✅ Utility function for truncating text
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const [banners, setBanners] = useState<HeroBannerDto[]>([])
  const [products, setProducts] = useState<ProductDto[]>([])
  const [search, setSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isUploading, setIsUploading] = useState(false)
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // 🔽 Dropdown state for actions
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })

  const initialForm: CreateHeroBannerDto = {
    title: "",
    image: "",
    productId: ""
  }

  const [form, setForm] = useState<CreateHeroBannerDto>(initialForm)

  // ────────────────────────────────
  // FETCHING DATA
  // ────────────────────────────────
  useEffect(() => {
    fetchBanners()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (message || errorMessage) {
      const timeout = setTimeout(() => {
        setMessage("")
        setErrorMessage("")
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [message, errorMessage])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setSelectedAction(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchBanners = async () => {
    try {
      const data = await getAllHeroBanners()
      setBanners(data)
    } catch (err) {
      console.error("Error fetching banners:", err)
      setErrorMessage("Failed to load banners.")
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setErrorMessage("Failed to load products.")
    }
  }

  // ────────────────────────────────
  // FORM HANDLERS
  // ────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be under 5MB.")
      return
    }

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = event => {
      const base64 = event.target?.result as string
      setForm(prev => ({ ...prev, image: base64 }))
      setImagePreview(base64)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: "" }))
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setErrorMessage("Title is required")
      return
    }

    try {
      if (editingId) {
        await updateHeroBanner(editingId, form as UpdateHeroBannerDto)
        setMessage("Banner updated successfully.")
      } else {
        await createHeroBanner(form)
        setMessage("Banner created successfully.")
      }

      resetModal()
      fetchBanners()
    } catch (err) {
      console.error("Error saving banner:", err)
      setErrorMessage("Failed to save banner.")
    }
  }

  const resetModal = () => {
    setForm(initialForm)
    setEditingId(null)
    setIsModalOpen(false)
    setImagePreview("")
    setIsUploading(false)
    setProductSearch("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleEdit = (banner: HeroBannerDto) => {
    setForm({
      title: banner.title || "",
      image: banner.image || "",
      productId: banner.product?.id || ""
    })
    setImagePreview(banner.image || "")
    setProductSearch(banner.product?.product_name || "")
    setEditingId(banner.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteHeroBanner(id)
        setMessage("Banner deleted successfully.")
        fetchBanners()
      } catch (err) {
        console.error("Delete failed:", err)
        setErrorMessage("Failed to delete banner.")
      }
    }
  }

  // ────────────────────────────────
  // PAGINATION + SEARCH
  // ────────────────────────────────
  const filtered = banners.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedBanners = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // ────────────────────────────────
  // RENDER
  // ────────────────────────────────
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      {/* Search + Create */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search banners..."
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Banner
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* ✅ TABLE WITH PRODUCT IMAGE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Banner Image</th>
              <th className="px-4 py-3 font-medium">Product Name</th>
              <th className="px-4 py-3 font-medium">Product Image</th>
              <th className="px-4 py-3 font-medium">Created At</th>
              <th className="px-4 py-3 font-medium">Updated At</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBanners.length > 0 ? (
              paginatedBanners.map(banner => (
                <tr key={banner.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {truncateText(banner.title, 50)}
                  </td>
                  <td className="px-4 py-3">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-[50px] h-[50px] rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {banner.product
                      ? truncateText(banner.product.product_name, 50)
                      : "No Product"}
                  </td>
                  <td className="px-4 py-3">
                    {banner.product?.image ? (
                      <img
                        src={banner.product.image}
                        alt={banner.product.product_name}
                        className="w-[50px] h-[50px] rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {dayjs(banner.created_at).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {dayjs(banner.updated_at).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        const rect = e.currentTarget.getBoundingClientRect()
                        setDropdownPos({
                          x: rect.right - 150,
                          y: rect.bottom + window.scrollY + 4
                        })
                        setSelectedAction(banner.id)
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <EllipsisVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔽 Floating Dropdown */}
      {selectedAction && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: dropdownPos.y,
            left: dropdownPos.x
          }}
          className="absolute z-50 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <button
            onClick={() => {
              const banner = banners.find(b => b.id === selectedAction)
              if (banner) handleEdit(banner)
            }}
            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left text-sm text-gray-700"
          >
            <Pencil className="w-4 h-4 text-blue-600" /> Edit
          </button>
          <button
            onClick={() => handleDelete(selectedAction)}
            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left text-sm text-gray-700"
          >
            <Trash2 className="w-4 h-4 text-red-600" /> Delete
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? "Edit Hero Banner" : "Create Hero Banner"}
                </h2>
                <button
                  onClick={resetModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Enter banner title"
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              {/* Product Search Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={e => {
                      setProductSearch(e.target.value)
                      setIsProductDropdownOpen(true)
                    }}
                    onFocus={() => setIsProductDropdownOpen(true)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  {isProductDropdownOpen && productSearch && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
                    >
                      {products
                        .filter(prod =>
                          prod.product_name
                            .toLowerCase()
                            .includes(productSearch.toLowerCase())
                        )
                        .slice(0, 5)
                        .map(prod => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              setForm(prev => ({ ...prev, productId: prod.id }))
                              setProductSearch(prod.product_name)
                              setIsProductDropdownOpen(false)
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b last:border-b-0"
                          >
                            <div className="flex justify-between items-center">
                              <span>{prod.product_name}</span>
                              {prod.image && (
                                <img
                                  src={prod.image}
                                  alt="Product"
                                  className="w-12 h-12 object-cover rounded border"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      {products.filter(prod =>
                        prod.product_name
                          .toLowerCase()
                          .includes(productSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No products found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                {imagePreview && (
                  <div className="mb-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50"
                >
                  <Upload size={20} />
                  Upload Image
                </button>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={resetModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? "Update Banner" : "Create Banner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="whitespace-nowrap">
            Show
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {[5, 8, 10, 20].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <span className="text-xs text-gray-500">
            {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>

          <button
            aria-label="Previous Page"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-100 transition-colors"
          >
            ←
          </button>

          {/* ✅ Just show page number instead of page buttons */}
          <span className="text-xs font-normal px-3 py-2 text-gray-800 border-gray-300 bg-white rounded border">
            {currentPage} / {totalPages}
          </span>

          <button
            aria-label="Next Page"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-100 transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
