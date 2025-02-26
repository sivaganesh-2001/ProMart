import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../seller/ownerscreen/ownerSidebar";
import Topbar from "../seller/ownerscreen/ownerTopbar";
import Footer from "../Footer";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/orders": "Orders",
  "/seller-order-history": "Order History",
  "/seller-analytics": "Sales Analysis",
  "/billing": "Billing",
  "/add-product": "Add Products",
};

const SellerLayout = ({ children }) => {
  const location = useLocation();
  const activePage = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar should take full width */}
      <Topbar />

      <div className="flex flex-1">
        {/* Sidebar below Topbar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default SellerLayout;
