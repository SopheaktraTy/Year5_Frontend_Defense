"use client"

import React, { useEffect, useState } from "react"
import { getAllOrders } from "../../services/orderService"
import { Order } from "../../types/orderType"
import { Search } from "lucide-react"
import Image from "next/image"
import dayjs from "dayjs"

const AdminOrderSummaryList = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = filteredOrders.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getAllOrders()
        setOrders(data)
        setFilteredOrders(data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    const lowerSearch = search.toLowerCase()
    const filtered = orders.filter(
      order =>
        `${order.user.firstname} ${order.user.lastname}`
          .toLowerCase()
          .includes(lowerSearch) ||
        order.user.email.toLowerCase().includes(lowerSearch) ||
        order.order_no.toString().includes(lowerSearch)
    )
    setFilteredOrders(filtered)
    setCurrentPage(1)
  }, [search, orders])

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const truncateProductName = (
    text: string,
    maxLength: number = 30
  ): string => {
    if (!text || text.trim() === "") return "Unnamed Product"
    const trimmed = text.trim()
    return trimmed.length > maxLength
      ? trimmed.substring(0, maxLength) + "..."
      : trimmed
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : paginatedOrders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {order.order_no}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={order.user.image || "/placeholder.png"}
                        alt="User"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div>
                        <div className="font-medium">
                          {order.user.firstname} {order.user.lastname}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {order.user.phone_number || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <ul className="list-disc ml-4 space-y-1">
                      {order.order_items.map((item, idx) => (
                        <li key={idx}>
                          x{item.quantity} –{" "}
                          {truncateProductName(item.product.product_name)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {dayjs(order.create_at).format("MMM DD, YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700 mt-4">
        {/* Items Per Page */}
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="whitespace-nowrap">
            Show
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {[5, 10, 20, 50].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="whitespace-nowrap">per page</span>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <span className="text-xs text-gray-500">
            {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>

          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-100 transition-colors"
          >
            ←
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            const pageNum =
              Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                } transition-colors`}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-100 transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderSummaryList
