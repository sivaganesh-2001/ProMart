import React, { useState } from "react";

const RecommendationCarousel = ({ recommendations, loading, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, recommendations.length - 3));
  };

  if (loading) {
    return (
      <div className="text-center text-lg">Loading recommendations...</div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No recommendations available
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * (100 / 3)}%)`,
          }}
        >
          {recommendations.map((rec) => (
            <div
              key={rec.masterId}
              className="flex-shrink-0 w-1/3 px-2 cursor-pointer"
              onClick={() =>
                navigate(`/shops/${rec.shopId || "unknown"}/products/${rec.productId}`)
              }
            >
              <div className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition">
                <img
                  src={rec.imageUrl || "https://via.placeholder.com/150"}
                  alt={rec.productName || "Product"}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold truncate">
                  {rec.productName || "Unknown Product"}
                </h3>
                <p className="text-gray-600">
                  ₹{(typeof rec.price === "number" ? rec.price : 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{rec.shopName || "Unknown Shop"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {recommendations.length > 3 && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= recommendations.length - 3}
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full ${
              currentIndex >= recommendations.length - 3 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
          >
            →
          </button>
        </>
      )}
    </div>
  );
};

export default RecommendationCarousel;