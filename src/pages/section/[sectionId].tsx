import React, { useEffect } from "react"
import { useRouter } from "next/router"
import Header from "@components/Header"
import Footer from "@components/Footer"
import { ChevronLeft } from "lucide-react"
import ViewAllProductPageSection from "@components/ViewAllProductPageSection"

const CustomerSectionPage = () => {
  const router = useRouter()

  return (
    <>
      <Header />
      {/* ✅ Page Header with Back Button */}
      <div className="px-6 py-4 max-w-7xl mx-auto flex items-center gap-3">
        <ChevronLeft
          className="w-5 h-5 text-gray-700 cursor-pointer"
          onClick={() => router.back()}
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Section Products</h1>
          <p className="text-xs font-semibold text-gray-500">
            Browse products by section
          </p>
        </div>
      </div>

      {/* ✅ Section Component */}
      <div className="px-6 pb-6 max-w-7xl mx-auto">
        <ViewAllProductPageSection />
      </div>
      <Footer />
    </>
  )
}

export default CustomerSectionPage
