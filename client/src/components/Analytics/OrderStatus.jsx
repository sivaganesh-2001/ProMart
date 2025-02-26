import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const OrderStatusChart = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);
  const sellerEmail = localStorage.getItem("sellerEmail");
  const [sellerId, setSellerId] = useState(null);

  // Fetch Seller ID
  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        if (!sellerEmail) {
          console.error("No seller email found in local storage");
          return;
        }

        // Fetch Seller ID
        const sellerResponse = await fetch(
          `http://localhost:8081/api/sellers/getId/${sellerEmail}`
        );
        const id = await sellerResponse.text();
        console.log("Fetched Seller ID:", id);
        setSellerId(id);

        if (!id) {
          console.error("Seller ID is null or empty");
        }
      } catch (error) {
        console.error("Error fetching seller ID:", error);
      }
    };

    fetchSellerId();
  }, [sellerEmail]);

  // Fetch Order Status Data once sellerId is available
  useEffect(() => {
    const fetchOrderStatusData = async () => {
      if (!sellerId) return; // Wait until sellerId is available

      try {
        // Fetch Order Status Data
        const statusResponse = await fetch(
          `http://localhost:8081/api/sales/status-count?sellerId=${sellerId}`
        );
        const data = await statusResponse.json();
        console.log("Fetched Order Status Data:", data);

        setOrderStatusData([
          { status: "Pending", count: data["pending"] || 0, color: "#FFBB28"  },
          { status: "Confirmed", count: data["confirmed"] || 0, color: "#0088FE"  },
          { status: "Delivered", count: data["delivered"] || 0, color: "#00C49F"  },
          { status: "Cancelled", count: data["cancelled"] || 0, color: "#FF8042" },
        ]);
      } catch (error) {
        console.error("Error fetching order status data:", error);
      }
    };

    fetchOrderStatusData();
  }, [sellerId]); // This effect runs when sellerId changes

  return(
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Order Status Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={orderStatusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusChart;