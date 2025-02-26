import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState({}); // To store seller details

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/products");
        const productsData = response.data;
        
        console.log("Fetched Products:", productsData); // Debugging Step 1
  
        setProducts(productsData);
  
        // Check if sellerId is present
        const sellerIds = [...new Set(productsData.map(product => product.sellerId))];
        console.log("Extracted Seller IDs:", sellerIds); // Debugging Step 2
  
        // Fetch seller details for each sellerId
        const sellerPromises = sellerIds.map(async (sellerId) => {
          try {
            const sellerResponse = await axios.get(`http://localhost:8081/api/sellers/id/${sellerId}`);
            return { sellerId, shopName: sellerResponse.data.shopName };
          } catch (error) {
            console.error(`Error fetching seller ${sellerId}:`, error);
            return { sellerId, shopName: "Unknown Shop" }; // Prevent crash
          }
        });
  
        const sellerResponses = await Promise.all(sellerPromises);
  
        // Map sellerId to shopName
        const sellersData = {};
        sellerResponses.forEach(({ sellerId, shopName }) => {
          sellersData[sellerId] = shopName;
        });
  
        console.log("Mapped Seller Data:", sellersData); // Debugging Step 3
  
        setSellers(sellersData);
      } catch (error) {
        console.error("Error fetching products or sellers:", error);
      }
    };
  
    fetchProducts();
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Products</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="border border-gray-300 px-4 py-2">Shop Name</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Brand</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Price (₹)</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{sellers[product.sellerId] || "Loading..."}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <img src={product.imageUrl} alt={product.productName} className="h-16 w-16 object-cover" />
                </td>
                <td className="border border-gray-300 px-4 py-2">{product.productName}</td>
                <td className="border border-gray-300 px-4 py-2">{product.brand}</td>
                <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                <td className="border border-gray-300 px-4 py-2 font-bold">₹{product.price.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py -2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;