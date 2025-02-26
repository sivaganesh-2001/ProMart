import React from "react";
import YearlySales from "../../../components/Analytics/YearlySales";
import MainLayout from "../../../components/layouts/SellerLayout";

const YearlySalesPage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">📊 Yearly Sales Analysis</h1>
          <p className="text-sm mt-1">Track your sales trends year by year.</p>
        </div>
        <div className="mt-6">
          <YearlySales />
        </div>
      </div>
    </MainLayout>
  );
};

export default YearlySalesPage;
