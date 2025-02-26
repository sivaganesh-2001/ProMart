import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Home, Shield, ShoppingCart, User, BarChart, Settings, MessageSquare, 
  ChevronDown, ChevronUp 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <Home />, path: "/dashboard" },
  { name: "Products", icon: <Shield />, path: "/products" },
  { name: "Orders", icon: <ShoppingCart />, path: "/orders" },
  { name: "Order History", icon: <User />, path: "/seller-order-history" },
  { name: "Billing", icon: <MessageSquare />, path: "/billing" },
  { name: "Add Products", icon: <Settings />, path: "/add-product" },
];

// Sales Analysis Dropdown Items
const salesAnalysisItems = [
  // { name: "Hourly Sales", path: "/hourly-sales" },
  { name: "Daily Sales", path: "/daily-sales" },
  { name: "Weekly Sales", path: "/weekly-sales" },
  { name: "Monthly Sales", path: "/monthly-sales" },
  { name: "Yearly Sales", path: "/yearly-sales" },
  { name: "Fast & Slow Moving Stocks", path: "/fast-slow-stocks" },
  { name: "Order Status", path: "/order-status" },
  { name: "Sales Mode", path: "/sales-mode" },
];

export default function Sidebar() {
  // Load dropdown state from localStorage
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(
    localStorage.getItem("salesDropdownOpen") === "true"
  );

  // Update localStorage whenever dropdown state changes
  useEffect(() => {
    localStorage.setItem("salesDropdownOpen", isSalesDropdownOpen);
  }, [isSalesDropdownOpen]);

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 overflow-y-auto">
      <ul className="mt-6 space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className="flex items-center p-3 rounded-xl cursor-pointer text-gray-700 hover:bg-indigo-600 hover:text-white"
          >
            <Link to={item.path} className="flex items-center w-full">
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          </li>
        ))}

        {/* Sales Analysis Dropdown */}
        <li
          className="flex items-center justify-between p-3 rounded-xl cursor-pointer text-gray-700 hover:bg-indigo-600 hover:text-white"
          onClick={() => setIsSalesDropdownOpen(!isSalesDropdownOpen)}
        >
          <div className="flex items-center">
            <BarChart />
            <span className="ml-3">Sales Analysis</span>
          </div>
          {isSalesDropdownOpen ? <ChevronUp /> : <ChevronDown />}
        </li>

        {/* Dropdown Items */}
        {isSalesDropdownOpen && (
          <ul className="ml-6 mt-1 space-y-1">
            {salesAnalysisItems.map((item) => (
              <li
                key={item.path}
                className="flex items-center p-2 rounded-lg cursor-pointer text-gray-700 hover:bg-indigo-500 hover:text-white"
              >
                <Link to={item.path} className="flex items-center w-full">
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </ul>
    </aside>
  );
}
