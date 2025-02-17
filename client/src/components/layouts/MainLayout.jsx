import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
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

const MainLayout = ({ children }) => {
  const location = useLocation(); // Get current route
  const activePage = pageTitles[location.pathname] || "Dashboard"; // Set page title based on route

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar pageTitle={activePage} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
