import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/SellerLayout";
import EarningsOverviewChart from "./EarningsChart"; // Import the EarningsOverviewChart component
import RevenueChart from "./RevenueChart"; // Import the new RevenueChart component
import axios from "axios";

const Dashboard = () => {
  const [earnings, setEarnings] = useState(0);
  const [billings, setBillings] = useState(0);
  const [onlineOrders, setOnlineOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const sellerEmail = localStorage.getItem("sellerEmail");
        if (!sellerEmail) {
          console.error("Seller email not found in local storage");
          return;
        }

        const sellerRes = await axios.get(`http://localhost:8081/api/sellers/${sellerEmail}`);
        const sellerId = sellerRes.data.id;

        if (!sellerId) {
          console.error("Seller ID not found");
          return;
        }

        // Fetch dashboard data
        const params = { sellerEmail };
        const earningsRes = await axios.get("http://localhost:8081/api/dashboard/earnings", { params });
        const billingsRes = await axios.get("http://localhost:8081/api/dashboard/billings", { params });
        const onlineOrdersRes = await axios.get("http://localhost:8081/api/dashboard/online-orders", { params });

        // Fetch pending orders using sellerId
        const pendingOrdersRes = await axios.get("http://localhost:8081/api/dashboard/pending-orders", { params: { sellerId } });

        setEarnings(earningsRes.data.amount);
        setBillings(billingsRes.data.amount);
        setOnlineOrders(onlineOrdersRes.data.percentage);
        setPendingOrders(pendingOrdersRes.data.count);
      } catch (error) {
        console.error("Error fetching dashboard data", error.response?.data || error.message);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto p-6 bg-gray-100">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-600">Earnings (Monthly)</h2>
            <p className="text-3xl">₹{earnings}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-green-600">Billings (Monthly)</h2>
            <p className="text-3xl">{billings}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-pink-600">Online Orders</h2>
            <div className="flex items-center">
              <p className="text-3xl mr-2">{onlineOrders}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${onlineOrders}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-orange-500">Pending Orders</h2>
            <p className="text-3xl">{pendingOrders}</p>
          </div>
        </div>

        {/* Earnings Overview Chart */}
        <EarningsOverviewChart sellerEmail={localStorage.getItem("sellerEmail")} />

        {/* Revenue Sources Pie Chart */}
        <RevenueChart />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
