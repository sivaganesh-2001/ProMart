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

const COLORS = ["#0088FE", "#FF8042"]; // Online vs Offline colors

const SalesComparisonChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [timeFrame, setTimeFrame] = useState("month");
  const [salesMetric, setSalesMetric] = useState("orderCount"); // Default metric: Order Count

  const sellerId = localStorage.getItem("sellerEmail");

  useEffect(() => {
    if (sellerId) {
      fetch(
        `http://localhost:8081/api/sales/compare-online-offline?sellerId=${sellerId}&timeFrame=${timeFrame}&metric=${salesMetric}`
      )
        .then((res) => res.json())
        .then((data) => setSalesData(data))
        .catch((error) => console.error("Error fetching sales data:", error));
    }
  }, [sellerId, timeFrame, salesMetric]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Online vs Offline Sales</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        {/* Time Frame Selector */}
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold">Time Frame:</h2>
          <select
            className="px-3 py-2 border rounded-md"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        {/* Sales Metric Selector */}
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold">Metric:</h2>
          <select
            className="px-3 py-2 border rounded-md"
            value={salesMetric}
            onChange={(e) => setSalesMetric(e.target.value)}
          >
            <option value="orderCount">Order Count</option>
            <option value="totalAmount">Total Sales Amount</option>
          </select>
        </div>

        {/* Chart Type Selector */}
        <div className="flex items-center space-x-2">
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
      </div>

      {/* Render Charts Dynamically */}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === "line" ? (
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="onlineSales"
              stroke="#0088FE"
              name="Online Sales"
            />
            <Line
              type="monotone"
              dataKey="offlineSales"
              stroke="#FF8042"
              name="Offline Sales"
            />
          </LineChart>
        ) : chartType === "bar" ? (
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="onlineSales" fill="#0088FE" name="Online Sales" />
            <Bar dataKey="offlineSales" fill="#FF8042" name="Offline Sales" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={[
                {
                  name: "Online Sales",
                  value: salesData.reduce(
                    (sum, d) => sum + d.onlineSales,
                    0
                  ),
                },
                {
                  name: "Offline Sales",
                  value: salesData.reduce(
                    (sum, d) => sum + d.offlineSales,
                    0
                  ),
                },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              <Cell key="online" fill="#0088FE" />
              <Cell key="offline" fill="#FF8042" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SalesComparisonChart;
