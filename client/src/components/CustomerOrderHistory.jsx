import React, { useState, useEffect } from "react";

const CustomerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sellers, setSellers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerEmail = localStorage.getItem("customerEmail");

  useEffect(() => {
    if (!customerEmail) {
      setError("Please log in to view order history");
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [customerEmail]);

  const fetchSeller = async (sellerId) => {
    try {
      console.log('Fetching seller with ID:', sellerId);
      const response = await fetch(`http://localhost:8081/api/sellers/id/${sellerId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const sellerData = await response.json();
      console.log('Seller data received:', sellerData);
      return sellerData;
    } catch (error) {
      console.error("Error fetching seller:", error);
      return null;
    }
  };

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
    setError(null);
    try {
      console.log('Fetching orders for email:', customerEmail);
      const res = await fetch(`http://localhost:8081/api/order-history/customer/${customerEmail}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const orderData = await res.json();
      console.log('Order data received:', orderData);

      if (!orderData || orderData.length === 0) {
        setOrders([]);
        setFilteredOrders([]);
        setLoading(false);
        return;
      }

      // Filter for completed orders
      const completedOrders = orderData.filter(
        (order) => order.status === "Delivered" || order.status === "Cancelled"
      );

      // Fetch seller information
      const uniqueSellerIds = [...new Set(completedOrders.map(order => order.sellerId).filter(id => id))];
      console.log('Unique seller IDs:', uniqueSellerIds);
      const sellerPromises = uniqueSellerIds.map(id => fetchSeller(id));
      const sellersData = await Promise.all(sellerPromises);

      const sellersMap = {};
      sellersData.forEach(seller => {
        if (seller && seller.id) {
          sellersMap[seller.id] = seller.shopName;
        }
      });
      console.log('Sellers map:', sellersMap);
      setSellers(sellersMap);

      // Fetch product information for all items
      const allProductIds = completedOrders
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

      // Add shopName and brand to each order
      const updatedOrders = completedOrders.map(order => ({
        ...order,
        orderId: order.id || order.orderId,
        shopName: sellersMap[order.sellerId] || "Unknown Shop",
        items: order.items.map(item => ({
          ...item,
          brand: productsMap[item.productId] || "N/A"
        }))
      }));

      console.log('Updated orders with shop names and brands:', updatedOrders);
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load order history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orders);
    } else {
      const updatedOrders = orders.filter((order) =>
        order.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(updatedOrders);
    }
  }, [searchQuery, orders]);

  const statusColors = {
    Delivered: "bg-green-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  if (loading) return <div className="text-center p-6">Loading order history...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
        <h1 className="text-2xl font-bold">📜 My Order History</h1>
        <p className="text-sm mt-1">Track and view your past orders easily!</p>
      </div>

      <div className="flex mt-4 mb-6">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="🔍 Search by Shop Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">S.No</th>
            <th className="border p-2">Shop Name</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <React.Fragment key={order.orderId}>
                <tr className="border">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{order.shopName}</td>
                  <td className="border p-2 text-center">₹{order.totalAmount.toFixed(2)}</td>
                  <td className={`border p-2 text-center font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {selectedOrder === order.orderId ? "Hide Details" : "View Details"}
                    </button>
                  </td>
                </tr>

                {selectedOrder === order.orderId && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="p-6 border-t-4 border-blue-500 rounded-lg shadow-md bg-white">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-semibold text-blue-600">Order Details</h3>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="px-4 py-2 bg-red-500 text-white font-medium rounded-md shadow-md hover:bg-red-600 transition"
                        >
                          Close
                        </button>
                      </div>

                      <div className="mt-4">
                        <p className="text-gray-700">
                          <strong>📍 Delivery Address:</strong> {order.address}
                        </p>
                        <p className="text-gray-700">
                          <strong>💰 Payment Method:</strong> {order.paymentMethod}
                        </p>
                        <p className="text-gray-700">
                          <strong>📅 Completed Date:</strong>{" "}
                          {order.completedDate ? new Date(order.completedDate).toLocaleString() : "N/A"}
                        </p>
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <table className="w-full border border-gray-300 bg-white shadow-sm rounded-lg">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border p-2">Product Name</th>
                              <th className="border p-2">Brand</th>
                              <th className="border p-2">Quantity</th>
                              <th className="border p-2">Price</th>
                              <th className="border p-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx} className="border">
                                <td className="border p-2">{item.productName}</td>
                                <td className="border p-2">{item.brand}</td>
                                <td className="border p-2 text-center">{item.quantity}</td>
                                <td className="border p-2 text-center">₹{item.price.toFixed(2)}</td>
                                <td className="border p-2 text-center">
                                  ₹{(item.quantity * item.price).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerOrderHistory;