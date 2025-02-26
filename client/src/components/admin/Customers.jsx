import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers from the backend
  const fetchCustomers = () => {
    fetch("http://localhost:8081/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers!");
        setLoading(false);
      });
  };

  // Delete customer with confirmation modal
  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to remove this customer?")) return;

    try {
      const res = await fetch(`http://localhost:8081/api/customers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCustomers(customers.filter((customer) => customer.id !== id));
        toast.success("Customer removed successfully!");
      } else {
        toast.error("Failed to remove customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error deleting customer.");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Title Section */}
      <h2 className="text-4xl font-bold text-gray-800 text-center mt-4 mb-6">
        Customers
      </h2>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-md text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute right-4 top-4 text-gray-400 text-lg" />
      </div>

      {/* Customer Table */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-6 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
          </div>
        ) : customers.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No Customers Found</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-center text-lg border-collapse">
              <thead className="bg-green-500 text-white">
                <tr>
                  <th className="p-4 border-b text-lg">Name</th>
                  <th className="p-4 border-b text-lg">Email</th>
                  <th className="p-4 border-b text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers
                  .filter((customer) =>
                    customer.customerName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((customer, index) => (
                    <tr
                      key={customer.id}
                      className={`border-b hover:bg-gray-100 transition duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4">{customer.customerName}</td>
                      <td className="p-4">{customer.customerEmail}</td>
                      <td className="p-4">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md flex items-center justify-center space-x-2 text-lg transition transform hover:scale-105"
                          onClick={() => deleteCustomer(customer.id)}
                        >
                          <FaTrashAlt className="text-lg" />
                          <span>Delete</span>
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

export default Customers;
