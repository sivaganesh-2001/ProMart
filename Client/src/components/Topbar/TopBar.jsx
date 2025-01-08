import React from "react";
import "./TopBar.css"; // Importing the CSS file

const TopBar = () => {
  return (
    <div className="top-bar">
      {/* Logo */}
      <div className="logo">ProMart</div>

      {/* Delivery Information */}
      <div className="delivery-info">
        <span>Delivery in 4 Mins</span>
        <span className="location">
          Coimbatore, Tamil Nadu <span className="dropdown">&#9662;</span>
        </span>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder='Search for "kurkure"' />
        <span className="search-icon">&#128269;</span>
      </div>

      {/* User Actions */}
      <div className="user-actions">
        <span className="login">Login</span>
        <span className="cart">&#128722;</span>
      </div>
    </div>
  );
};

export default TopBar;
