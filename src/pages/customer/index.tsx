// src/pages/index.tsx
import Head from "next/head"
import Header from "@components/customers/CustomerHeader"
import Footer from "@components/customers/CustomerFooter"
import { useEffect } from "react"
import { protectRoute } from "@utils/protectRoute"
import CustomerCategoriesComponent from "@components/customers/CustomerCategories"
import CustomerHeroBannerComponent from "@components/customers/CustomerHeroBanner"
import CustomerProductSectionPage from "@components/customers/CustomerProductSectionPage"

export default function CustomerHomepage() {
  useEffect(() => {
    protectRoute({ requiredRole: "customer", redirectTo: "/forbidden-access" })
  }, [])

  // useEffect(() => {
  //   const hasReloaded = sessionStorage.getItem("hasReloaded")

  //   if (!hasReloaded) {
  //     sessionStorage.setItem("hasReloaded", "true")
  //     setTimeout(() => {
  //       window.location.reload()
  //     }, 150) // 50ms delay
  //   } else {
  //     sessionStorage.removeItem("hasReloaded")
  //   }
  // }, [])

  return (
    <>
      <Head>
        <title>Monostore | Home</title>
        <meta
          name="description"
          content="Discover premium products and deals at Monostore"
        />
      </Head>
      <Header />

      <main className="bg-white flex flex-col gap-2">
        <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8 text-center">
          <CustomerHeroBannerComponent />
        </div>
        <div className="  max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CustomerCategoriesComponent />
        </div>
      </main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <CustomerProductSectionPage />
      </div>

      <Footer />
    </>
  )
}
