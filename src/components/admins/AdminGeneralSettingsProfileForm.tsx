import React, { useEffect, useState, useRef } from "react"
import { getProfile, updateProfile } from "../../services/authService"
import { UpdateProfileDto } from "../../types/authType"
import {
  LoaderCircle,
  CheckCircle,
  XCircle,
  Upload,
  ChevronDown
} from "lucide-react"

const AdminGeneralSettingsProfile = () => {
  const [form, setForm] = useState<UpdateProfileDto>({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile()
        setForm(profile)
        if (profile.image) {
          setImagePreview(profile.image)
        }
      } catch (err) {
        console.error("Failed to load profile:", err)
        setError("Failed to load profile")
      } finally {
        setFetching(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setUploadingImage(true)
    setError("")

    const reader = new FileReader()
    reader.onload = event => {
      const base64String = event.target?.result as string
      setImagePreview(base64String)
      setForm(prev => ({ ...prev, image: base64String }))
      setUploadingImage(false)
    }
    reader.onerror = () => {
      setError("Failed to read image file")
      setUploadingImage(false)
    }
    reader.readAsDataURL(file)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const disallowedKeys = [
        "id",
        "email",
        "is_verified",
        "created_at",
        "updated_at",
        "role_id",
        "status"
      ]

      const cleanForm: Record<string, any> = Object.fromEntries(
        Object.entries(form).filter(
          ([key, value]) =>
            !disallowedKeys.includes(key) && value !== undefined && value !== ""
        )
      )

      if (cleanForm.phone_number) {
        const num = Number(cleanForm.phone_number)
        if (isNaN(num)) throw new Error("Phone number must be a number")
        cleanForm.phone_number = num
      }

      const result = await updateProfile(cleanForm)
      setMessage(result.message || "Profile updated successfully!")
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Update failed."
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3 text-gray-600">
          <LoaderCircle className="animate-spin h-6 w-6" />
          <span className="text-lg">Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className=" mx-auto  px-6 py-5 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">
        General Settings
      </h1>
      {/* Seperator */}
      <div className=" border-t border-gray-200 pb-4"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo
            </label>
            <p className="text-xs text-gray-500">150×150px JPEG, PNG image</p>
          </div>
          <div className="relative">
            <img
              src={imagePreview || "/api/placeholder/80/80"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            <label
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleImageClick}
            >
              {uploadingImage ? (
                <LoaderCircle className="animate-spin w-5 h-5 text-white" />
              ) : (
                <Upload className="w-5 h-5 text-white" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            value={form.firstname || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={form.lastname || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_number"
            value={form.phone_number || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone number"
          />
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={form.email || ""}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="relative">
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
              <p className="text-sm font-medium text-green-800">{message}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminGeneralSettingsProfile
