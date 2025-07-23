import { DollarSign, PackageSearch, ShoppingCart, Users } from "lucide-react";
import React from "react";

const AdminDashboard = () => {
  const stats = [
    {
      label: "Total Revenue",
      value: "$45,230",
      icon: <DollarSign className=" text-white bg-green-500 p-1 rounded-md" size={50} />,
      change: "+12.5%",
      changeColor: "text-green-500",
    },
    {
      label: "Total Orders",
      value: "1,235",
      icon: <ShoppingCart className=" text-white bg-blue-500 p-2 rounded-md" size={50} />,
      change: "+8.2%",
      changeColor: "text-green-500",
    },
    {
      label: "Total Products",
      value: "456",
      icon: <PackageSearch className=" text-white bg-purple-500 p-2 rounded-md" size={50} />,
      change: "+15.3%",
      changeColor: "text-green-500",
    },
    {
      label: "Total Customers",
      value: "2,847",
      icon: <Users className=" text-white bg-red-400 p-2 rounded-md" size={50} />,
      change: "-2.4%",
      changeColor: "text-red-500",
    },
  ];

  const orders = [
    {
      id: "#12345",
      customer: "John Doe",
      product: "Sony WH-1000XM5",
      amount: "$362",
      status: "completed",
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      product: "Xbox Controller",
      amount: "$57",
      status: "pending",
    },
    {
      id: "#12347",
      customer: "Mike Johnson",
      product: "Logitech G733",
      amount: "$384",
      status: "completed",
    },
    {
      id: "#12348",
      customer: "Sarah Wilson",
      product: "boAt Rockerz 370",
      amount: "$773",
      status: "shipped",
    },
  ];

  // const getStatusBadge = (status) => {
  //   switch (status) {
  //     case "completed":
  //       return (
  //         <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
  //           completed
  //         </span>
  //       );
  //     case "pending":
  //       return (
  //         <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
  //           pending
  //         </span>
  //       );
  //     case "shipped":
  //       return (
  //         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
  //           shipped
  //         </span>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg p-8 shadow border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-md ">{stat.label}</p>
                <h3 className="text-xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
