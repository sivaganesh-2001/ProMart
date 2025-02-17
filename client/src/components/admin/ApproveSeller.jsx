import React, { useEffect, useState } from "react";
import axios from "axios";

function Approve() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/sellers/approvals")
      .then((response) => {
        setShops(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch seller approvals.");
        setLoading(false);
      });
  }, []);

  const handleApproval = (id, status) => {
    axios
      .post(`http://localhost:8081/api/sellers/approve-seller/${id}`, { status })
      .then(() => {
        alert(`Seller ${status} successfully!`);
        setShops(shops.filter((shop) => shop.id !== id));
      })
      .catch(() => alert("Error updating seller status."));
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6">Approve Sellers</h2>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading sellers...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-600">{error}</p>
      ) : shops.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No sellers pending approval.</p>
      ) : (
        <div className="w-full max-w-6xl">
          {shops.map((shop) => (
            <SellerCard key={shop.id} shop={shop} handleApproval={handleApproval} />
          ))}
        </div>
      )}
    </div>
  );
}

const SellerCard = ({ shop, handleApproval }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full mb-6">
      <h3 className="text-2xl font-bold text-gray-800">{shop.shopName}</h3>
      <p className="text-gray-600 text-lg">{shop.ownerName}</p>
      <p className="text-gray-500">{shop.email}</p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <p><strong>Phone:</strong> {shop.phone}</p>
        <p><strong>Address:</strong> {shop.address}</p>
        <p><strong>Categories:</strong> {shop.categories.join(", ")}</p>
        <p><strong>Custom Category:</strong> {shop.customCategory}</p>
        <p><strong>Location:</strong> {shop.location ? `${shop.location.x}, ${shop.location.y}` : "N/A"}</p>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => handleApproval(shop.id, "approved")}
        >
          Approve
        </button>
        <button
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          onClick={() => handleApproval(shop.id, "rejected")}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default Approve;
