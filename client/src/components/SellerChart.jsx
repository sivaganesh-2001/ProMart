import React, { useState, useEffect } from "react";
import axios from "axios";

const SalesChart = () => {
  const [shopId, setShopId] = useState(null);
  const sellerEmail = localStorage.getItem("sellerEmail"); // Get seller's email

  useEffect(() => {
    if (!sellerEmail) return;

    const fetchShopId = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/sellers/${sellerEmail}`);
        setShopId(response.data.id); // Assuming response contains shop ID
      } catch (error) {
        console.error("Error fetching shop ID:", error);
      }
    };

    fetchShopId();
  }, [sellerEmail]); 

  if (!shopId) return <p>Loading sales data...</p>;

  // MongoDB Chart URL with dynamic filtering
  const chartUrl = `https://charts.mongodb.com/charts-project-0-fjrmdjg/embed/charts?id=e0173c97-1a77-4ebe-8272-1465312c977e&maxDataAge=60&theme=light&autoRefresh=true&filter={"sellerId":"${sellerEmail}"}`;

  return (
    <div>
      <h2>Sales Analytics</h2>
      <iframe
        title="Sales Chart"
        src={chartUrl}
        width="100%"
        height="400px"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};

export default SalesChart;
