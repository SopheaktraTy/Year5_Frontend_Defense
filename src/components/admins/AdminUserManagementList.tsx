import React, { useEffect, useState } from "react"
import {
  getAllUsers,
  toggleUserSuspension,
  toggleUserRole,
  deleteUser
} from "../../services/authService"
import { User } from "../../types/authType"
import ReactDOM from "react-dom"
import {
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  UserX,
  UserCheck,
  UserCog,
  Trash2,
  EllipsisVertical
} from "lucide-react"
import { jwtDecode } from "jwt-decode"

const ADMIN_ID = "dfc7b04c-d0d1-412f-bbf8-77074a4fb719"

const getCurrentUserId = () => {
  const token = localStorage.getItem("accessToken")
  if (!token) return null
  try {
    const decoded: any = jwtDecode(token)
    return decoded.sub || decoded.id
  } catch {
    return null
  }
}

const UserManagementList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{
    top: number
    left: number
  } | null>(null)

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
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers()
        setUsers(res)
        setFilteredUsers(res)
      } catch (err) {
        setError("Failed to load users")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        user =>
          `${user.firstname} ${user.lastname}`
            .toLowerCase()
            .includes(lowerTerm) || user.email.toLowerCase().includes(lowerTerm)
      )
    }

    switch (filterType) {
      case "suspended":
        filtered = filtered.filter(user => user.status === "suspended")
        break
      case "not_verified":
        filtered = filtered.filter(user => user.status === "not_verified")
        break
      case "admin":
        filtered = filtered.filter(user => user.role?.name === "admin")
        break
      case "customer":
        filtered = filtered.filter(user => user.role?.name === "customer")
        break
      default:
        break
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, filterType, users])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // If click is outside dropdown AND outside ellipsis button → close
      if (!target.closest(".dropdown-trigger")) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleToggleSuspend = async (userId: string) => {
    const currentUserId = getCurrentUserId()
    if (!userId) return setErrorMessage("User ID is missing.")
    if (userId === currentUserId)
      return setErrorMessage("You cannot change your own status.")

    setMessage("")
    setErrorMessage("")
    try {
      const res = await toggleUserSuspension(userId)
      const updatedStatus = res.user?.status
      const updated = users.map(user =>
        user.id === userId ? { ...user, status: updatedStatus } : user
      )
      setUsers(updated)
      setMessage(res.message || "User status updated successfully.")
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || "Failed to update user status."
      setErrorMessage(errMsg)
    }
  }

  const handleToggleRole = async (userId: string) => {
    const currentUserId = getCurrentUserId()
    if (!userId) return setErrorMessage("User ID is missing.")
    if (userId === currentUserId)
      return setErrorMessage("You cannot change your own role.")

    setLoading(true)
    setMessage("")
    setErrorMessage("")
    try {
      const res = await toggleUserRole(userId)
      setMessage(res.message || "User role updated.")
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              role: {
                ...user.role,
                id: res.newRoleId,
                name: res.newRoleId === ADMIN_ID ? "admin" : "customer"
              }
            }
          }
          return user
        })
      )
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to update role."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const currentUserId = getCurrentUserId()
    if (!userId) return setErrorMessage("User ID is missing.")
    if (userId === currentUserId)
      return setErrorMessage(" You cannot delete your own account.")

    if (!window.confirm("Are you sure you want to delete this user?")) return
    setLoading(true)
    setMessage("")
    setErrorMessage("")
    try {
      const res = await deleteUser(userId)
      setMessage(
        `🗑️ <strong>${
          res.email || res.userId
        }</strong> has been <span class="text-red-600 font-semibold">deleted</span> successfully.`
      )
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to delete user."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="admin">Admin Role</option>
          <option value="customer">Customer Role</option>
          <option value="suspended">Suspended Users</option>
          <option value="not_verified">Not Verified</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 ">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={user.image || "/placeholder.jpg"}
                          alt={user.firstname || "User"}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstname} {user.lastname}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {user.role?.name || "-"}
                      </td>
                      <td className="px-4 py-3 capitalize">{user.status}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(user.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(user.updated_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-center relative">
                        <div className="inline-block text-left relative dropdown-container">
                          {/* Trigger Button */}
                          <button
                            type="button"
                            onClick={e => {
                              const rect =
                                e.currentTarget.getBoundingClientRect()
                              setOpenDropdown(
                                openDropdown === user.id ? null : user.id
                              )
                              setDropdownPos({
                                top: rect.bottom + window.scrollY,
                                left: rect.right - 176
                              }) // 176px = dropdown width
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none dropdown-trigger"
                          >
                            <EllipsisVertical className="w-5 h-5 text-gray-600" />
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdown === user.id &&
                            dropdownPos &&
                            ReactDOM.createPortal(
                              <div
                                className="absolute w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] dropdown-trigger"
                                style={{
                                  top: dropdownPos.top,
                                  left: dropdownPos.left,
                                  position: "absolute"
                                }}
                              >
                                <button
                                  onClick={() => {
                                    handleToggleRole(user.id)
                                    setOpenDropdown(null)
                                  }}
                                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <UserCog className="w-4 h-4 mr-2 text-blue-600" />
                                  Toggle Role
                                </button>

                                <button
                                  onClick={() => {
                                    handleToggleSuspend(user.id)
                                    setOpenDropdown(null)
                                  }}
                                  className={`w-full flex items-center px-4 py-2 text-sm ${
                                    user.status === "suspended"
                                      ? "text-green-700 hover:bg-green-50"
                                      : "text-red-700 hover:bg-red-50"
                                  }`}
                                >
                                  {user.status === "suspended" ? (
                                    <UserCheck className="w-4 h-4 mr-2" />
                                  ) : (
                                    <UserX className="w-4 h-4 mr-2" />
                                  )}
                                  {user.status === "suspended"
                                    ? "Activate User"
                                    : "Suspend User"}
                                </button>

                                <button
                                  onClick={() => {
                                    handleDeleteUser(user.id)
                                    setOpenDropdown(null)
                                  }}
                                  className="w-full flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </button>
                              </div>,
                              document.body
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-300" />
                        <p>No user found.</p>
                        {searchTerm && (
                          <p className="text-sm">
                            Try adjusting your search terms.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
                <p className="text-sm font-medium text-red-800">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="border rounded px-2 py-1"
              >
                {[5, 8, 10, 20].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span>per page</span>
            </div>

            <div className="flex items-center gap-1 mt-3 sm:mt-0">
              <span className="mr-2">
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems}
              </span>

              <button
                className="px-2 py-1 disabled:text-gray-400"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                ←
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-2 py-1 rounded ${
                    currentPage === index + 1 ? "bg-gray-200 font-semibold" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="px-2 py-1 disabled:text-gray-400"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UserManagementList
