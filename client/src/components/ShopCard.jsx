import React from "react";
import "./../styles/ShopCard.css";

const ShopCard = ({ shop, onClick }) => {
  return (
    <div className="shop-card" onClick={onClick}>
      <img src={shop.shopImageUrl} alt={shop.shopName} className="shop-image" />
      <div className="shop-info">
        <h3>{shop.shopName || "Unnamed Shop"}</h3>
        <p>
        ⭐ {shop.rating || "4.5"} |  {shop.distance} away📍
        </p>
      </div>
    </div>
  );
};

export default ShopCard;
