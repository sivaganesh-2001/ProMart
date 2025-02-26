import React, { useEffect, useState } from "react";
import { FaUsers, FaPhone, FaClock, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    customers: 0,
    sellers: 0,
    products: 0,
    approvedSellers: 0,
    category: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [customersRes, sellersRes, productsRes, approvedSellersRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:8081/api/customers/count"),
          axios.get("http://localhost:8081/api/sellers/count"),
          axios.get("http://localhost:8081/api/products/count"),
          axios.get("http://localhost:8081/api/sellers/approve-seller/count"),
          axios.get("http://localhost:8081/api/categories/count"),
        ]);

        setCounts({
          customers: customersRes.data,
          sellers: sellersRes.data,
          products: productsRes.data,
          approvedSellers: approvedSellersRes.data,
          category:categoryRes.data,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex-1 p-6">
      {/* Top Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card 
          title={`${counts.customers} Customers`} 
          icon={<FaUsers />} 
          color="bg-blue-500"  
          onClick={() => navigate("/admin/customers")} 
        />
        <Card 
          title={`${counts.sellers} Sellers`} 
          icon={<FaPhone />} 
          color="bg-green-500" 
          onClick={() => navigate("/admin/sellers")} 
        />
        <Card 
          title={`${counts.products} Products`} 
          icon={<FaList />} 
          color="bg-yellow-500" 
          onClick={() => navigate("/admin/products")}
        />
        <Card 
          title={`${counts.approvedSellers} Sellers for Approval`} 
          icon={<FaClock />} 
          color="bg-blue-500" 
          onClick={() => navigate("/approve-seller")}
        />
        <Card
          title={`${counts.category}  Categories`} // Assuming this is static or fetched elsewhere
          icon={<FaList />}
          color="bg-pink-500"
          onClick={() => navigate("/admin/categories")}
        />
      </div>
    </div>
  );
};

const Card = ({ title, icon, color, onClick }) => (
  <div 
    className={`p-9 rounded-lg text-white flex justify-between items-center shadow-md ${color} cursor-pointer`} 
    onClick={onClick}
  >
    <div>
      <h4 className="text-lg font-semibold">{title}</h4>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

export default Dashboard;