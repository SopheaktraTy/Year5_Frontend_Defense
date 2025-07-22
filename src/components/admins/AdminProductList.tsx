"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  createProductVariable,
  updateProductVariable,
  deleteProductVariable
} from "../../services/productService"
import {
  UpdateProductDto,
  CreateProductVariableDto,
  EditableProductVariableDto
} from "../../types/productType"
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Upload,
  X,
  Eye
} from "lucide-react"
import Image from "next/image"
import dayjs from "dayjs"
import { getAllCategories } from "../../services/categoryService"

export default function AdminProductList() {
  const [categories, setCategories] = useState<any[]>([])
  const [categorySearch, setCategorySearch] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isUploading, setIsUploading] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const imageModalRef = useRef<HTMLDivElement>(null)
  const originalVariablesRef = useRef<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])

  const initialForm: UpdateProductDto = {
    productName: "",
    originalPrice: 0,
    image: "",
    description: "",
    discountPercentageTag: 0,
    categoryId: "",
    productVariables: []
  }

  const [form, setForm] = useState<UpdateProductDto>(initialForm)

  const totalItems = products.filter(p =>
    p.product_name?.toLowerCase().includes(search.toLowerCase())
  ).length

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const filtered = products.filter(p =>
    p.product_name?.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    getAllCategories()
      .then(data => setCategories(data.slice(0, 5)))
      .catch(err => console.error("Failed to fetch categories:", err))
  }, [])

  useEffect(() => {
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
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        imageModalRef.current &&
        !imageModalRef.current.contains(e.target as Node)
      ) {
        setShowImageModal(false)
      }
    }

    if (showImageModal) {
      document.addEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [showImageModal])

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts()
      setAllProducts(data) // ← ADD THIS LINE
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setErrorMessage("Failed to load products.")
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setForm(prev => ({ ...prev, categoryId }))
    setCategorySearch(categoryName)
    setIsDropdownOpen(false)
  }

  // FIXED: Single unified handler for all form inputs including textarea
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    console.log("handleInputChange called:", {
      name,
      value,
      elementType: e.target.tagName
    })

    // Special handling for numeric fields
    if (name === "originalPrice" || name === "discountPercentageTag") {
      setForm(prev => ({
        ...prev,
        [name]: Number(value) || 0
      }))
    } else {
      // Handle all other fields including description
      setForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name, file.type, file.size)

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Please select a valid image file (PNG, JPG, JPEG, GIF, WebP)."
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be under 5MB.")
      return
    }

    setIsUploading(true)
    setErrorMessage("")

    const reader = new FileReader()

    reader.onload = event => {
      try {
        const base64 = event.target?.result as string
        console.log(
          "Base64 conversion successful:",
          base64.substring(0, 50) + "..."
        )

        if (!base64 || !base64.startsWith("data:image")) {
          throw new Error("Invalid base64 format")
        }

        setForm(prev => ({ ...prev, image: base64 }))
        setImagePreview(base64)
        setMessage("Image uploaded successfully!")
      } catch (error) {
        console.error("Error processing image:", error)
        setErrorMessage("Error processing image. Please try again.")
      } finally {
        setIsUploading(false)
      }
    }

    reader.onerror = error => {
      console.error("FileReader error:", error)
      setErrorMessage("Error reading file. Please try again.")
      setIsUploading(false)
    }

    reader.readAsDataURL(file)
  }

  // Fixed: Handle product variables CRUD operations
  const handleVariablesCRUD = async (
    productId: string,
    currentVariables: any[],
    newVariables: any[]
  ) => {
    try {
      // Delete removed variables
      const currentIds = new Set(
        currentVariables.map(v => v.id).filter(Boolean)
      )
      const newIds = new Set(newVariables.map(v => v.id).filter(Boolean))

      for (const currentVar of currentVariables) {
        if (currentVar.id && !newIds.has(currentVar.id)) {
          await deleteProductVariable(currentVar.id)
          console.log(`Deleted variable ${currentVar.id}`)
        }
      }

      // Update existing and create new variables
      for (const newVar of newVariables) {
        if (newVar.id && currentIds.has(newVar.id)) {
          // Update existing variable
          const updateData: EditableProductVariableDto = {
            size: newVar.size,
            quantity: newVar.quantity
          }
          await updateProductVariable(newVar.id, updateData)
          console.log(`Updated variable ${newVar.id}`)
        } else if (!newVar.id && newVar.size && newVar.quantity > 0) {
          // Create new variable
          const createData: CreateProductVariableDto = {
            size: newVar.size,
            quantity: newVar.quantity
          }
          await createProductVariable(productId, createData)
          console.log(`Created new variable for product ${productId}`)
        }
      }
    } catch (error) {
      console.error("Error handling product variables:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!form.productName.trim()) {
      setErrorMessage("Product name is required")
      return
    }

    if (!form.originalPrice || form.originalPrice <= 0) {
      setErrorMessage("Original price must be greater than 0")
      return
    }

    // Prepare cleaned image if it exists
    let cleanedImage = ""
    if (
      form.image &&
      (form.image.startsWith("data:image") || form.image.startsWith("http"))
    ) {
      cleanedImage = form.image
    }

    console.log("Product Payload:", {
      ...form,
      description: form.description
    })

    const productPayload = {
      productName: form.productName,
      originalPrice: form.originalPrice,
      discountPercentageTag: form.discountPercentageTag,
      categoryId: form.categoryId,
      description: form.description ?? "", // Fixed: Ensure description is properly included
      image: cleanedImage
    }

    try {
      if (editingId) {
        // Update existing product
        await updateProduct(editingId, productPayload)

        // Handle product variables CRUD operations
        await handleVariablesCRUD(
          editingId,
          originalVariablesRef.current,
          form.productVariables
        )

        setMessage("Product updated successfully.")
      } else {
        // Create new product
        const newProduct = await createProduct({
          ...productPayload,
          productVariables: []
        })
        const productId = newProduct.id

        // Create product variables for new product
        if (form.productVariables.length > 0 && productId) {
          for (const variable of form.productVariables) {
            if (variable.size && variable.quantity > 0) {
              const createData: CreateProductVariableDto = {
                size: variable.size,
                quantity: variable.quantity
              }
              await createProductVariable(productId, createData)
            }
          }
        }

        setMessage("Product created successfully.")
      }

      resetModal()
      fetchProducts()
    } catch (err) {
      console.error("Error saving product:", err)
      setErrorMessage("Failed to save product. Please try again.")
    }
  }

  const resetModal = () => {
    setForm(initialForm)
    setEditingId(null)
    setIsModalOpen(false)
    setImagePreview("")
    setIsUploading(false)
    setCategorySearch("") // Reset category search
    originalVariablesRef.current = []
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleEdit = (product: any) => {
    originalVariablesRef.current = product.product_variables || []

    setForm({
      productName: product.product_name || "",
      originalPrice: product.original_price || 0,
      image: product.image || "",
      description: product.description || "", // Fixed: Ensure description is properly set
      discountPercentageTag: product.discount_percentage_tag || 0,
      categoryId: product.category?.id || "",
      productVariables: (product.product_variables || []).map((v: any) => ({
        id: v.id,
        size: v.size,
        quantity: v.quantity
      }))
    })

    // Set category search display name
    if (product.category?.name) {
      setCategorySearch(product.category.name)
    }

    const imageUrl = product.image
    setImagePreview(
      imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("data:"))
        ? imageUrl
        : ""
    )

    setEditingId(product.id)
    setIsModalOpen(true)
  }

  // Fixed: Product variables management functions
  const handleAddVariable = () => {
    setForm(prev => ({
      ...prev,
      productVariables: [...prev.productVariables, { size: "", quantity: 0 }]
    }))
  }

  const handleRemoveVariable = (index: number) => {
    setForm(prev => ({
      ...prev,
      productVariables: prev.productVariables.filter((_, i) => i !== index)
    }))
  }

  const handleVariableChange = (
    index: number,
    field: "size" | "quantity",
    value: string | number
  ) => {
    const updated = [...form.productVariables]
    updated[index] = {
      ...updated[index],
      [field]: field === "quantity" ? Number(value) || 0 : value
    }
    setForm(prev => ({ ...prev, productVariables: updated }))
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        setMessage("Product deleted successfully.")
        fetchProducts()
      } catch (err) {
        console.error("Delete failed:", err)
        setErrorMessage("Failed to delete product.")
      }
    }
  }

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: "" }))
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const viewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const truncateDescription = (text: string, maxLength: number = 40) => {
    if (!text || text.trim() === "") return "No description"
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const truncateProductName = (text: string, maxLength: number = 30) => {
    if (!text || text.trim() === "") return "Unnamed Product"
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const hasValidImage = (imageUrl: string) => {
    return (
      imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("data:"))
    )
  }

  const ProductImage = ({ src, alt, className, ...props }: any) => {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)

    if (!hasValidImage(src) || imageError) {
      return (
        <div
          className={`${className} bg-gray-200 flex items-center justify-center`}
        >
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )
    }

    if (src.startsWith("data:")) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageError(true)}
          {...props}
        />
      )
    }

    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setImageLoading(false)}
        onError={() => setImageError(true)}
        {...props}
      />
    )
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-rol gap-2">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              id="sort"
              onChange={e => {
                const filter = e.target.value
                let sorted = [...allProducts] // Use full product list for consistent filtering
                switch (filter) {
                  case "noCategory":
                    sorted = allProducts.filter(
                      p => !p.category || !p.category.category_name
                    )
                    break
                  case "quantityZero":
                    sorted = allProducts.filter(p => p.total_quantity === 0)
                    break
                  case "quantityThree":
                    sorted = allProducts.filter(p => p.total_quantity === 3)
                    break
                  case "noDiscount":
                    sorted = allProducts.filter(
                      p =>
                        !p.discount_percentage_tag ||
                        p.discount_percentage_tag === 0
                    )
                    break
                  case "hasDiscount":
                    sorted = allProducts.filter(
                      p => p.discount_percentage_tag > 0
                    )
                    break
                  default:
                    sorted = [...allProducts] // Restore original unfiltered list
                }
                setCurrentPage(1)
                setProducts(sorted)
              }}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="">Default</option>
              <option value="noCategory">No Category</option>
              <option value="quantityZero">Total Quantity = 0</option>
              <option value="quantityThree">Total Quantity = 3</option>
              <option value="noDiscount">No Discount</option>
              <option value="hasDiscount">Has Discount</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Product
          </button>
        </div>
      </div>
      {/* Notication Message */}
      {message && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Discounted Price</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Total Quantity</th>{" "}
              {/* New Column */}
              <th className="px-4 py-3 font-medium">Category Name</th>{" "}
              {/* New Column */}
              <th className="px-4 py-3 font-medium">Created At</th>
              <th className="px-4 py-3 font-medium">Updated At</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {truncateProductName(product.product_name)}{" "}
                    {/* Truncated Name */}
                  </td>
                  <td className="px-4 py-3">
                    <ProductImage
                      src={product.image || "/placeholder.jpg"}
                      alt={product.product_name || "Product"}
                      className="w-[50px] h-[50px] rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-3">
                    ${product.original_price?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-3">
                    {product.discount_percentage_tag || 0}%
                  </td>
                  <td className="px-4 py-3">
                    $
                    {(
                      product.discounted_price ||
                      product.original_price ||
                      0
                    ).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {truncateDescription(product.description)}{" "}
                    {/* Truncated Description */}
                  </td>
                  <td className="px-4 py-3">{product.total_quantity || 0}</td>{" "}
                  {/* Display total_quantity */}
                  <td className="px-4 py-3">
                    {product.category?.category_name || "No category"}
                  </td>{" "}
                  {/* Display category_name */}
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {product.created_at
                      ? dayjs(product.created_at).format("MMM DD, YYYY")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {product.updated_at
                      ? dayjs(product.updated_at).format("MMM DD, YYYY")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-500">
                  No products found.
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
                  {editingId ? "Edit Product" : "Create Product"}
                </h2>
                <button
                  onClick={resetModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={e => {
                      setCategorySearch(e.target.value)
                      setIsDropdownOpen(true) // Open the dropdown when typing
                    }}
                    onFocus={() => setIsDropdownOpen(true)} // Open the dropdown on input focus
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  {isDropdownOpen && categorySearch && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                    >
                      {categories
                        .filter(cat =>
                          cat.category_name
                            .toLowerCase()
                            .includes(categorySearch.toLowerCase())
                        )
                        .slice(0, 5)
                        .map(cat => (
                          <div
                            key={cat.id}
                            onClick={() =>
                              handleCategorySelect(cat.id, cat.category_name)
                            }
                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                {cat.category_name}
                              </span>
                              {cat.image && (
                                <img
                                  src={cat.image}
                                  alt="Category"
                                  className="w-12 h-12 object-cover rounded border border-gray-200"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      {categories.filter(cat =>
                        cat.category_name
                          .toLowerCase()
                          .includes(categorySearch.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No categories found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <select
                  value={categorySearch}
                  onChange={e => setCategorySearch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ display: "none" }} // Hidden select, used as fallback
                >
                  <option value="">-- Select a Category --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.category_name}>
                      {cat.category_name} (Total: {cat.total_quantity || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    name="productName"
                    value={form.productName}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 "
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price *
                    </label>
                    <input
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.originalPrice || ""}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 "
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage
                    </label>
                    <input
                      name="discountPercentageTag"
                      type="number"
                      min="0"
                      max="100"
                      value={form.discountPercentageTag || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 "
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description || ""} // Ensure it's bound to form.description
                    onChange={handleInputChange} // Use the handler to update description
                    placeholder="Enter product description (optional)"
                    rows={5}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />

                  <p className="text-sm text-gray-500 mt-1">
                    Current length: {form.description?.length || 0} characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>

                  {imagePreview && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Preview
                      </p>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onLoad={() =>
                            console.log("Preview image loaded successfully")
                          }
                          onError={e => {
                            console.error("Preview image failed to load:", e)
                            setErrorMessage("Failed to load image preview")
                          }}
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="gap-4">
                    <div>
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
                        disabled={isUploading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload size={20} />
                        {isUploading ? "Processing..." : "Upload Image"}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Upload an image file (PNG, JPG, JPEG, GIF, WebP - max 5MB)
                  </p>

                  {isUploading && (
                    <div className="mt-2 text-sm text-blue-600">
                      Processing image... Please wait.
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Variables
                    </label>
                    <button
                      type="button"
                      onClick={handleAddVariable}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      + Add Variable
                    </button>
                  </div>

                  {form.productVariables.length === 0 && (
                    <p className="text-sm text-gray-500 mb-2">
                      No product variables added.
                    </p>
                  )}

                  {form.productVariables.map((variable, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 mb-2 items-center"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Size"
                          value={variable.size}
                          onChange={e =>
                            handleVariableChange(index, "size", e.target.value)
                          }
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="number"
                          min={0}
                          placeholder="Quantity"
                          value={variable.quantity}
                          onChange={e =>
                            handleVariableChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(index)}
                          className="text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notication Message */}
                {message && (
                  <div className="rounded-md bg-green-50 p-4 border border-green-200">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm font-medium text-green-800">
                        {message}
                      </p>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm font-medium text-red-800">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={resetModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading
                      ? "Processing..."
                      : editingId
                      ? "Update Product"
                      : "Create Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image View Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div
            ref={imageModalRef}
            className="relative max-w-4xl max-h-[90vh] w-full"
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Product"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              onError={e => {
                console.error("Full image failed to load:", e)
                setErrorMessage("Failed to load full image")
              }}
            />
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
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {[5, 8, 10, 20].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="whitespace-nowrap">per page</span>
        </div>

        <div className="flex items-center gap-2 mt-4 sm:mt-0">
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

          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            const pageNum =
              Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index
            return (
              <button
                key={pageNum}
                aria-label={`Page ${pageNum}`}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                } transition-colors`}
              >
                {pageNum}
              </button>
            )
          })}

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
