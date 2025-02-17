import React from "react";
import { FaUsers, FaPhone, FaClock, FaList } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="flex-1 p-6">
      {/* Top Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="368 Users" icon={<FaUsers />} color="bg-blue-500" />
        <Card title="86 Sellers" icon={<FaPhone />} color="bg-green-500" />
        <Card title="590 Products" icon={<FaList />} color="bg-yellow-500" />
        <Card title="9 Sellers for Approval" icon={<FaClock />} color="bg-blue-500" />
        <Card title="40 Categories" icon={<FaList />} color="bg-pink-500" />
      </div>

      {/* Graph Section */}
     
    </div>
  );
};

const Card = ({ title, icon, color }) => (
  <div className={`p-9 rounded-lg text-white flex justify-between items-center shadow-md ${color}`}>
    <div>
      <h4 className="text-lg font-semibold">{title}</h4>
      {/* <button className="text-xs mt-2 bg-white text-black px-3 py-1 rounded-md">Show Details</button> */}
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

export default Dashboard;
