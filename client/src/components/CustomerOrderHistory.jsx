import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sellers, setSellers] = useState({});
  const [sellerRatings, setSellerRatings] = useState({}); // Renamed for clarity
  const [productRatings, setProductRatings] = useState({}); // New state for product ratings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerEmail = localStorage.getItem("customerEmail");

  useEffect(() => {
    fetchOrders();
  }, [customerEmail]);

  const fetchSeller = async (sellerId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/sellers/id/${sellerId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch seller ${sellerId}: ${response.status}`);
      }
      const seller = await response.json();
      return seller;
    } catch (error) {
      console.error(`Error fetching seller ${sellerId}:`, error);
      return null;
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product ${productId}: ${response.status}`);
      }
      const product = await response.json();
      return product;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!customerEmail) {
        throw new Error("Please log in to view order history");
      }
      const res = await fetch(`http://localhost:8081/api/order-history/customer/${customerEmail}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }
      const orderData = await res.json();

      const completedOrders = orderData.filter(
        (order) => order.status === "Delivered" || order.status === "Cancelled"
      );

      const uniqueSellerIds = [...new Set(completedOrders.map((order) => order.sellerId).filter((id) => id))];
      const sellerPromises = uniqueSellerIds.map((id) => fetchSeller(id));
      const sellersData = await Promise.all(sellerPromises);

      const sellersMap = {};
      const sellerRatingsMap = {};
      sellersData.forEach((seller) => {
        if (seller && seller.id) {
          sellersMap[seller.id] = seller.shopName;
          const userRating = seller.ratings?.find((r) => r.userId === customerEmail)?.rating;
          if (userRating) {
            sellerRatingsMap[seller.id] = userRating;
          }
        }
      });
      setSellers(sellersMap);
      setSellerRatings(sellerRatingsMap);

      const allProductIds = completedOrders
        .flatMap((order) => order.items.map((item) => item.productId))
        .filter((id) => id);
      const uniqueProductIds = [...new Set(allProductIds)];

      const productPromises = uniqueProductIds.map((id) => fetchProduct(id));
      const productsData = await Promise.all(productPromises);

      const productsMap = {};
      const productRatingsMap = {};
      productsData.forEach((product) => {
        if (product && product.id) {
          productsMap[product.id] = product.brand || "N/A";
          const fetchMasterProduct = async () => {
            try {
              const response = await fetch(`http://localhost:8081/api/products/master/${product.masterId}`);
              if (!response.ok) return;
              const masterProduct = await response.json();
              const userRating = masterProduct.ratings?.find((r) => r.userId === customerEmail)?.rating;
              if (userRating) productRatingsMap[product.id] = userRating;
            } catch (error) {
              console.error(`Error fetching master product for ${product.id}:`, error);
            }
          };
          fetchMasterProduct();
        }
      });
      setProductRatings(productRatingsMap);

      const updatedOrders = completedOrders.map((order) => ({
        ...order,
        orderId: order.id || order.orderId || `order-${Math.random()}`,
        shopName: sellersMap[order.sellerId] || "Unknown Shop",
        sellerId: order.sellerId,
        items: order.items.map((item) => ({
          ...item,
          brand: productsMap[item.productId] || "N/A",
          averageRating: productsData.find((p) => p?.id === item.productId)?.averageRating || 0, // Add product average rating
        })),
        averageRating: sellersData.find((s) => s?.id === order.sellerId)?.averageRating || 0,
      }));

      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Failed to load order history. Please try again later.");
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

  const handleSellerRatingSubmit = async (sellerId, ratingValue) => {
    const previousRating = sellerRatings[sellerId] || 0;
    console.log("Submitting seller rating for:", sellerId, "Rating:", ratingValue, "Previous:", previousRating);

    setSellerRatings((prevRatings) => ({
      ...prevRatings,
      [sellerId]: ratingValue,
    }));

    const ratingRequest = {
      userId: customerEmail,
      rating: ratingValue,
    };

    try {
      const response = await fetch(`http://localhost:8081/api/sellers/${sellerId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingRequest),
      });

      const data = await response.json();
      console.log("Seller Rating Response:", data);

      if (response.ok) {
        toast.success(data.message || "Seller rating submitted successfully!");
        if (data.seller) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.sellerId === sellerId
                ? { ...order, averageRating: data.seller.averageRating }
                : order
            )
          );
        }
      } else {
        throw new Error(data.error || "Failed to submit seller rating");
      }
    } catch (error) {
      console.error("Error submitting seller rating:", error);
      toast.error(error.message || "Error submitting seller rating");
      setSellerRatings((prevRatings) => ({
        ...prevRatings,
        [sellerId]: previousRating,
      }));
    }
  };

  const handleProductRatingSubmit = async (productId, ratingValue) => {
    const previousRating = productRatings[productId] || 0;
    console.log("Submitting product rating for:", productId, "Rating:", ratingValue, "Previous:", previousRating);

    setProductRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: ratingValue,
    }));

    const ratingRequest = {
      userId: customerEmail,
      rating: ratingValue,
    };

    try {
      const response = await fetch(`http://localhost:8081/api/products/${productId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingRequest),
      });

      const data = await response.json();
      console.log("Product Rating Response:", data);

      if (response.ok) {
        toast.success(data.message || "Product rating submitted successfully!");
        if (data.product) {
          setOrders((prevOrders) =>
            prevOrders.map((order) => ({
              ...order,
              items: order.items.map((item) =>
                item.productId === productId
                  ? { ...item, averageRating: data.product.averageRating }
                  : item
              ),
            }))
          );
        }
      } else {
        throw new Error(data.error || "Failed to submit product rating");
      }
    } catch (error) {
      console.error("Error submitting product rating:", error);
      toast.error(error.message || "Error submitting product rating");
      setProductRatings((prevRatings) => ({
        ...prevRatings,
        [productId]: previousRating,
      }));
    }
  };

  const statusColors = {
    Delivered: "bg-green-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  if (loading) {
    return <div className="text-center p-6">Loading order history...</div>;
  }
  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
        <h1 className="text-2xl font-bold">📜 My Order History</h1>
        <p className="text-sm mt-1">Track and rate your past orders!</p>
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
                  <td className="border p-2 text-center">
                    <span className={`px-2 py-1 rounded ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() =>
                        setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)
                      }
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
                          <strong>📍 Delivery Address:</strong> {order.address || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <strong>💰 Payment Method:</strong> {order.paymentMethod || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <strong>📅 Completed Date:</strong>{" "}
                          {order.completedDate
                            ? new Date(order.completedDate).toLocaleString()
                            : "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <strong>⭐ Shop Average Rating:</strong> {order.averageRating.toFixed(1)} (
                          {sellerRatings[order.sellerId] ? "You rated" : "Not yet rated"})
                        </p>
                      </div>

                      <div className="mt-6">
                        <p className="text-gray-800 font-semibold mb-1">⭐ Rate this Shop:</p>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => handleSellerRatingSubmit(order.sellerId, star)}
                              className={`cursor-pointer text-2xl ${
                                (sellerRatings[order.sellerId] || 0) >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          {sellerRatings[order.sellerId] && (
                            <span className="ml-2 text-sm text-gray-600">
                              You rated {sellerRatings[order.sellerId]} star
                              {sellerRatings[order.sellerId] > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
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
                              <th className="border p-2">Rating</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx} className="border">
                                <td className="border p-2">{item.productName || "N/A"}</td>
                                <td className="border p-2">{item.brand || "N/A"}</td>
                                <td className="border p-2 text-center">{item.quantity || 0}</td>
                                <td className="border p-2 text-center">
                                  ₹{(item.price || 0).toFixed(2)}
                                </td>
                                <td className="border p-2 text-center">
                                  ₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                                </td>
                                <td className="border p-2 text-center">
                                  <div className="flex flex-col items-center">
                                    
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                          key={star}
                                          onClick={() => handleProductRatingSubmit(item.productId, star)}
                                          className={`cursor-pointer text-xl ${
                                            (productRatings[item.productId] || 0) >= star
                                              ? "text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                    {productRatings[item.productId] && (
                                      <span className="mt-1 text-sm text-gray-600">
                                        You rated {productRatings[item.productId]}
                                      </span>
                                    )}
                                  </div>
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

      <ToastContainer />
    </div>
  );
};

export default CustomerOrderHistory;