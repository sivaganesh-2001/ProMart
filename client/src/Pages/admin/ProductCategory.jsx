import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import ProductCategories from "../../components/admin/ProductCategories";
import AdminTopbar from "../../components/admin/adminTopbar";

function ProductCategoryPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Topbar */}
      <AdminTopbar />

      {/* Main Content - Sidebar & Product Categories */}
      <div className="flex flex-1">
        <Sidebar />
        <ProductCategories />
      </div>
    </div>
  );
}

export default ProductCategoryPage;
