import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { protectRoute } from "../../../utils/protectRoute"
import CustomerHeader from "@components/customers/CustomerHeader"
import CustomerFooter from "@components/customers/CustomerFooter"
import ProductDetailPage from "@components/customers/CustomerProductDetail"
import { ChevronLeft } from "lucide-react"
import CartPopupSidebar from "@components/customers/CustomerCartPopupSidebar" // adjust if needed

const CustomerProductDetailPage = () => {
  const router = useRouter()
  const [pageTitle, setPageTitle] = useState<string>("My Profile")
  const [showCartSidebar, setShowCartSidebar] = useState<boolean>(false)

  useEffect(() => {
    protectRoute({ requiredRole: "customer", redirectTo: "/forbidden-access" })
  }, [])

  return (
    <>
      <CustomerHeader />
      <div className="px-6 py-4 max-w-7xl mx-auto flex items-center gap-3">
        <ChevronLeft
          className="w-5 h-5 text-gray-700 cursor-pointer"
          onClick={() => router.back()}
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-xs font-semibold text-gray-500">
            Clean, Efficient Product Detail Experience
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 max-w-7xl mx-auto">
        <ProductDetailPage
          onProductLoaded={name => setPageTitle(name)}
          onAddToCart={() => setShowCartSidebar(true)}
        />
      </div>

      {showCartSidebar && (
        <CartPopupSidebar
          onClose={() => setShowCartSidebar(false)}
          onCartChange={() => {}}
        />
      )}

      <CustomerFooter />
    </>
  )
}

// ✅ This must be present:
export default CustomerProductDetailPage
