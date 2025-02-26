import React from "react";
import OrderStatusChart from "../../../components/Analytics/OrderStatus";
import MainLayout from "../../../components/layouts/SellerLayout";

const OrderStatusPage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
        <div className="bg-green-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">📦 Order Status Analysis</h1>
          <p className="text-sm mt-1">Monitor the status of your orders in real-time.</p>
        </div>
        <div className="mt-6">
          <OrderStatusChart />
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderStatusPage;
