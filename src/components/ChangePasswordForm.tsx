import React, { useState } from "react"
import { changePassword } from "../services/authService"
import { ChangePasswordDto } from "../types/authType"
import {
  LoaderCircle,
  CheckCircle,
  XCircle,
  Save,
  Eye,
  EyeOff
} from "lucide-react"

const ChangePasswordForm = () => {
  const [form, setForm] = useState<ChangePasswordDto>({
    oldpassword: "",
    newpassword: ""
  })

  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)

  const togglePasswordVisibility = () => setShowPasswords(prev => !prev)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    // Validation
    if (!form.oldpassword || !form.newpassword || !confirmPassword) {
      setError("All fields are required.")
      return
    }
    if (form.newpassword.length < 6) {
      setError("New password must be at least 6 characters long.")
      return
    }
    if (!/\d/.test(form.newpassword) || !/[A-Za-z]/.test(form.newpassword)) {
      setError("New password must contain at least one letter and one number.")
      return
    }
    if (form.newpassword !== confirmPassword) {
      setError("New password and confirm password do not match.")
      return
    }

    try {
      setLoading(true)

      // map lower-case keys → backend's camelCase keys
      const payload = {
        oldpassword: form.oldpassword,
        newpassword: form.newpassword
      }

      const result = await changePassword(payload) // ✅ send mapped payload
      setMessage(result.message || "Password changed successfully.")
      setForm({ oldpassword: "", newpassword: "" })
      setConfirmPassword("")
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err.message || "Password change failed."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-screen mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Change Password
      </h2>
      {/* Seperator */}
      <div className=" border-t border-gray-200 pb-7"></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Old Password
          </label>
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              name="oldpassword"
              value={form.oldpassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPasswords ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type={showPasswords ? "text" : "password"}
            name="newpassword"
            value={form.newpassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type={showPasswords ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Re-enter new password"
          />
        </div>
        {/* Success Message */}
        {message && (
          <div className="mt-4 rounded-md bg-green-50 p-4 border border-green-200">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
              <p className="text-sm font-medium text-green-800">{message}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loading ? "Saving..." : "Change Password"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChangePasswordForm
