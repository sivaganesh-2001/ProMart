import React, { useState, useEffect } from "react";
import MainLayout from "../../components/layouts/SellerLayout";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);

  const sellerEmail = localStorage.getItem("sellerEmail");

  useEffect(() => {
    if (!sellerEmail) return;
    fetchOrders();
  }, [sellerEmail]);

  const fetchProduct = async (productId) => {
    try {
      console.log('Fetching product with ID:', productId);
      const response = await fetch(`http://localhost:8081/api/products/${productId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const productData = await response.json();
      console.log('Product data received:', productData);
      return productData;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/orders?sellerEmail=${sellerEmail}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const orderData = await res.json();
      console.log("Orders API response:", orderData);

      if (!Array.isArray(orderData)) {
        console.error("Error: Orders API response is not an array", orderData);
        setOrders([]);
        setFilteredOrders([]);
        return;
      }

      const allProductIds = orderData
        .flatMap(order => order.items.map(item => item.productId))
        .filter(id => id);
      const uniqueProductIds = [...new Set(allProductIds)];
      console.log('Unique product IDs:', uniqueProductIds);

      const productPromises = uniqueProductIds.map(id => fetchProduct(id));
      const productsData = await Promise.all(productPromises);

      const productsMap = {};
      productsData.forEach(product => {
        if (product && product.id) {
          productsMap[product.id] = product.brand;
        }
      });
      console.log('Products map:', productsMap);

      const updatedOrders = orderData.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          brand: productsMap[item.productId] || "N/A"
        }))
      }));

      console.log('Updated orders with brands:', updatedOrders);
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateBill = async (order) => {
    setLoading(true);

    const billData = {
      customerEmail: order.customerEmail,
      sellerId: sellerEmail,
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
        brand: item.brand
      })),
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod || "Cash on Delivery",
      address: order.address,
      phone: order.phone,
      status: order.status,
      orderDate: order.orderDate || new Date().toISOString(),
      billGeneratedTime: new Date().toISOString(),
    };
    console.log("Bill Data:", billData);

    try {
      const response = await fetch("http://localhost:8081/api/billing/online/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });

      if (!response.ok) throw new Error("Failed to save bill");
      const jsonData = await response.json();
      console.log("Bill saved:", jsonData);

      const productQuantities = order.items.reduce((acc, item) => {
        acc[item.productId] = (acc[item.productId] || 0) + Number(item.quantity);
        return acc;
      }, {});

      console.log("Product Quantities:", productQuantities);

      const stockResponse = await fetch("http://localhost:8081/api/products/reduceStock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productQuantities),
      });

      if (!stockResponse.ok) throw new Error("Failed to reduce stock");
      console.log("Stock reduced successfully");

      const pdf = new jsPDF();
      pdf.text("Invoice - Promart", 14, 20);
      pdf.text(`Customer: ${order.customerEmail}`, 14, 30);
      pdf.text(`Phone: ${order.phone}`, 14, 40);
      pdf.text(`Address: ${order.address}`, 14, 50);
      pdf.text(`Payment: ${billData.paymentMethod}`, 14, 60);
      pdf.text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`, 14, 70);

      pdf.autoTable({
        startY: 80,
        head: [["S.No", "Product", "Brand", "Quantity", "Price", "Total"]],
        body: order.items.map((item, index) => [
          index + 1,
          item.productName,
          item.brand,
          item.quantity,
          `₹${item.price.toFixed(2)}`,
          `₹${(item.quantity * item.price).toFixed(2)}`,
        ]),
      });

      pdf.text("Thank you for shopping with us!", 14, pdf.internal.pageSize.height - 30);
      pdf.save(`Invoice_${order.customerEmail}.pdf`);

      alert("Bill saved and downloaded successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate bill: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    fetch(`http://localhost:8081/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then((response) => {
        console.log("Order updated successfully", response);
        if (newStatus === "Delivered" || newStatus === "Cancelled") {
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
          setFilteredOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        fetchOrders();
      });
  };

  useEffect(() => {
    let updatedOrders = [...orders];

    if (statusFilter) {
      updatedOrders = updatedOrders.filter((order) => order.status === statusFilter);
    }

    if (sortOrder) {
      updatedOrders.sort((a, b) =>
        sortOrder === "Low to High" ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount
      );
    }

    setFilteredOrders(updatedOrders);
  }, [statusFilter, sortOrder, orders]);

  const statusColors = {
    Pending: "bg-yellow-500 text-white",
    Confirmed: "bg-blue-500 text-white",
    "Out for Delivery": "bg-blue-500 text-white",
    Delivered: "bg-green-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  return (
    <MainLayout>
      <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">📦 Manage Orders</h1>
          <p className="text-sm mt-1">View and update your store's orders easily!</p>
        </div>

        <div className="flex space-x-4 mt-4 mb-6">
          <select className="border p-2 rounded w-1/2" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select className="border p-2 rounded w-1/2" onChange={(e) => setSortOrder(e.target.value)}>
            <option value="">Sort By Amount</option>
            <option value="Low to High">Low to High</option>
            <option value="High to Low">High to Low</option>
          </select>
        </div>

        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2 text-left">Customer</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Payment Method</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredOrders) && filteredOrders.map((order, index) => (
              <React.Fragment key={order.id}>
                <tr className="border">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{order.customerEmail}</td>
                  <td className="border p-2 text-center">{order.phone}</td>
                  <td className="border p-2 text-center">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="border p-2 text-center">{order.paymentMethod || "Cash on Delivery"}</td>
                  <td className="border p-2 text-center">
                    <select
                      className={`px-2 py-1 rounded border ${statusColors[order.status]}`}
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      {Object.keys(statusColors).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {selectedOrder === order.id ? "Hide Details" : "View Details"}
                    </button>
                  </td>
                </tr>

                {selectedOrder === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="p-6 border-t-4 border-blue-500 rounded-lg shadow-md bg-white">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-semibold text-blue-600">Order Details</h3>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="px-4 py-2 bg-red-500 text-white font-medium rounded-md shadow-md hover:bg-red-600 transition"
                        >
                          Close
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 bg-white shadow-sm rounded-lg">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border p-3">S.No</th>
                              <th className="border p-3 text-left">Product Name</th>
                              <th className="border p-3 text-left">Brand</th>
                              <th className="border p-3 text-center">Quantity</th>
                              <th className="border p-3 text-center">Price</th>
                              <th className="border p-3 text-center">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, i) => (
                              <tr key={i} className="border">
                                <td className="border p-3 text-center">{i + 1}</td>
                                <td className="border p-3">{item.productName}</td>
                                <td className="border p-3">{item.brand}</td>
                                <td className="border p-3 text-center">{item.quantity}</td>
                                <td className="border p-3 text-center">₹{item.price.toFixed(2)}</td>
                                <td className="border p-3 text-center">₹{(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <p className="text-gray-700">
                            📞 <strong>Mobile:</strong> {order.phone}
                          </p>
                          <p className="text-gray-700">
                            📍 <strong>Address:</strong> {order.address}
                          </p>
                          <p className="text-gray-700">
                            💳 <strong>Payment Method:</strong> {order.paymentMethod || "Cash on Delivery"}
                          </p>
                        </div>
                        <button
                          onClick={() => generateBill(order)}
                          className="px-6 py-2 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition"
                        >
                          Generate Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Orders;