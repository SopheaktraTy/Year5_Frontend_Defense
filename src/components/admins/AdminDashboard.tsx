import React, { useEffect, useState } from "react"
import { getAllUsers } from "../../services/authService"
import { getAllOrders } from "../../services/orderService"
import { getAllProducts } from "../../services/productService"
import { User } from "../../types/authType"
import { Order } from "../../types/orderType"
import { ProductDto } from "../../types/productType"
import {
  Users,
  ShoppingCart,
  Package,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { format } from "date-fns"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend
} from "recharts"

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<ProductDto[]>([])

  // ✅ Pagination states for all sections
  const [topSellingPage, setTopSellingPage] = useState(1)
  const [inventoryPage, setInventoryPage] = useState(1)
  const [ordersPage, setOrdersPage] = useState(1)
  const [lowStockPage, setLowStockPage] = useState(1)

  const ITEMS_PER_PAGE = 4

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, ordersData, productsData] = await Promise.all([
          getAllUsers(),
          getAllOrders(),
          getAllProducts()
        ])
        setUsers(usersData)
        setOrders(ordersData)
        setProducts(productsData)
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      }
    }
    fetchData()
  }, [])

  const lowStockProducts = products.filter(p => p.total_quantity <= 5)
  const lowStockCount = lowStockProducts.length

  // 📈 Orders over time (line chart)
  const ordersOverTime = orders.map(order => ({
    date: format(new Date(order.create_at), "MM/dd"),
    total: Number(order.total_amount)
  }))

  // 👥 Users over time (bar chart)
  const usersOverTime = users.map(user => ({
    date: format(new Date(user.created_at), "MM/dd"),
    count: 1
  }))

  // ✅ Top Selling Products from actual orders
  const productSales: Record<string, number> = {}
  orders.forEach(order => {
    order.order_items.forEach(item => {
      const productName = item.product.product_name
      productSales[productName] =
        (productSales[productName] || 0) + item.quantity
    })
  })

  const topSelling = Object.entries(productSales)
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)

  // 🏷 Inventory Levels
  const inventoryLevels = products.map(p => ({
    name: p.product_name,
    quantity: p.total_quantity
  }))

  // ✅ Pagination slices
  const paginatedTopSelling = topSelling.slice(
    (topSellingPage - 1) * ITEMS_PER_PAGE,
    topSellingPage * ITEMS_PER_PAGE
  )
  const totalTopSellingPages = Math.ceil(topSelling.length / ITEMS_PER_PAGE)

  const paginatedInventory = inventoryLevels.slice(
    (inventoryPage - 1) * ITEMS_PER_PAGE,
    inventoryPage * ITEMS_PER_PAGE
  )
  const totalInventoryPages = Math.ceil(inventoryLevels.length / ITEMS_PER_PAGE)

  const paginatedOrders = orders.slice(
    (ordersPage - 1) * ITEMS_PER_PAGE,
    ordersPage * ITEMS_PER_PAGE
  )
  const totalOrdersPages = Math.ceil(orders.length / ITEMS_PER_PAGE)

  const paginatedLowStock = lowStockProducts.slice(
    (lowStockPage - 1) * ITEMS_PER_PAGE,
    lowStockPage * ITEMS_PER_PAGE
  )
  const totalLowStockPages = Math.ceil(lowStockProducts.length / ITEMS_PER_PAGE)

  return (
    <div className="p-6 space-y-10">
      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow p-5 flex items-center gap-4">
          <Users className="w-12 h-12 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">
              {users.length}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl shadow p-5 flex items-center gap-4">
          <ShoppingCart className="w-12 h-12 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900">
              {orders.length}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl shadow p-5 flex items-center gap-4">
          <Package className="w-12 h-12 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-semibold text-gray-900">
              {products.length}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-100 to-red-50 rounded-xl shadow p-5 flex items-center gap-4">
          <AlertTriangle className="w-12 h-12 text-red-600" />
          <div>
            <p className="text-sm text-gray-500">Low Stock Products</p>
            <p className="text-2xl font-semibold text-gray-900">
              {lowStockCount}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        {/* Orders Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">📅 Orders Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ordersOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Users Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">🧍‍♂️ New Users Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={usersOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Top Selling Products */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              📊 Top Selling Products (Page {topSellingPage}/
              {totalTopSellingPages})
            </h2>
            <div className="flex gap-2">
              <button
                className="p-1 border rounded disabled:opacity-40"
                onClick={() => setTopSellingPage(p => Math.max(1, p - 1))}
                disabled={topSellingPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="p-1 border rounded disabled:opacity-40"
                onClick={() =>
                  setTopSellingPage(p => Math.min(totalTopSellingPages, p + 1))
                }
                disabled={topSellingPage === totalTopSellingPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paginatedTopSelling} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="sold" fill="#6366f1" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Inventory Levels */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              🏷 Inventory Levels (Page {inventoryPage}/{totalInventoryPages})
            </h2>
            <div className="flex gap-2">
              <button
                className="p-1 border rounded disabled:opacity-40"
                onClick={() => setInventoryPage(p => Math.max(1, p - 1))}
                disabled={inventoryPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="p-1 border rounded disabled:opacity-40"
                onClick={() =>
                  setInventoryPage(p => Math.min(totalInventoryPages, p + 1))
                }
                disabled={inventoryPage === totalInventoryPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paginatedInventory} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="quantity" fill="#f43f5e" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        {/* 📃 Recent Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              📃 Recent Orders (Page {ordersPage}/{totalOrdersPages})
            </h2>
            <div className="flex gap-2">
              <button
                className="p-1 border rounded disabled:opacity-40"
                onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                disabled={ordersPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="p-1 border rounded disabled:opacity-40"
                onClick={() =>
                  setOrdersPage(p => Math.min(totalOrdersPages, p + 1))
                }
                disabled={ordersPage === totalOrdersPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2 text-left">Order No</th>
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-2 font-medium text-blue-600">
                      {order.order_no}
                    </td>
                    <td className="p-2">
                      {order.user
                        ? `${order.user.firstname ?? ""} ${
                            order.user.lastname ?? ""
                          }`
                        : "Guest"}
                    </td>
                    <td className="p-2">
                      {format(new Date(order.create_at), "PPpp")}
                    </td>
                    <td className="p-2 text-red-600 font-semibold">
                      ${Number(order.total_amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 📉 Low Stock Products with pagination */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              📉 Low Stock Products (Page {lowStockPage}/{totalLowStockPages})
            </h2>
            <div className="flex gap-2">
              <button
                className="p-1 border rounded disabled:opacity-40"
                onClick={() => setLowStockPage(p => Math.max(1, p - 1))}
                disabled={lowStockPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="p-1 border rounded disabled:opacity-40"
                onClick={() =>
                  setLowStockPage(p => Math.min(totalLowStockPages, p + 1))
                }
                disabled={lowStockPage === totalLowStockPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Category</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLowStock.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.product_name}</td>
                    <td className="p-2 text-red-600 font-semibold">
                      {p.total_quantity}
                    </td>
                    <td className="p-2">{p.category.category_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
