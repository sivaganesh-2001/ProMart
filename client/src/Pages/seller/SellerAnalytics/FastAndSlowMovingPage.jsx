import React from "react";
import ProductMovingSpeed from "../../../components/Analytics/FastAndSlowMoving";
import MainLayout from "../../../components/layouts/SellerLayout";

const ProductMovingSpeedPage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
        <div className="bg-green-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">🚀 Product Moving Speed Analysis</h1>
          <p className="text-sm mt-1">Monitor which products are selling fast and which are slow.</p>
        </div>
        <div className="mt-6">
          <ProductMovingSpeed />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductMovingSpeedPage;
