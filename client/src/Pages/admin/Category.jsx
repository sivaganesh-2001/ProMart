import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Categories from "../../components/admin/Categories";

function Category() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <Categories />
    </div>
  );
}

export default Category;