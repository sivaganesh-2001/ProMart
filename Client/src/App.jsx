import React from 'react';
import './App.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <div className="header-content">
          <div className="logo">zepto</div>
          <div className="delivery-info">
            <span>Delivery in 4 Mins</span>
            <span>Coimbatore, Tamil Nadu</span>
          </div>
          <div className="search-bar">
            <input type="text" placeholder='Search for "cheese slices"' />
          </div>
          <div className="actions">
            <button>Get Pass</button>
            <div>Profile</div>
            <div>Cart</div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="banner">
          <h2>Paan Corner</h2>
          <p>Smoking Accessories, Mints & More</p>
          <button>Order Now</button>
        </div>

        <section className="categories">
          <h3>Grocery & Kitchen</h3>
          <div className="category-items">
            <div>Fruits & Vegetables</div>
            <div>Dairy, Bread & Eggs</div>
            <div>Atta, Rice, Oil & Dals</div>
            <div>Meats, Fish & Eggs</div>
            <div>Masala & Dry Fruits</div>
            <div>Breakfast & Sauces</div>
            <div>Packaged Food</div>
          </div>
        </section>

        <section className="categories">
          <h3>Snacks & Drinks</h3>
          <div className="category-items">
            {/* Add more category items here */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
