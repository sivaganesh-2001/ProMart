import React from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col p-4">
      <h2 className="text-xl font-bold text-blue-500 mb-5">Admin Panel</h2>
      <ul>
        <li>
          <NavLink 
            to="/admin-dashboard"
            className={({ isActive }) => 
              `p-3 flex items-center gap-3 text-gray-700 rounded-lg ${
                isActive ? "bg-gray-300" : "hover:bg-gray-200"
              }`
            }
          >
            <FaChartBar /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/approve-seller"
            className={({ isActive }) => 
              `p-3 flex items-center gap-3 text-gray-700 rounded-lg ${
                isActive ? "bg-gray-300" : "hover:bg-gray-200"
              }`
            }
          >
            <FaUsers /> Approve Seller
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
