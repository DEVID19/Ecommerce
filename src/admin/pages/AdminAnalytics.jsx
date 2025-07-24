import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
} from "lucide-react";

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7days");

  // Product count by category for bar chart
  const categoryData = [
    {
      name: "Audio",
      productCount: 125,
      totalProducts: 456,
      color: "bg-blue-500",
    },
    {
      name: "Gaming",
      productCount: 98,
      totalProducts: 456,
      color: "bg-green-500",
    },
    {
      name: "Mobile",
      productCount: 87,
      totalProducts: 456,
      color: "bg-purple-500",
    },
    {
      name: "TV",
      productCount: 76,
      totalProducts: 456,
      color: "bg-yellow-500",
    },
    {
      name: "Laptop",
      productCount: 70,
      totalProducts: 456,
      color: "bg-red-500",
    },
  ];

  // Sales by category percentage
  const salesByCategory = [
    { name: "Audio", percentage: 35, amount: "$45,230", color: "bg-blue-500" },
    {
      name: "Gaming",
      percentage: 28,
      amount: "$38,750",
      color: "bg-green-500",
    },
    {
      name: "Mobile",
      percentage: 22,
      amount: "$32,100",
      color: "bg-purple-500",
    },
    { name: "TV", percentage: 10, amount: "$28,900", color: "bg-yellow-500" },
    { name: "Laptop", percentage: 5, amount: "$15,600", color: "bg-red-500" },
  ];

  // Simple overview stats
  const overviewStats = [
    {
      title: "Total Revenue",
      value: "$160,680",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "744",
      change: "+8.2%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Customers",
      value: "1,247",
      change: "+15.3%",
      changeType: "increase",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Total Products",
      value: "456",
      change: "-2.1%",
      changeType: "decrease",
      icon: Package,
      color: "bg-red-500",
    },
  ];

  const maxProductCount = Math.max(...categoryData.map((d) => d.productCount));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your store performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Section 1: Category Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Products by Category
          </h2>
          <p className="text-sm text-gray-600">
            Number of products in each category
          </p>
        </div>

        <div className="space-y-4">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium text-gray-700">
                {category.name}
              </div>
              <div className="flex-1 flex items-center space-x-3">
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className={`${category.color} h-8 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                    style={{
                      width: `${
                        (category.productCount / maxProductCount) * 100
                      }%`,
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {category.productCount}
                    </span>
                  </div>
                </div>
                <div className="w-16 text-sm font-semibold text-gray-900">
                  {(
                    (category.productCount / category.totalProducts) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span>Product Count</span>
          <span>Percentage</span>
        </div>
      </div>

      {/* Section 2: Sales by Category */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Sales by Category
          </h2>
          <p className="text-sm text-gray-600">Percentage breakdown of sales</p>
        </div>

        <div className="space-y-4">
          {salesByCategory.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-4 h-4 ${category.color} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-900 w-16">
                  {category.name}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className={`${category.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm font-semibold text-gray-900 w-8">
                  {category.percentage}%
                </span>
                <span className="text-sm font-medium text-gray-600 w-20">
                  {category.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Simple Overview Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Overview Stats
          </h2>
          <p className="text-sm text-gray-600">Key performance metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center">
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
