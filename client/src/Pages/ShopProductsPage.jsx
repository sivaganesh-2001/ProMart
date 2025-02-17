import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ShopProductsPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const shopResponse = await axios.get(
          `http://localhost:8081/api/sellers/id/${shopId}`
        );
        setShop(shopResponse.data);

        const productsResponse = await axios.get(
          `http://localhost:8081/api/sellers/${shopId}/products`
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching shop and products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  if (loading) return <div>Loading shop details and products...</div>;
  if (!shop) return <div>Shop not found</div>;

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
        {shop?.shopName} - Products
      </h2>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search Products..."
          className="border px-4 py-2 rounded-md w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/shop/${shopId}/product/${product.id}`)}
          >
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="h-40 w-full object-cover rounded-lg"
            />
            <div className="flex justify-between items-center mt-2">
              <h3 className="font-semibold text-lg">{product.productName}</h3>
              <p className="text-lg font-bold text-green-600">₹{product.price}</p>
            </div>
            <p className="text-gray-600">Brand: {product.brand}</p> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopProductsPage;
