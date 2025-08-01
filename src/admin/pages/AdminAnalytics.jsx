// import React, { useState } from "react";
// import {
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   ShoppingCart,
//   Users,
//   Package,
//   BarChart3,
// } from "lucide-react";

// const AdminAnalytics = () => {
//   const [timeRange, setTimeRange] = useState("7days");

//   // Product count by category for bar chart
//   const categoryData = [
//     {
//       name: "Audio",
//       productCount: 125,
//       totalProducts: 456,
//       color: "bg-blue-500",
//     },
//     {
//       name: "Gaming",
//       productCount: 98,
//       totalProducts: 456,
//       color: "bg-green-500",
//     },
//     {
//       name: "Mobile",
//       productCount: 87,
//       totalProducts: 456,
//       color: "bg-purple-500",
//     },
//     {
//       name: "TV",
//       productCount: 76,
//       totalProducts: 456,
//       color: "bg-yellow-500",
//     },
//     {
//       name: "Laptop",
//       productCount: 70,
//       totalProducts: 456,
//       color: "bg-red-500",
//     },
//   ];

//   // Sales by category percentage
//   const salesByCategory = [
//     { name: "Audio", percentage: 35, amount: "$45,230", color: "bg-blue-500" },
//     {
//       name: "Gaming",
//       percentage: 28,
//       amount: "$38,750",
//       color: "bg-green-500",
//     },
//     {
//       name: "Mobile",
//       percentage: 22,
//       amount: "$32,100",
//       color: "bg-purple-500",
//     },
//     { name: "TV", percentage: 10, amount: "$28,900", color: "bg-yellow-500" },
//     { name: "Laptop", percentage: 5, amount: "$15,600", color: "bg-red-500" },
//   ];

//   // Simple overview stats
//   const overviewStats = [
//     {
//       title: "Total Revenue",
//       value: "$160,680",
//       change: "+12.5%",
//       changeType: "increase",
//       icon: DollarSign,
//       color: "bg-green-500",
//     },
//     {
//       title: "Total Orders",
//       value: "744",
//       change: "+8.2%",
//       changeType: "increase",
//       icon: ShoppingCart,
//       color: "bg-blue-500",
//     },
//     {
//       title: "Total Customers",
//       value: "1,247",
//       change: "+15.3%",
//       changeType: "increase",
//       icon: Users,
//       color: "bg-purple-500",
//     },
//     {
//       title: "Total Products",
//       value: "456",
//       change: "-2.1%",
//       changeType: "decrease",
//       icon: Package,
//       color: "bg-red-500",
//     },
//   ];

//   const maxProductCount = Math.max(...categoryData.map((d) => d.productCount));

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
//           <p className="text-gray-600 mt-1">Track your store performance</p>
//         </div>
//         <div className="mt-4 sm:mt-0 flex items-center space-x-3">
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//           >
//             <option value="7days">Last 7 days</option>
//             <option value="30days">Last 30 days</option>
//             <option value="90days">Last 90 days</option>
//           </select>
//           <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
//             <BarChart3 className="w-4 h-4" />
//             <span>Export</span>
//           </button>
//         </div>
//       </div>

//       {/* Section 1: Category Bar Chart */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Products by Category
//           </h2>
//           <p className="text-sm text-gray-600">
//             Number of products in each category
//           </p>
//         </div>

//         <div className="space-y-4">
//           {categoryData.map((category, index) => (
//             <div key={index} className="flex items-center space-x-4">
//               <div className="w-20 text-sm font-medium text-gray-700">
//                 {category.name}
//               </div>
//               <div className="flex-1 flex items-center space-x-3">
//                 <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
//                   <div
//                     className={`${category.color} h-8 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
//                     style={{
//                       width: `${
//                         (category.productCount / maxProductCount) * 100
//                       }%`,
//                     }}
//                   >
//                     <span className="text-white text-xs font-semibold">
//                       {category.productCount}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="w-16 text-sm font-semibold text-gray-900">
//                   {(
//                     (category.productCount / category.totalProducts) *
//                     100
//                   ).toFixed(1)}
//                   %
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-4 flex justify-between text-xs text-gray-500">
//           <span>Product Count</span>
//           <span>Percentage</span>
//         </div>
//       </div>

//       {/* Section 2: Sales by Category */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Sales by Category
//           </h2>
//           <p className="text-sm text-gray-600">Percentage breakdown of sales</p>
//         </div>

//         <div className="space-y-4">
//           {salesByCategory.map((category, index) => (
//             <div key={index} className="flex items-center justify-between">
//               <div className="flex items-center space-x-3 flex-1">
//                 <div className={`w-4 h-4 ${category.color} rounded-full`}></div>
//                 <span className="text-sm font-medium text-gray-900 w-16">
//                   {category.name}
//                 </span>
//                 <div className="flex-1 bg-gray-100 rounded-full h-3">
//                   <div
//                     className={`${category.color} h-3 rounded-full transition-all duration-1000 ease-out`}
//                     style={{ width: `${category.percentage}%` }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4 ml-4">
//                 <span className="text-sm font-semibold text-gray-900 w-8">
//                   {category.percentage}%
//                 </span>
//                 <span className="text-sm font-medium text-gray-600 w-20">
//                   {category.amount}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Section 3: Simple Overview Stats */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Overview Stats
//           </h2>
//           <p className="text-sm text-gray-600">Key performance metrics</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {overviewStats.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <div
//                 key={index}
//                 className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <div
//                     className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
//                   >
//                     <Icon className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex items-center">
//                     {stat.changeType === "increase" ? (
//                       <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
//                     ) : (
//                       <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
//                     )}
//                     <span
//                       className={`text-sm font-medium ${
//                         stat.changeType === "increase"
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {stat.change}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900 mb-1">
//                     {stat.value}
//                   </p>
//                   <p className="text-sm text-gray-600">{stat.title}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAnalytics;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Download,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  selectProductsByCategory,
  fetchAllAnalyticsData,
  selectSalesByCategory,
  selectOverviewStats,
  selectRecentOrders,
  selectMonthlySales,
  selectTopProducts,
  selectAnalyticsLoading,
  selectAnalyticsError,
  selectTimeRange,
  setTimeRange,
} from "../../features/adminfeatures/adminAnalytics/AdminAnalyticsSlice";

