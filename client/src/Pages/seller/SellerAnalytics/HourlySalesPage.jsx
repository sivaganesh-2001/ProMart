import React from "react";
import HourlySales from "../../../components/Analytics/HourlySales"; // Importing the component
import MainLayout from "../../../components/layouts/SellerLayout.jsx"; // Using SellerLayout

const HourlySalesPage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">📊 Hourly Sales Analysis</h1>
          <p className="text-sm mt-1">Track your Hourly Sales trends per hour.</p>
        </div>

        {/* Hourly Sales Chart Section */}
        <div className="mt-6">
          <HourlySales />
        </div>
      </div>
    </MainLayout>
  );
};

export default HourlySalesPage;
