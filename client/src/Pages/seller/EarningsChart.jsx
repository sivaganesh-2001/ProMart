import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// Month names for the x-axis
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EarningsOverviewChart = ({ sellerEmail }) => {
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/dashboard/yearly-earnings", { params: { sellerEmail } });

        // Format the data to match the required structure
        const formattedData = response.data.map((item ) => ({
          name: monthNames[item.month - 1], // Convert month number to name
          earnings: item.amount, // Keep earnings amount
        }));

        setMonthlyEarnings(formattedData);
      } catch (error) {
        console.error("Error fetching earnings data", error.response?.data || error.message);
      }
    };

    if (sellerEmail) {
      fetchEarningsData();
    }
  }, [sellerEmail]);

  return (
    <div className="bg-white mt-6 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Earnings Overview (Yearly)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={monthlyEarnings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tick={false} /> {/* Hides numeric labels on Y-axis */}
          <Tooltip />
          <Line type="monotone" dataKey="earnings" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsOverviewChart;