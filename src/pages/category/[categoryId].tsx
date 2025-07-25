import React from "react"
import Header from "@components/Header"
import Footer from "@components/Footer"
import { useRouter } from "next/router"
import ProductCategoryPage from "@components/CategoriesWithProduct"

const CustomerCategoryPage = () => {
  const router = useRouter()

  return (
    <>
      <Header />
      <div className="p-6 max-w-7xl mx-auto ">
        <ProductCategoryPage />
      </div>
      <Footer />
    </>
  )
}

export default CustomerCategoryPage
