import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ffbb28", "#ff5c8d", "#00c49f"];

const YearlySales = () => {
  const [totalSales, setTotalSales] = useState([]);
  const [onlineSales, setOnlineSales] = useState([]);
  const [offlineSales, setOfflineSales] = useState([]);
  const [chartType, setChartType] = useState("line");

  // Get sellerId from local storage
  const sellerId = localStorage.getItem("sellerEmail");

  // Define the years dynamically
  const currentYear = new Date().getFullYear();
  const pastYears = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);
  }, [currentYear]);

  useEffect(() => {
    if (sellerId) {
      fetchSalesData(`http://localhost:8081/api/sales/yearly?sellerId=${sellerId}`, setTotalSales);
      fetchSalesData(`http://localhost:8081/api/sales/yearly?sellerId=${sellerId}&type=online`, setOnlineSales);
      fetchSalesData(`http://localhost:8081/api/sales/yearly?sellerId=${sellerId}&type=offline`, setOfflineSales);
    }
  }, [sellerId]);

  // Fetch and map sales data to include all years
  const fetchSalesData = (url, setter) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mappedData = pastYears.map((year) => {
          const sales = data.find((item) => parseInt(item.year) === year);
          return {
            year: year.toString(),
            totalAmount: sales ? sales.totalAmount : 0,
          };
        });
        setter(mappedData);
      })
      .catch((err) => console.error("Error fetching sales data:", err));
  };

  // Reusable Chart Component
  const RenderChart = ({ data, title, color }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <ResponsiveContainer width="100%" height={250}>
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalAmount" stroke={color} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAmount" fill={color} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey="totalAmount"
                nameKey="year"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill={color}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Chart Type Selector */}
      <div className="mb-4 flex items-center space-x-4">
        <h2 className="text-lg font-bold">Chart Type:</h2>
        <select
          className="px-3 py-2 border rounded-md"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      {/* Total Sales Chart */}
      <RenderChart data={totalSales} title="Total Sales (Yearly)" color="#8884d8" />

      {/* Online & Offline Sales Charts (Side by Side) */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <RenderChart data={onlineSales} title="Online Sales (Yearly)" color="#82ca9d" />
        <RenderChart data={offlineSales} title="Offline Sales (Yearly)" color="#ff7300" />
      </div>
    </div>
  );
};

export default YearlySales;
