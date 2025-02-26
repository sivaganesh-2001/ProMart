import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../admin/AdminSidebar"; // Admin Sidebar
import Topbar from "../admin/AdminTopbar"; // Admin Topbar
import Footer from "../Footer"; // Footer

const pageTitles = {
  "/admin-dashboard": "Admin Dashboard",
  "/approve-seller": "Approve Sellers",
  "/admin/categories": "Manage Categories",
};

const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
       
        <div className="p-6">{children}</div>
     
      </div>
    </div>
  );
};

export default AdminLayout;
