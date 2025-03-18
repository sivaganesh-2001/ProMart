import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#82ca9d", "#ff7300"]; // Green for Online, Orange for Offline

const RevenueChart = () => {
  const [salesData, setSalesData] = useState([]);
  const sellerId = localStorage.getItem("sellerEmail");

  useEffect(() => {
    if (sellerId) {
      Promise.all([
        fetch(`http://localhost:8081/api/sales/monthly?sellerId=${sellerId}&type=online`).then((res) => res.json()),
        fetch(`http://localhost:8081/api/sales/monthly?sellerId=${sellerId}&type=offline`).then((res) => res.json()),
      ])
        .then(([onlineData, offlineData]) => {
          const totalOnlineSales = onlineData.reduce((sum, item) => sum + item.totalAmount, 0);
          const totalOfflineSales = offlineData.reduce((sum, item) => sum + item.totalAmount, 0);

          setSalesData([
            { name: "Online Sales", value: totalOnlineSales },
            { name: "Offline Sales", value: totalOfflineSales },
          ]);
        })
        .catch((error) => console.error("Error fetching sales data:", error));
    }
  }, [sellerId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold text-center mb-4">Online vs Offline Sales</h2>
      
      {salesData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={salesData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {salesData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No sales data available</p>
      )}
    </div>
  );
};

export default RevenueChart;
