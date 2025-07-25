import React, { useEffect, useState } from "react"
import { getMyOrders } from "../../services/orderService"
import { Order } from "../../types/orderType"

const CustomerOrderListComponent = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
  }

  if (loading) return <p className="p-4">Loading orders...</p>
  if (orders.length === 0)
    return <p className="p-4 text-gray-500">You have no orders yet.</p>

  return (
    <div className=" w-full p-4 bg-white rounded-lg">
      <div className="overflow-x-auto ">
        <table className="w-full table-auto border-collapse border border-gray-200 bg-white overflow-hidden shadow-sm">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Order No
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Date
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Total Amount
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Products
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2 font-medium text-blue-600">
                  #{order.order_no}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-gray-500">
                  {formatDate(order.create_at)}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-red-600 font-semibold">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <ul className="list-disc list-inside space-y-1">
                    {order.order_items.map((item, index) => (
                      <li key={index}>
                        {item.product.product_name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerOrderListComponent
