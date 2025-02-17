import React from "react";
import SalesChart from "../../components/chart/SalesChart";

const SellerTimelyDashboard = () => {
  const sellerId = "seller123"; // Replace with dynamic seller ID

  return (
    <div>
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <SalesChart sellerId={sellerId} />
    </div>
  );
};

export default SellerTimelyDashboard;
