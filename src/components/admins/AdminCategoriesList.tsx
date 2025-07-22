'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/categoryService';
import { CreateCategoryDto, UpdateCategoryDto } from '../../types/categoryType';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Search, Upload, X, Eye } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';

const initialForm: CreateCategoryDto = {
  categoryName: '',
  description: '',
  image: '',
};

export default function CategoriesList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<CreateCategoryDto>(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageModalRef = useRef<HTMLDivElement>(null);

  const totalItems = categories.filter(cat =>
    cat.category_name?.toLowerCase().includes(search.toLowerCase())
  ).length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filtered = categories.filter(cat =>
    cat.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCategories = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  useEffect(() => {
    fetchCategories();
  }, []);

  

  useEffect(() => {
    if (message || errorMessage) {
      const timeout = setTimeout(() => {
        setMessage('');
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [message, errorMessage]);

  useEffect(() => {
  const handleOutsideClick = (e: MouseEvent) => {
    if (imageModalRef.current && !imageModalRef.current.contains(e.target as Node)) {
      setShowImageModal(false);
    }
  };

  if (showImageModal) {
    document.addEventListener('mousedown', handleOutsideClick);
  }

  return () => {
    document.removeEventListener('mousedown', handleOutsideClick);
  };
}, [showImageModal]);


  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setErrorMessage('Failed to load categories.');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be under 5MB.');
      return;
    }
    
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };



  const handleSubmit = async () => {
    if (!form.categoryName.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      const cleanedImage =
        form.image && (form.image.startsWith('http') || form.image.startsWith('data:'))
          ? form.image
          : '';

      const payload = { ...form, image: cleanedImage };

      if (editingId) {
        await updateCategory(editingId, payload as UpdateCategoryDto);
        setMessage('Category updated successfully.');
      } else {
        await createCategory(payload);
        setMessage('Category created successfully.');
      }

      resetModal();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setErrorMessage('Failed to save category.');
    }
  };

  const resetModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setIsModalOpen(false);
    setImagePreview('');
    setIsUploading(false);
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (category: any) => {
    setForm({
      categoryName: category.category_name,
      description: category.description,
      image: category.image || '',
    });
    
    // Set image preview for editing
    const imageUrl = category.image;
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:'))) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview('');
    }
    
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setMessage('Category deleted successfully.');
        fetchCategories();
      } catch (err) {
        console.error('Delete failed:', err);
        setErrorMessage('Failed to delete category.');
      }
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: '' }));
    setImagePreview('');
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const viewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const hasValidImage = (imageUrl: string) => {
    return imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:'));
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </button>
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
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Created At</th>
              <th className="px-4 py-3 font-medium">Updated At</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map(category => (
                <tr key={category.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {category.category_name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative w-[50px] h-[50px]">
                        <Image
                          src={hasValidImage(category.image) ? category.image : '/placeholder.jpg'}
                          alt={category.category_name || 'Category'}
                          fill
                          className="rounded-lg object-cover border border-gray-200"
                        />
                        {hasValidImage(category.image) && (
                          <button
                            onClick={() => viewImage(category.image)}
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                            title="View full image"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                  </td>
                  <td className="px-4 py-3">
                    <div 
                      className="text-gray-700 max-w-xs"
                      title={category.description || 'No description'}
                    >
                      {truncateText(category.description)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {dayjs(category.created_at).format('MMM DD, YYYY')}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {dayjs(category.updated_at).format('MMM DD, YYYY')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                        title="Edit Category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-gray-300" />
                    <p>No categories found.</p>
                    {search && (
                      <p className="text-sm">Try adjusting your search terms.</p>
                    )}
                  </div>
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
                  {editingId ? 'Edit Category' : 'Create Category'}
                </h2>
                <button
                  onClick={resetModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    name="categoryName"
                    value={form.categoryName}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Enter description (optional)"
                    rows={5}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition transition-colors resize-vertical"
                  />
                   <p className="text-sm text-gray-500 mt-1">
                    Current length: {form.description?.length || 0} characters
                  </p>
                </div>
               

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Preview</p>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

                  {/* Upload Options */}
                  <div className="gap-4">
                    {/* File Upload */}
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
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                    </div>
                  </div>

                  {/* Helper Text */}
                  <p className="text-sm text-gray-500 mt-2">
                    Upload an image file (max 5MB) or provide an image URL
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={resetModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingId ? 'Update Category' : 'Create Category'}
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
              alt="Category"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}


      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700">
        {/* Items per page */}
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="whitespace-nowrap">
            Show
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {[5, 8, 10, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="whitespace-nowrap">per page</span>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <span className="text-xs text-gray-500">
            {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>

          <button
            aria-label="Previous Page"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-100 transition-colors"
          >
            ←
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
            return (
              <button
                key={pageNum}
                aria-label={`Page ${pageNum}`}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 hover:bg-gray-100'
                } transition-colors`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            aria-label="Next Page"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-100 transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}


