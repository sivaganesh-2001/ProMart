import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Home, Shield, ShoppingCart, User, BarChart, Settings, LogOut, MessageSquare } from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <Home />, path: "/dashboard" },
  { name: "Products", icon: <Shield />, path: "/products" },
  { name: "Orders", icon: <ShoppingCart />, path: "/orders" },
  { name: "Order History", icon: <User />, path: "/seller-order-history" },
  { name: "Sales Analysis", icon: <BarChart />, path: "/seller-analytics" },
  { name: "Billing", icon: <MessageSquare />, path: "/billing" },
  { name: "Add Products", icon: <Settings />, path: "/add-product" },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();

   


    // Redirect to login
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4">
      <h2 className="text-2xl font-bold text-indigo-600">ProMart</h2>
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
      </ul>

      <div className="absolute bottom-6 left-4">
        <button className="flex items-center text-red-600" onClick={handleLogout}>
          <LogOut className="mr-2" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
