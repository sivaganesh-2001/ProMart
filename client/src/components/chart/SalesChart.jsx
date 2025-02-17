import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [period, setPeriod] = useState("day"); // Default period: Day
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    fetchSellerId();
  }, []);

  useEffect(() => {
    if (sellerId) {
      fetchSalesData();
    }
  }, [sellerId, period]);

  const fetchSellerId = async () => {
    const sellerEmail = localStorage.getItem("sellerEmail");
    if (!sellerEmail) return console.error("Seller email not found!");

    try {
      const response = await axios.get(
        `http://localhost:8081/api/sellers/${sellerEmail}`
      );
      console.log("Seller id:", response.data.id);
      setSellerId(response.data.id);
    } catch (error) {
      console.error("Error fetching seller ID:", error);
    }
  };

  const fetchSalesData = async () => {
    if (!sellerId) return;
    try {
        const sellerEmail = localStorage.getItem("sellerEmail");
      const response = await axios.get(
        `http://localhost:8081/api/sales/fast-moving?s=${sellerEmail}&period=${period}`
      );
      console.log("Sales Response:", response.data);
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const chartData = {
    labels: salesData.map((sale) =>
      new Date(sale.timestamp).toLocaleDateString()
    ), // X-Axis Labels (Dates)
    datasets: [
      {
        label: `Total Sales (${period})`,
        data: salesData.map((sale) => sale.totalAmount), // Y-Axis Data (Sales)
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Sales Report</h2>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            period === "day" ? "bg-blue-700" : "bg-blue-500"
          } text-white`}
          onClick={() => setPeriod("day")}
        >
          Day
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            period === "week" ? "bg-green-700" : "bg-green-500"
          } text-white`}
          onClick={() => setPeriod("week")}
        >
          Week
        </button>
        <button
          className={`px-4 py-2 rounded ${
            period === "month" ? "bg-red-700" : "bg-red-500"
          } text-white`}
          onClick={() => setPeriod("month")}
        >
          Month
        </button>
      </div>
      <Line data={chartData} />
    </div>
  );
};

export default SalesChart;
