"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  createProductSectionPage,
  getAllProductSectionPages,
  updateProductSectionPage,
  deleteProductSectionPage,
  addProductToSectionPage,
  removeProductFromSectionPage
} from "../../services/productSectionPageService"
import { getAllProducts } from "../../services/productService"
import {
  ProductSectionPageDto,
  CreateProductSectionPageDto,
  UpdateProductSectionPageDto,
  ProductDto
} from "../../types/productSectionPageType"
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

export default function AdminProductSectionPageListComponent() {
  // ────────────────────────────────
  // STATES
  // ────────────────────────────────
  const [sectionPages, setSectionPages] = useState<ProductSectionPageDto[]>([])
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

  // dropdown state
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })

  // product selection for section
  const [selectedProducts, setSelectedProducts] = useState<ProductDto[]>([])
  const [originalProducts, setOriginalProducts] = useState<ProductDto[]>([]) // ✅ Track original products for diffing

  // refs
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // ────────────────────────────────
  // FORM SETUP
  // ────────────────────────────────
  const initialForm: CreateProductSectionPageDto = {
    title: "",
    bannerImage: "",
    productIds: []
  }
  const [form, setForm] = useState<CreateProductSectionPageDto>(initialForm)

  // ────────────────────────────────
  // FETCH DATA
  // ────────────────────────────────
  useEffect(() => {
    fetchSectionPages()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (message || errorMessage) {
      const timeout = setTimeout(() => {
        setMessage("")
        setErrorMessage("")
      }, 4000)
      return () => clearTimeout(timeout)
    }
  }, [message, errorMessage])

  useEffect(() => {
    // ✅ close dropdown when clicking outside
    const handleClickOutside = () => setSelectedAction(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const fetchSectionPages = async () => {
    try {
      const data = await getAllProductSectionPages()
      setSectionPages(data)
    } catch (err) {
      console.error("Error fetching section pages:", err)
      setErrorMessage("Failed to load section pages.")
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
  // HELPERS
  // ────────────────────────────────
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
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

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image must be under 10MB.")
      return
    }

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = event => {
      const base64 = event.target?.result as string
      setForm(prev => ({ ...prev, bannerImage: base64 }))
      setImagePreview(base64)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setForm(prev => ({ ...prev, bannerImage: "" }))
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ✅ Uses add/remove API for product management
  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setErrorMessage("Title is required")
      return
    }

    try {
      if (editingId) {
        // ✅ 1. Update title & banner only
        await updateProductSectionPage(editingId, {
          title: form.title,
          bannerImage: form.bannerImage
        } as UpdateProductSectionPageDto)

        // ✅ 2. Find changes in products
        const existingIds = originalProducts.map(p => p.id)
        const newIds = selectedProducts.map(p => p.id)

        // ➕ Add new products
        for (const id of newIds) {
          if (!existingIds.includes(id)) {
            await addProductToSectionPage(editingId, id)
          }
        }

        // ➖ Remove products
        for (const id of existingIds) {
          if (!newIds.includes(id)) {
            await removeProductFromSectionPage(editingId, id)
          }
        }

        setMessage("Section Page updated successfully.")
      } else {
        // ✅ Create section first
        const created = await createProductSectionPage({
          title: form.title,
          bannerImage: form.bannerImage,
          productIds: []
        })

        // ✅ Add all selected products using the addProduct API
        for (const prod of selectedProducts) {
          await addProductToSectionPage(created.id, prod.id)
        }

        setMessage("Section Page created successfully.")
      }

      resetModal()
      fetchSectionPages()
    } catch (err) {
      console.error("Error saving section page:", err)
      setErrorMessage("Failed to save section page.")
    }
  }

  const resetModal = () => {
    setForm(initialForm)
    setSelectedProducts([])
    setOriginalProducts([])
    setEditingId(null)
    setIsModalOpen(false)
    setImagePreview("")
    setIsUploading(false)
    setProductSearch("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleEdit = (section: ProductSectionPageDto) => {
    setForm({
      title: section.title || "",
      bannerImage: section.banner_image || "",
      productIds: section.products?.map(p => p.id) || []
    })
    setSelectedProducts(section.products || [])
    setOriginalProducts(section.products || []) // ✅ Track original for comparison
    setImagePreview(section.banner_image || "")
    setEditingId(section.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this section page?")) {
      try {
        await deleteProductSectionPage(id)
        setMessage("Section Page deleted successfully.")
        fetchSectionPages()
      } catch (err) {
        console.error("Delete failed:", err)
        setErrorMessage("Failed to delete section page.")
      }
    }
  }

  const handleProductSelect = (product: ProductDto) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(prev => [...prev, product])
    }
    setProductSearch("")
    setIsProductDropdownOpen(false)
  }

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id))
  }

  // ────────────────────────────────
  // FILTER + PAGINATION
  // ────────────────────────────────
  const filtered = sectionPages.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  )
  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedSections = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // ────────────────────────────────
  // RENDER
  // ────────────────────────────────
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      {/* 🔍 Search + Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search section pages..."
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Section Page
        </button>
      </div>

      {/* ✅ Notifications */}
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

      {/* 📄 Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Banner</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Created At</th>
              <th className="px-4 py-3 font-medium">Updated At</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSections.length > 0 ? (
              paginatedSections.map(section => (
                <tr key={section.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{truncateText(section.title)}</td>
                  <td className="px-4 py-3">
                    {section.banner_image ? (
                      <img
                        src={section.banner_image}
                        alt={section.title}
                        className="w-[50px] h-[50px] rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Banner</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {section.products && section.products.length > 0
                      ? truncateText(
                          section.products.map(p => p.product_name).join(", "),
                          40
                        )
                      : "No Products"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {dayjs(section.created_at).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {dayjs(section.updated_at).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        const rect = e.currentTarget.getBoundingClientRect()
                        setDropdownPos({
                          x: rect.right - 150,
                          y: rect.bottom + window.scrollY + 4
                        })
                        setSelectedAction(section.id)
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <EllipsisVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* ✅ Dropdown Menu */}
                    {selectedAction === section.id && (
                      <div
                        style={{ top: dropdownPos.y, left: dropdownPos.x }}
                        className="absolute z-50 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            handleEdit(section)
                            setSelectedAction(null)
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(section.id)
                            setSelectedAction(null)
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No section pages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? "Edit Section Page" : "Create Section Page"}
                </h2>
                <button
                  onClick={resetModal}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Enter section page title"
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Banner Upload */}
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
                  Upload Banner
                </button>
              </div>

              {/* Product Multi-Select */}
              <div className="mb-4 relative">
                {" "}
                {/* ✅ Added relative to parent for proper positioning */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Products
                </label>
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
                    className="absolute z-50 w-full min-w-[350px] bg-white border rounded-lg shadow-xl max-h-72 overflow-auto mt-1"
                  >
                    {products
                      .filter(prod =>
                        prod.product_name
                          .toLowerCase()
                          .includes(productSearch.toLowerCase())
                      )
                      .slice(0, 8) // ✅ show up to 8 products for scrollable dropdown
                      .map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => handleProductSelect(prod)}
                          className="px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center gap-3 border-b last:border-b-0"
                        >
                          {/* ✅ Product image */}
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.product_name}
                              className="w-10 h-10 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                              No Img
                            </div>
                          )}

                          {/* ✅ Product name truncated */}
                          <span className="flex-1 truncate">
                            {prod.product_name}
                          </span>
                        </div>
                      ))}

                    {/* ✅ No products found message */}
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

              {/* Selected Products */}
              {selectedProducts.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Products:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProducts.map(prod => (
                      <div
                        key={prod.id}
                        className="flex items-center gap-2 border px-2 py-1 rounded-md bg-gray-50"
                      >
                        {/* ✅ Product Image */}
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.product_name}
                            className="w-8 h-8 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}

                        {/* ✅ Product Name */}
                        <span className="text-sm truncate max-w-[120px]">
                          {prod.product_name}
                        </span>

                        {/* ✅ Remove Button */}
                        <button
                          onClick={() => handleRemoveProduct(prod.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  {editingId ? "Update Section" : "Create Section"}
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

        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <span className="text-xs text-gray-500">
            {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>

          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-100"
          >
            ←
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            const pageNum =
              Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
