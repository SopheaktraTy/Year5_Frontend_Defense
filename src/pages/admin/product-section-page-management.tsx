import React from "react"
import AdminLayout from "@components/admins/AdminLayout"
import { protectRoute } from "../../utils/protectRoute"
import { useEffect } from "react"
import AdminProductSectionPageListComponent from "@components/admins/AdminProductSectionPage"

const AdminProductSectionPagePage = () => {
  useEffect(() => {
    protectRoute({ requiredRole: "admin", redirectTo: "/forbidden-access" })
  }, [])

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold ">Hero Banners Management</h1>
        <p className="text-xs font-semibold mb-4 text-gray-500">
          Manage all Hero Banners in one place
        </p>
        <AdminProductSectionPageListComponent />
      </div>
    </AdminLayout>
  )
}

export default AdminProductSectionPagePage
