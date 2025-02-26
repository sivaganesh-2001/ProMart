import React from "react";
import MonthlySales from "../../../components/Analytics/MonthlySales";
import MainLayout from "../../../components/layouts/SellerLayout";

const MonthlySalesPage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">📊 Monthly Sales Analysis</h1>
          <p className="text-sm mt-1">Track your sales trends month by month.</p>
        </div>
        <div className="mt-6">
          <MonthlySales />
        </div>
      </div>
    </MainLayout>
  );
};

export default MonthlySalesPage;
