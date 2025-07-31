export const exportOrdersToCSV = (orders) => {
  if (!orders || !orders.length) return;

  const headers = [
    "Order ID",
    "Customer Name",
    "Email",
    "Phone",
    "Country",
    "State",
    "Postcode",
    "Total Items",
    "Items Total",
    "Delivery Charge",
    "Handling Charge",
    "Grand Total",
    "Payment Method",
    "Payment Status",
    "Order Status",
    "Order Date",
  ];

  const rows = orders.map((order) => [
    order?.orderId || "",
    order?.customer || "",
    order?.customerEmail || "",
    order?.customerPhone || "",
    order?.shippingAddress?.country || "",
    order?.shippingAddress?.state || "",
    order?.shippingAddress?.postcode || "",
    order?.totalItems ?? 0,
    order?.itemsTotal ?? 0,
    order?.deliveryCharge ?? 0,
    order?.handlingCharge ?? 0,
    order?.totalAmount ?? 0,
    order?.paymentMethod || "",
    order?.paymentStatus || "",
    order?.status || "",
    order?.orderDate ? new Date(order.orderDate).toLocaleString() : "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "orders_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
