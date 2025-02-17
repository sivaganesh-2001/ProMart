import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/seller/ownerscreen/ownerSidebar";
import Topbar from "../components/seller/ownerscreen/ownerSidebar";
import Dashboard from "../Pages/owner/Dashboard";
import Products from "../Pages/owner/Products";
import Customers from "../Pages/owner/Customers";
import Orders from "../Pages/owner/Orders";
import Overview from "../Pages/owner/Analysis";
import Billing from "../Pages/owner/Billing";
import AddProduct from "../Pages/owner/AddProducts";

function SellerRoutes() {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="w-16 md:w-60">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/owner/*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default SellerRoutes;
