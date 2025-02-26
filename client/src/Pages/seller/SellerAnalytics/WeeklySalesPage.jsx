import React from "react";
import WeeklySales from "../../../components/Analytics/WeeklySales";
import MainLayout from "../../../components/layouts/SellerLayout";

const WeeklySalesPage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">📊 Weekly Sales Analysis</h1>
          <p className="text-sm mt-1">Track your sales trends week by week.</p>
        </div>
        <div className="mt-6">
          <WeeklySales />
        </div>
      </div>
    </MainLayout>
  );
};

export default WeeklySalesPage;
