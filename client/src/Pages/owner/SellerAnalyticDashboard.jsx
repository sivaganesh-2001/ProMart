import React from "react";
import SalesChart from "../../components/SellerChart";
import MainLayout from "../../components/layouts/MainLayout";

const SellerAnalyticDashboard = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">📊 Sales Analytics</h1>
          <p className="text-sm mt-1">Gain insights into your sales performance.</p>
        </div>

        {/* Sales Chart Section */}
        <div className="mt-6">
          <SalesChart />
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerAnalyticDashboard;
