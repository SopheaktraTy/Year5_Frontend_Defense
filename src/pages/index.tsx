// src/pages/index.tsx
import Head from "next/head"
import Header from "@components/Header"
import Footer from "@components/Footer"
import CategoriesComponent from "@components/Categories"
import HeroBanner from "@components/HeroBanner"
import { useEffect } from "react"

export default function GuestHomePage() {
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded")

    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true")
      setTimeout(() => {
        window.location.reload()
      }, 150) // 50ms delay
    } else {
      sessionStorage.removeItem("hasReloaded")
    }
  }, [])
  return (
    <>
      <Head>
        <title>Monostore | Home</title>
        <meta
          name="description"
          content="Discover premium products and deals at Uminex"
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header />
      <div className="flex flex-col gap-2 w-full">
        <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8text-center">
          <HeroBanner />
        </div>
        <div className="max-w-5xl mx-auto px-4  sm:px-6 lg:px-8 text-center">
          <CategoriesComponent />
        </div>
      </div>

      <Footer />
    </>
  )
}
