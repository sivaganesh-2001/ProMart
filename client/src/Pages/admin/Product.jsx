import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Products from "../../components/admin/Products";

function Product() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <Products />
    </div>
  );
}

export default Product;