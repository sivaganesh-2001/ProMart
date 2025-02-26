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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const FastSlowMovingProducts = () => {
  const [fastMoving, setFastMoving] = useState([]);
  const [slowMoving, setSlowMoving] = useState([]);

  // Get sellerId from local storage
  const sellerId = localStorage.getItem("sellerEmail");

  useEffect(() => {
    if (sellerId) {
      fetch(`http://localhost:8081/api/sales/fast-moving?sellerId=${sellerId}`)
        .then((res) => res.json())
        .then((data) => setFastMoving(data));

      fetch(`http://localhost:8081/api/sales/slow-moving?sellerId=${sellerId}`)
        .then((res) => res.json())
        .then((data) => setSlowMoving(data));
    }
  }, [sellerId]);

  // Reusable Vertical Bar Chart Component
  const RenderVerticalBarChart = ({ data, title, color }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalQuantitySold" fill={color} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Reusable Pie Chart Component
  const RenderPieChart = ({ data, title, colors }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="totalQuantitySold" nameKey="productName" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Sales Analysis</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Vertical Bar Charts */}
        <RenderVerticalBarChart data={fastMoving} title="Fast Moving Products (Bar Chart)" color="#82ca9d" />
        <RenderVerticalBarChart data={slowMoving} title="Slow Moving Products (Bar Chart)" color="#ff7300" />

        {/* Pie Charts */}
        <RenderPieChart data={fastMoving} title="Fast Moving Products (Pie Chart)" colors={["#82ca9d", "#8884d8", "#ffbb28", "#ff8042"]} />
        <RenderPieChart data={slowMoving} title="Slow Moving Products (Pie Chart)" colors={["#ff7300", "#8884d8", "#ffbb28", "#ff8042"]} />
      </div>
    </div>
  );
};

export default FastSlowMovingProducts;