const AdminAnalytics = () => {
  const dispatch = useDispatch();

  // Selectors
  const productsByCategory = useSelector(selectProductsByCategory);
  const salesByCategory = useSelector(selectSalesByCategory);
  const overviewStats = useSelector(selectOverviewStats);
  const recentOrders = useSelector(selectRecentOrders);
  const monthlySales = useSelector(selectMonthlySales);
  const topProducts = useSelector(selectTopProducts);
  const isLoading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);
  const timeRange = useSelector(selectTimeRange);

  // Colors for charts
  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
  ];

  useEffect(() => {
    dispatch(fetchAllAnalyticsData());
  }, [dispatch]);

  const handleTimeRangeChange = (newRange) => {
    dispatch(setTimeRange(newRange));
    // You can add logic here to refetch data based on time range
  };

  // Helper function to safely format numbers
  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    const num = safeNumber(value);
    return `$${num.toLocaleString()}`;
  };

  // Overview stats with icons and colors
  const statsCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(overviewStats.totalRevenue),
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: safeNumber(overviewStats.totalOrders).toLocaleString(),
      change: "+8.2%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Customers",
      value: safeNumber(overviewStats.totalCustomers).toLocaleString(),
      change: "+15.3%",
      changeType: "increase",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Total Products",
      value: safeNumber(overviewStats.totalProducts).toLocaleString(),
      change: `${safeNumber(overviewStats.lowStockProducts)} low stock`,
      changeType:
        safeNumber(overviewStats.lowStockProducts) > 0 ? "decrease" : "neutral",
      icon: Package,
      color: "bg-indigo-500",
    },
  ];

  // Validate chart data
  const validateChartData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.filter((item) => {
    return Object.entries(item).every(([key, value]) => {
      if (typeof value === "number") {
        return !isNaN(value) && isFinite(value);
      }
      return true; // allow strings like 'month' or 'name'
    });
  });
};


  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading analytics</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => dispatch(fetchAllAnalyticsData())}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Validate data before rendering
  const validProductsData = validateChartData(productsByCategory?.data || []);
  const validSalesData = validateChartData(salesByCategory?.data || []);
  const validMonthlySales = validateChartData(monthlySales || []);

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center text-center bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your store performance and insights
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div> */}
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center">
                  {stat.changeType === "increase" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : stat.changeType === "decrease" ? (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : stat.changeType === "decrease"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="">
        {/* Products by Category - Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Products by Category
            </h2>
            <p className="text-sm text-gray-600">
              Distribution of products across categories
            </p>
          </div>

          {validProductsData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={validProductsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {validProductsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, "Products"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  No product data available
                </p>
                <p className="text-sm text-gray-500">
                  Add some products to see the distribution
                </p>
              </div>
            </div>
          )}
        </div>
        

        {/* Sales by Category - Bar Chart */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Sales by Category
            </h2>
            <p className="text-sm text-gray-600">
              Revenue distribution across product categories
            </p>
          </div>

          {validSalesData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={validSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${safeNumber(value).toLocaleString()}`,
                      "Sales",
                    ]}
                  />
                  <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  No sales data available
                </p>
                <p className="text-sm text-gray-500">
                  Complete some orders to see sales analytics
                </p>
              </div>
            </div>
          )}
        </div> */}
      </div>

      {/* Monthly Sales Trend */}
      {validMonthlySales.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Sales Trend
            </h2>
            <p className="text-sm text-gray-600">
              Sales performance over the months
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validMonthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `$${safeNumber(value).toLocaleString()}`,
                    "Sales",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom Row - Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <p className="text-sm text-gray-600">
              Latest orders from customers
            </p>
          </div>

          <div className="space-y-4">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-gray-900">
                        {order.orderId}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "completed" ||
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.customer}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      {safeNumber(order.itemsCount)} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    No recent orders found
                  </p>
                  <p className="text-sm text-gray-500">
                    Orders will appear here once customers start purchasing
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Selling Products
            </h2>
            <p className="text-sm text-gray-600">
              Best performing products by quantity sold
            </p>
          </div>

          <div className="space-y-4">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-800">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.title}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-xs text-gray-500">
                        Sold: {safeNumber(product.totalSold)} units
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        Revenue: {formatCurrency(product.totalRevenue)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (safeNumber(product.totalSold) /
                              safeNumber(topProducts[0]?.totalSold, 1)) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    No product sales data found
                  </p>
                  <p className="text-sm text-gray-500">
                    Sales data will appear here once orders are completed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(overviewStats.averageOrderValue)}
            </p>
            <p className="text-sm text-blue-600 mt-1">Average Order Value</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <p className="text-2xl font-bold text-green-700">
              {safeNumber(overviewStats.completedOrders)}
            </p>
            <p className="text-sm text-green-600 mt-1">Completed Orders</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
            <p className="text-2xl font-bold text-yellow-700">
              {safeNumber(overviewStats.pendingOrders)}
            </p>
            <p className="text-sm text-yellow-600 mt-1">Pending Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
