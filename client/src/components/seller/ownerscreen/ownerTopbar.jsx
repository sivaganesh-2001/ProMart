import { Bell, Globe, Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Topbar({ pageTitle }) {
  const [shopName, setShopName] = useState("");
  const [shopImageUrl, setShopImageUrl] = useState("");

  useEffect(() => {
    const fetchShopName = async () => {
      const sellerEmail = localStorage.getItem("sellerEmail"); // Ensure this key matches what you used to store the email
      if (sellerEmail) {
        try {
          const response = await axios.get(`http://localhost:8081/api/sellers/${sellerEmail}`);
          setShopName(response.data.shopName); // Assuming the response contains the shopName
          setShopImageUrl(response.data.shopImageUrl);
        } catch (error) {
          console.error("Error fetching shop name:", error);
        }
      }
    };

    fetchShopName();
  }, []);

  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      <h2 className="text-2xl font-bold">{pageTitle}</h2>
      <div className="flex flex-col items-center">
        {shopName && <h3 className="text-lg font-semibold text-blue-600">{shopName}</h3>} {/* Display shop name */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-2 text-gray-500" />
          <input type="text" placeholder="Search here..." className="pl-8 pr-4 py-2 rounded-md border" />
        </div>
        <Globe className="text-gray-700 cursor-pointer" />
        <Bell className="text-gray-700 cursor-pointer" />
        <div className="flex items-center space-x-2">
          {/* Display the shop image */}
          {shopImageUrl && (
            <img src={shopImageUrl} alt="Shop" className="w-10 h-10 rounded-full" />
          )}
          {/* <img src="./images/shop-image.png" alt="User " className="w-10 h-10 rounded-full" /> */}
          {/* <div>
            <p className="text-sm font-semibold">Shiva</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div> */}
        </div>
      </div>
    </header>
  );
} 