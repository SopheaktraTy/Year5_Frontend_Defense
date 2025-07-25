import React from "react"
import AdminLayout from "@components/admins/AdminLayout"
import { protectRoute } from "../../utils/protectRoute"
import { useEffect } from "react"
import AdminOrderSummaryList from "@components/admins/AdminOrderSummaryList"

const AdminOrderSummeryPage = () => {
  useEffect(() => {
    protectRoute({ requiredRole: "admin", redirectTo: "/forbidden-access" })
  }, [])

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold ">Product Purchased</h1>
        <p className="text-xs font-semibold mb-4 text-gray-500">
          View all Transaction in one place
        </p>
        <AdminOrderSummaryList />
      </div>
    </AdminLayout>
  )
}

export default AdminOrderSummeryPage
