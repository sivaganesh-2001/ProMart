import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSellers();
  }, []);

  // Fetch sellers from backend
  const fetchSellers = () => {
    fetch("http://localhost:8081/api/sellers")
      .then((res) => res.json())
      .then((data) => {
        setSellers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sellers:", error);
        toast.error("Failed to load sellers!");
        setLoading(false);
    });
  };

  // Delete seller with confirmation
  const deleteSeller = async (id) => {
    console.log(id);
    if (!window.confirm("Are you sure you want to remove this seller?")) return;

    try {
      const res = await fetch(`http://localhost:8081/api/sellers/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSellers(sellers.filter((seller) => seller.id !== id));
        toast.success("Seller removed successfully!");
      } else {
        toast.error("Failed to remove seller.");
      }
    } catch (error) {
      console.error("Error deleting seller:", error);
      toast.error("Error deleting seller.");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-800 text-center mt-4 mb-6">
        Sellers
      </h2>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Search sellers..."
          className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-md text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute right-4 top-4 text-gray-400 text-lg" />
      </div>

      {/* Seller Table */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-6 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
          </div>
        ) : sellers.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No Sellers Found</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-center text-lg border-collapse">
              <thead className="bg-green-500 text-white">
                <tr>
                  <th className="p-4 border-b text-lg">Shop Image</th>
                  <th className="p-4 border-b text-lg">Shop Name</th>
                  <th className="p-4 border-b text-lg">Seller Name</th>
                  <th className="p-4 border-b text-lg">Mobile No</th>
                  <th className="p-4 border-b text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers
                  .filter((seller) =>
                    seller.shopName.toLowerCase().includes(search.toLowerCase()) ||
                    seller.ownerName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((seller, index) => (
                    <tr
                      key={seller.id}
                      className={`border-b hover:bg-gray-100 transition duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4">
                        <img
                          src={seller.shopImageUrl}
                          alt={seller.shopName}
                          className="h-16 w-16 object-cover rounded-lg shadow-md mx-auto"
                        />
                      </td>
                      <td className="p-4">{seller.shopName}</td>
                      <td className="p-4">{seller.ownerName}</td>
                      <td className="p-4">{seller.phone}</td>
                      <td className="p-4">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md flex items-center justify-center space-x-2 text-lg transition transform hover:scale-105"
                          onClick={() => deleteSeller(seller.id)}
                        >
                          <FaTrashAlt className="text-lg" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sellers;
