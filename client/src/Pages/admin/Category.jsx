import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Categories from "../../components/admin/Categories";
import AdminTopbar from "../../components/admin/adminTopbar";

function Category() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Topbar */}
      <AdminTopbar />

      {/* Main Content - Sidebar & Categories */}
      <div className="flex flex-1">
        <Sidebar />
        <Categories />
      </div>
    </div>
  );
}

export default Category;
