import React from 'react';
import MainLayout from "../../components/layouts/SellerLayout"; // Main Layout Wrapper
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', earnings: 10000 },
  { name: 'Feb', earnings: 15000 },
  { name: 'Mar', earnings: 20000 },
  { name: 'Apr', earnings: 25000 },
  { name: 'May', earnings: 30000 },
  { name: 'Jun', earnings: 35000 },
  { name: 'Jul', earnings: 40000 },
  { name: 'Aug', earnings: 30000 },
  { name: 'Sep', earnings: 25000 },
  { name: 'Oct', earnings: 30000 },
  { name: 'Nov', earnings: 40000 },
  { name: 'Dec', earnings: 45000 },
];

const revenueSourcesData = [
  { name: 'Direct', value: 400 },
  { name: 'Social', value: 300 },
  { name: 'Referral', value: 300 },
];

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Earnings Monthly */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-600">Earnings (Monthly)</h2>
            <p className="text-3xl">₹70,000</p>
          </div>
          
          {/* Earnings Annual */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-green-600">Earnings (Annual)</h2>
            <p className="text-3xl">₹4,15,000</p>
          </div>

          {/* Tasks */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-pink-600 ">Online Orders</h2>
            <div className="flex items-center">
              <p className="text-3xl mr-2">65%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-orange-500">Pending Orders</h2>
            <p className="text-3xl">18</p>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="bg-white mt-6 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Earnings Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Sources */}
        <div className="bg-white mt-6 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Revenue Sources</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={revenueSourcesData} innerRadius={40} outerRadius={80} fill="#8884d8">
                {
                  revenueSourcesData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index]} />)
                }
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;