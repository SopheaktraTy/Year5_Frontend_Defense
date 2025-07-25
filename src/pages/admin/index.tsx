import React from "react"
import AdminLayout from "@components/admins/AdminLayout"
import { protectRoute } from "../../utils/protectRoute"
import { useEffect } from "react"
import AdminDashboard from "@components/admins/AdminDashboard"

const AdminCategoriesManagementPage = () => {
  useEffect(() => {
    protectRoute({ requiredRole: "admin", redirectTo: "/forbidden-access" })
  }, [])

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold ">Dashbroad</h1>
        <p className="text-xs font-semibold mb-4 text-gray-500">
          Manage all Categories in one place
        </p>
        <AdminDashboard />
      </div>
    </AdminLayout>
  )
}

export default AdminCategoriesManagementPage
