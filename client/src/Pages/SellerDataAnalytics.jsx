import { useState, useEffect } from "react";

const SalesReport = ({ sellerId }) => {
  const [dailySales, setDailySales] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/sales/daily/${sellerId}`)
      .then((res) => res.json())
      .then((data) => setDailySales(data));

    fetch(`http://localhost:8080/api/sales/weekly/${sellerId}`)
      .then((res) => res.json())
      .then((data) => setWeeklySales(data));

    fetch(`http://localhost:8080/api/sales/monthly/${sellerId}`)
      .then((res) => res.json())
      .then((data) => setMonthlySales(data));
  }, [sellerId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Sales Report</h2>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Daily Sales</h3>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Total Sales</th>
              <th className="border px-4 py-2">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {dailySales.map((sale, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{sale._id.day}-{sale._id.month}-{sale._id.year}</td>
                <td className="border px-4 py-2">{sale.totalSales}</td>
                <td className="border px-4 py-2">{sale.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weekly Sales */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Weekly Sales</h3>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Week</th>
              <th className="border px-4 py-2">Total Sales</th>
              <th className="border px-4 py-2">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {weeklySales.map((sale, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">Week {sale._id.week} - {sale._id.year}</td>
                <td className="border px-4 py-2">{sale.totalSales}</td>
                <td className="border px-4 py-2">{sale.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Sales */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Monthly Sales</h3>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Month</th>
              <th className="border px-4 py-2">Total Sales</th>
              <th className="border px-4 py-2">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {monthlySales.map((sale, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{sale._id.month} - {sale._id.year}</td>
                <td className="border px-4 py-2">{sale.totalSales}</td>
                <td className="border px-4 py-2">{sale.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default SalesReport;
