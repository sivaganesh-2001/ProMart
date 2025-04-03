import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../Redux/Cart/cart.actions";
import styles from "../styles/Cart.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function Cart() {
  const [cartData, setCartData] = useState({});
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopDetails, setShopDetails] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("customerEmail"); // Get user email from localStorage

  useEffect(() => {
    if (userEmail) {
      fetchCartData();
    }
  }, [userEmail]);

  // Fetch cart details from backend
  const fetchCartData = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/cart/${userEmail}`);
      if (response.data && response.data.shops) {
        setCartData(response.data.shops);
        console.log(response.data);
        fetchShopDetails(Object.keys(response.data.shops));
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Fetch shop details using shop IDs
  const fetchShopDetails = async (shopIds) => {
    console.log(shopIds);
    try {
      const responses = await Promise.all(
        shopIds.map((shopId) => axios.get(`http://localhost:8081/api/shops/${shopId}`))
        
      );
   
      const shopData = responses.map((res) => res.data);
      setShopDetails(shopData);
    } catch (error) {
      console.error("Error fetching shop details:", error);
    }
  };

  // Handle shop selection
  const handleShopSelect = (shopId) => {
    setSelectedShop(shopId === selectedShop ? null : shopId);
  };


  const handleOrderPage = (shop) => {
    const shopId = shop.id;
    console.log('shopId',shopId);
    const selectedProducts = cartData[shopId] || {}; // Get products for the selected shop
  
    navigate("/order", { state: { shop, selectedProducts, shopId } });
  };
  

  return (
    <div className="flex flex-col bg-[#F5F1F7] h-[100vh]">
      <div className="flex pl-[13%] pt-4 pb-3">
        <h2 className="text-[24px] font-semibold">Cart</h2>
      </div>

      {shopDetails.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* Display Shop Cards */}
          {shopDetails.map((shop) => {
            const shopId = shop.id;
            const products = cartData[shopId] || {};
            const totalItems = Object.values(products).reduce((sum, qty) => sum + qty, 0);
            const totalCost = Object.entries(products).reduce((sum, [productId, qty]) => {
              const product = shop.products.find((p) => p.id === productId);
              return sum + (product ? product.price * qty : 0);
            }, 0);

            return (
              <div
                key={shopId}
                className="border shadow-lg p-4 w-[80%] bg-white rounded-lg cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4" onClick={() => handleShopSelect(shopId)}>
                    <img src={shop.shopImageUrl} alt={shop.shopName} className="h-16 w-16 rounded" />
                    <div>
                      <h3 className="font-semibold text-lg">{shop.shopName}</h3>
                      <p className="text-gray-500">{totalItems} items • ₹{totalCost}</p>
                    </div>
                  </div>
                  {/* "Update & Order" Button */}
                  <button
                    className="bg-[#f61571] text-white px-4 py-2 rounded-lg"
                    onClick={() => handleOrderPage(shop)}
                  >
                    Update & Order
                  </button>
                </div>

                {/* Show Product List if Shop is Selected */}
                {selectedShop === shopId && (
                  <div className="mt-4 border-t pt-4">
                    {Object.entries(products).map(([productId, qty]) => {
                      const product = shop.products.find((p) => p.id === productId);
                      return (
                        product && (
                          <div key={productId} className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-4">
                              <img src={product.imageUrl} alt={product.productName} className="h-12 w-12 rounded" />
                              <p>{product.productName}</p>
                            </div>
                            <p>Qty: {qty}</p>
                            <p>Price : ₹{qty * product.price}</p>
                          </div>
                        )
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Cart;
