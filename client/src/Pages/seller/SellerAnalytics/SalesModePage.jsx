import React from "react";
import SalesComparisonChart from "../../../components/Analytics/SalesMode";
import MainLayout from "../../../components/layouts/SellerLayout";

const SalesModePage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">📊 Online vs Offline Sales Analysis</h1>
          <p className="text-sm mt-1">Track your sales trends</p>
        </div>
        <div className="mt-6">
          <SalesComparisonChart />
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesModePage;
