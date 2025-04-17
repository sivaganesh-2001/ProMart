import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddToCartButton from "../components/AddToCartButton";
import RecommendationCarousel from "../components/RecommendationCarousel";

const ProductDetailsPage = () => {
  const { shopId, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [masterProduct, setMasterProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [shopNames, setShopNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);

  // Haversine Formula for Distance Calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Load user coordinates
  useEffect(() => {
    const storedCoordinates = localStorage.getItem("userCoordinates");
    if (storedCoordinates) {
      const { latitude, longitude } = JSON.parse(storedCoordinates);
      setUserLocation({ latitude, longitude });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          localStorage.setItem("userCoordinates", JSON.stringify(location));
        },
        (error) => {
          console.error("Error getting geolocation", error);
          setUserLocation({ latitude: 0, longitude: 0 });
        }
      );
    } else {
      setUserLocation({ latitude: 0, longitude: 0 });
    }
  }, []);

  // Fetch all data once userLocation is set
  useEffect(() => {
    if (!userLocation) return;

    const fetchData = async () => {
      setLoading(true);
      setRecLoading(true);

      let localShops = [];
      let localShopNames = {};

      // Fetch nearby shops first
      try {
        const response = await axios.get(
          `http://localhost:8081/api/sellers/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`
        );
        const shopsWithDistance = response.data.map((shop) => ({
          ...shop,
          distance: calculateDistance(userLocation.latitude, userLocation.longitude, shop.location.y, shop.location.x),
        }));
        localShops = shopsWithDistance.filter((shop) => shop.distance <= 30);
        localShopNames = {};
        localShops.forEach((shop) => {
          localShopNames[shop.id] = shop.shopName;
        });
        setShops(localShops);
        setShopNames(localShopNames);
      } catch (error) {
        console.error("Error fetching nearby shops:", error);
        toast.error("Failed to fetch nearby shops.");
      }

      // Fetch product details
      try {
        const productResponse = await axios.get(
          `http://localhost:8081/api/products/${productId}`
        );
        const productData = productResponse.data;
        console.log("Product data:", productData);
        setProduct(productData);

        // Fetch MasterProduct and MBA recommendations
        if (productData.masterId) {
          const masterResponse = await axios.get(
            `http://localhost:8081/api/products/master/${productData.masterId}`
          );
          console.log("Master product:", masterResponse.data);
          setMasterProduct(masterResponse.data);

          try {
            const mbaResponse = await axios.post(
              `http://localhost:8081/api/mba/predict`,
              { masterIds: [productData.masterId] },
              { headers: { "Content-Type": "application/json" } }
            );
            console.log("MBA response:", mbaResponse.data);
            const recMasterIds = mbaResponse.data.recommendations?.slice(0, 20) || [];

            // Validate masterIds and get productIds
            let allProductIds = [];
            for (const masterId of recMasterIds) {
              try {
                const masterProdResponse = await axios.get(
                  `http://localhost:8081/api/products/master/${masterId}`
                );
                const masterProd = masterProdResponse.data;
                console.log(`MasterProduct ${masterId}:`, masterProd);
                if (masterProd?.productIds?.length > 0) {
                  allProductIds.push(...masterProd.productIds);
                }
              } catch (error) {
                console.warn(`MasterProduct ${masterId} not found:`, error);
              }
            }
            console.log("All productIds:", allProductIds);

            // Fetch products
            if (allProductIds.length > 0) {
              const productsResponse = await axios.get(
                `http://localhost:8081/api/products/id`,
                {
                  params: { ids: allProductIds },
                  paramsSerializer: (params) => `ids=${params.ids.join("&ids=")}`,
                }
              );
              console.log("Fetched products:", productsResponse.data);
              let recProducts = productsResponse.data;

              // Filter by nearby shops
              if (localShops.length > 0) {
                const nearbySellerIds = localShops.map((shop) => shop.id);
                recProducts = recProducts.filter((prod) =>
                  prod.sellerId && nearbySellerIds.includes(prod.sellerId)
                );
                console.log("Filtered nearby products:", recProducts);
              }

              // Add shopName and distance
              recProducts = recProducts.map((prod) => ({
                ...prod,
                shopName: localShopNames[prod.sellerId] || "Unknown Shop",
                distance: localShops.find((s) => s.id === prod.sellerId)?.distance || null,
              }));

              // Limit to 10 for display
              setRecommendations(recProducts.slice(0, 10));
            }
          } catch (mbaError) {
            console.error("Error fetching MBA recommendations:", mbaError);
            toast.error("Failed to load recommendations.");
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
        setRecLoading(false);
      }
    };

    fetchData();
  }, [userLocation, productId, shopId]);

  // Update recommendations when shopNames changes
  useEffect(() => {
    if (recommendations.length > 0 && Object.keys(shopNames).length > 0) {
      const updatedRecommendations = recommendations.map((prod) => ({
        ...prod,
        shopName: shopNames[prod.sellerId] || prod.shopName || "Unknown Shop",
      }));
      setRecommendations(updatedRecommendations);
    }
  }, [shopNames]);

  if (loading || recLoading) return <div className="text-center text-lg">Loading...</div>;
  if (!product) return <div className="text-center text-lg text-red-500">No Product found</div>;

  // Determine stock status
  let stockStatus, stockColor;
  if (product.stock === 0) {
    stockStatus = "Out of Stock";
    stockColor = "bg-red-500";
  } else if (product.stock > 0 && product.stock <= 20) {
    stockStatus = "Low Stock";
    stockColor = "bg-orange-500";
  } else {
    stockStatus = "In Stock";
    stockColor = "bg-green-500";
  }

  // Render star rating
  const renderStarRating = (averageRating) => {
    const stars = [];
    const roundedRating = Math.round(averageRating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-2xl ${i <= roundedRating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      {/* Product Details Card */}
      <div className="shadow-lg rounded-lg bg-white relative mb-10">
        <div className={`absolute top-4 right-4 text-white px-4 py-1 rounded-md text-sm font-semibold ${stockColor}`}>
          {stockStatus}
        </div>
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="w-full md:w-1/2">
            <img
              src={product.imageUrl || "https://via.placeholder.com/300"}
              alt={product.productName}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold">{product.productName}</h1>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Brand:</span> {product.brand || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Quantity:</span> {product.netQuantity || 1} {product.unit || ""}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-4">
              <span className="font-semibold">Price:</span> ₹{(product.price || 0).toFixed(2)}
            </p>
            {masterProduct && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Average Rating:</span>
                <div className="flex">
                  {renderStarRating(masterProduct.averageRating)}
                </div>
                <span className="text-gray-600 text-sm">
                  {(masterProduct.averageRating || 0).toFixed(1)} ({masterProduct.totalRatings || 0})
                </span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <AddToCartButton
                product={product}
                shopId={shopId}
                stockStatus={stockStatus}
              />
              <button
                onClick={() => navigate("/cart")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold transition"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Carousel */}
      <div className="mt-10">
        <h2 className="text-md sm:text-xl font-semibold py-2">Frequently Bought Together (Nearby)</h2>
        <RecommendationCarousel
          recommendations={recommendations}
          loading={recLoading}
          navigate={navigate}
          shopNames={shopNames}
        />
      </div>
    </div>
  );
};

export default ProductDetailsPage;