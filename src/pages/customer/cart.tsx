import React from "react"
import { protectRoute } from "@utils/protectRoute"
import { useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import CustomerFooter from "@components/customers/CustomerFooter"
import CustomerHeader from "@components/customers/CustomerHeader"
import CustomerProfileSidar from "@components/customers/CustomerProfileSidebar"
import { useRouter } from "next/router"
import CustomerCart from "@components/customers/CustomerCart"

const CustomerCartPage = () => {
  const router = useRouter()

  useEffect(() => {
    protectRoute({ requiredRole: "customer", redirectTo: "/forbidden-access" })
  }, [])
  return (
    <>
      <CustomerHeader />
      <div className="p-6 max-w-7xl mx-auto">
        {/* main header */}
        <div className=" flex items-center gap-3 mb-3 p-4 bg-white rounded-lg shadow-sm ">
          <ChevronLeft
            className="w-5 h-5 text-gray-700 cursor-pointer"
            onClick={() => router.back()}
          />
          <div className="flex flex-col gap-2 ">
            <h1 className="text-2xl font-bold">My Cart</h1>
            <p className="text-xs font-semibold  text-gray-500">
              {" "}
              Clean, Efficient User Experience
            </p>
          </div>
        </div>

        <div className="flex flex-rol gap-3">
          <CustomerProfileSidar />
          <CustomerCart />
        </div>
      </div>
      <CustomerFooter />
    </>
  )
}

export default CustomerCartPage
