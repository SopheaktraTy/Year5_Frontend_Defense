import React from "react"
import AdminLayout from "@components/admins/AdminLayout"
import { protectRoute } from "../../utils/protectRoute"
import { useEffect } from "react"
import AdminProductList from "@components/admins/AdminProductList"

const AdminProductManagementPage = () => {
  useEffect(() => {
    protectRoute({ requiredRole: "admin", redirectTo: "/forbidden-access" })
  }, [])

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold ">Product Management</h1>
        <p className="text-xs font-semibold mb-4 text-gray-500">
          Manage all Product in one place
        </p>
        <AdminProductList />
      </div>
    </AdminLayout>
  )
}

export default AdminProductManagementPage
