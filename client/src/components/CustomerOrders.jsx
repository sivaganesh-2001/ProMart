import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [sellers, setSellers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerEmail = localStorage.getItem("customerEmail");

  useEffect(() => {
    if (!customerEmail) {
      setError("Please log in to view orders");
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [customerEmail]);

  const fetchSeller = async (sellerId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/sellers/id/${sellerId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const sellerData = await response.json();
      return sellerData;
    } catch (error) {
      console.error("Error fetching seller:", error);
      return null;
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/products/${productId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const productData = await response.json();
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
      const res = await fetch(`http://localhost:8081/api/orders/customer?customerEmail=${customerEmail}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const orderData = await res.json();

      if (!orderData || orderData.length === 0) {
        setOrders([]);
        setFilteredOrders([]);
        setLoading(false);
        return;
      }

      const uniqueSellerIds = [...new Set(orderData.map(order => order.sellerId).filter(id => id))];
      const sellerPromises = uniqueSellerIds.map(id => fetchSeller(id));
      const sellersData = await Promise.all(sellerPromises);

      const sellersMap = {};
      sellersData.forEach(seller => {
        if (seller && seller.id) {
          sellersMap[seller.id] = {
            shopName: seller.shopName,
            phone: seller.phone
          };
        }
      });
      setSellers(sellersMap);

      const allProductIds = orderData
        .flatMap(order => order.items.map(item => item.productId))
        .filter(id => id);
      const uniqueProductIds = [...new Set(allProductIds)];
      
      const productPromises = uniqueProductIds.map(id => fetchProduct(id));
      const productsData = await Promise.all(productPromises);

      const productsMap = {};
      productsData.forEach(product => {
        if (product && product.id) {
          productsMap[product.id] = product.brand;
        }
      });

      const updatedOrders = orderData.map(order => ({
        ...order,
        id: order.id,
        shopName: sellersMap[order.sellerId]?.shopName || "Unknown Shop",
        shopPhone: sellersMap[order.sellerId]?.phone || "N/A",
        items: order.items.map(item => ({
          ...item,
          brand: productsMap[item.productId] || "N/A"
        }))
      }));

      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id) => {
    // Optimistic UI update
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "Cancelled" } : order
      )
    );
    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "Cancelled" } : order
      )
    );

    fetch(`http://localhost:8081/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Cancelled" }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to cancel order: ${res.status} - ${errorText}`);
        }
        // Check if response has content before trying to parse as JSON
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        return { success: true }; // Fallback for non-JSON responses
      })
      .then((response) => {
        console.log("Order cancelled successfully", response);
        // Remove cancelled order from state
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
        setFilteredOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
        toast.success("Order cancelled successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error cancelling order:", error);
        // Revert to server state on error
        fetchOrders();
        toast.error(`Failed to cancel order: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
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
    "Out for Delivery": "bg-purple-500 text-white",
    Delivered: "bg-green-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  if (loading) return <div className="text-center p-6">Loading orders...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
        <h1 className="text-2xl font-bold">🛍️ My Orders</h1>
        <p className="text-sm mt-1">View all your past and current orders!</p>
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
            <th className="border p-2 text-left">Shop Name</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="5" className="border p-2 text-center">No orders found</td>
            </tr>
          ) : (
            filteredOrders.map((order, index) => (
              <>
                <tr key={order.id} className="border">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{order.shopName}</td>
                  <td className="border p-2 text-center">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="border p-2 text-center">
                    <span className={`px-2 py-1 rounded ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
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

                      <div className="mt-4 space-y-2">
                        <p className="text-gray-700">
                          📍 <strong>Delivery Address:</strong> {order.address}
                        </p>
                        <p className="text-gray-700">
                          📞 <strong>Shop Phone:</strong> {order.shopPhone}
                        </p>
                        {order.status === "Pending" && (
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to cancel this order?")) {
                                updateStatus(order.id);
                              }
                            }}
                            className="mt-2 px-4 py-2 bg-red-500 text-white font-medium rounded-md shadow-md hover:bg-red-600 transition"
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.status === "Confirmed" && (
                          <p className="text-gray-500 italic">
                            This order is confirmed and cannot be cancelled
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))
          )}
        </tbody>
      </table>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default CustomerOrders;