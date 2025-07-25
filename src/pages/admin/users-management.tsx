import React from "react"
import AdminLayout from "@components/admins/AdminLayout"
import { protectRoute } from "../../utils/protectRoute"
import { useEffect } from "react"
import AdminUserManagementList from "@components/admins/AdminUserManagementList"

const UserManagement = () => {
  useEffect(() => {
    protectRoute({ requiredRole: "admin", redirectTo: "/forbidden-access" })
  }, [])

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold ">User Management</h1>
        <p className="text-xs font-semibold mb-4 text-gray-500">
          Manage all users in one place
        </p>
        <AdminUserManagementList />
      </div>
    </AdminLayout>
  )
}

export default UserManagement
