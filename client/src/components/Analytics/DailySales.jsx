import React, { useEffect, useState } from "react";
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

const DailySales = () => {
  const [totalSales, setTotalSales] = useState([]);
  const [onlineSales, setOnlineSales] = useState([]);
  const [offlineSales, setOfflineSales] = useState([]);
  const [chartType, setChartType] = useState("line");

  const sellerId = localStorage.getItem("sellerEmail");

  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    }
    return days;
  };

  useEffect(() => {
    if (sellerId) {
      fetch(`http://localhost:8081/api/sales/daily?sellerId=${sellerId}`)
        .then((res) => res.json())
        .then((data) => mapSalesData(data, setTotalSales));

      fetch(`http://localhost:8081/api/sales/daily?sellerId=${sellerId}&type=online`)
        .then((res) => res.json())
        .then((data) => mapSalesData(data, setOnlineSales));

      fetch(`http://localhost:8081/api/sales/daily?sellerId=${sellerId}&type=offline`)
        .then((res) => res.json())
        .then((data) => mapSalesData(data, setOfflineSales));
    }
  }, [sellerId]);

  const mapSalesData = (data, setter) => {
    const last30Days = getLast30Days();
    const mappedData = last30Days.map((day) => {
      const sales = data.find((item) => item.date === day.date);
      return {
        day: day.day,
        totalAmount: sales ? sales.totalAmount : 0,
      };
    });
    setter(mappedData);
  };

  const RenderChart = ({ data, title, color }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <ResponsiveContainer width="100%" height={250}>
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalAmount" stroke={color} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
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
                nameKey="day"
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
      <RenderChart data={totalSales} title="Total Sales (Monthly)" color="#8884d8" />
      <div className="grid grid-cols-2 gap-4 mt-6">
        <RenderChart data={onlineSales} title="Online Sales (Monthly)" color="#82ca9d" />
        <RenderChart data={offlineSales} title="Offline Sales (Monthly)" color="#ff7300" />
      </div>
    </div>
  );
};

export default DailySales;
