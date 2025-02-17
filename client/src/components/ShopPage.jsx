import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import shopsData from "../data/shopsData"; // Mock data or fetch from API

const ShopPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    // Simulate fetching shop details from an API
    const foundShop = shopsData.find((shop) => shop.id === parseInt(id));
    setShop(foundShop);
  }, [id]);

  if (!shop) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>{shop.name} Products</h3>
      <div className="shop-products grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {shop.products
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort products in ascending order
          .map((product) => (
            <div key={product.id} className="product-card border p-4 rounded-lg shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover rounded-lg"
              />
              <h4 className="mt-4 font-semibold">{product.name}</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShopPage;
