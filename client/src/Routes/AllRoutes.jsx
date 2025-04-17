import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import ProtectedCustomerRoute from '../components/ProtectedCustomerRoute';
import ProtectedSellerRoute from '../components/ProtectedSellerRoute';

// Pages
import Home from '../Pages/Home';
import SignUp from '../Pages/SignUp';
import Login from '../Pages/Login';
import RecommendedProductsPage from '../Pages/RecommendedProductsPage';
import Cart from '../Pages/Cart';
import UserAccount from '../Pages/UserAccount';

import OrderReview from '../Pages/OrderReviewPage';
import OrderReviewPayment from '../Pages/OrderReviewPagePayment';
import OrderPage from '../Pages/OrderPage';
import SearchedProductsPage from '../Pages/SearchedProductsPage';
// Shop Pages
import ExploreShops from '../components/ExploreShops/ExploreShops';
import AllShopsPage from '../Pages/AllShopPage';
import ShopProductsPage from '../Pages/ShopProductsPage';
import ProductDetailsPage from '../Pages/ProductDetailsPage';
import { CategoryShops } from '../components';

// Seller Pages
import Dashboard from '../Pages/seller/Dashboard';
import Products from '../Pages/seller/Products';
import OrderHistory from '../Pages/seller/SellerOrderHistory';
import Orders from '../Pages/seller/Orders';
import Overview from '../Pages/seller/Analysis';
import Billing from '../Pages/seller/Billing';
import AddProduct from '../Pages/seller/AddProducts';
import HourlySalesPage from '../Pages/seller/SellerAnalytics/HourlySalesPage';
import DailySalesPage from '../Pages/seller/SellerAnalytics/DailySalesPage';
import WeeklySalesPage from '../Pages/seller/SellerAnalytics/WeeklySalesPage';
import MonthlySalesPage from '../Pages/seller/SellerAnalytics/DailySalesPage';
import YearlySalesPage from '../Pages/seller/SellerAnalytics/YearlySalesPage';
import OrderStatusPage from '../Pages/seller/SellerAnalytics/OrderStatusPage';
import ProductMovingSpeedPage from '../Pages/seller/SellerAnalytics/FastAndSlowMovingPage';
import SalesModePage from '../Pages/seller/SellerAnalytics/SalesModePage';
// import SellerAnalyticDashboard from '../Pages/owner/SellerAnalyticDashboard';
// import SellerTimelyDashboard from '../Pages/Analytics/SellerDashboard';
// Admin Pages
import AdminHome from '../Pages/admin/AdminHome';
import Approve from '../Pages/admin/Approve';
import Category from '../Pages/admin/Category';
import Customer from '../Pages/admin/Customers';
import Seller from '../Pages/admin/Sellers';
import Product from '../Pages/admin/Product'
import ProductCategoryPage from '../Pages/admin/ProductCategory';
function AllRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      <Route path="/shop" element={<ExploreShops />} />
      <Route path="/all-shops" element={<AllShopsPage />} />
      <Route path="/shop/:shopId" element={<ShopProductsPage />} />
      <Route path="/shop/:shopId/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/category/:categoryName" element={<CategoryShops />} />
      <Route path="/account" element={<UserAccount />} />

      {/* <Route path="/seller-timely-dashboard" element={<SellerTimelyDashboard />} /> */}


      {/* Protected Customer Routes */}
      <Route element={<ProtectedCustomerRoute />}>

        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/order-review" element={<OrderReview />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order-review-pay" element={<OrderReviewPayment />} />
        <Route path="/search-results" element={<SearchedProductsPage />} />
        <Route path="/recommended-products" element={<RecommendedProductsPage />} />
      </Route>

      {/* Protected Seller Routes */}
      <Route element={<ProtectedSellerRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/seller-order-history" element={<OrderHistory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/add-product" element={<AddProduct />} />


        
        {/* <Route path="/hourly-sales" element ={<HourlySalesPage/>}/>
        <Route path="/daily-sales" element={<DailySalesPage />} /> */}
        <Route path="/daily-sales" element ={<HourlySalesPage/>}/>
        <Route path="/weekly-sales" element={<WeeklySalesPage />} />
        <Route path="/monthly-sales" element={<MonthlySalesPage />} />
        <Route path="/yearly-sales" element={<YearlySalesPage />} />
        <Route path="/fast-slow-stocks" element={<ProductMovingSpeedPage />} />
        <Route path="/order-status" element={<OrderStatusPage />} />
        <Route path="/sales-mode" element={<SalesModePage />} />
        

        {/* <Route path="/seller-analytics" element={<SellerAnalyticDashboard />} /> */}
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin-dashboard" element={<AdminHome />} />
        <Route path="/approve-seller" element={<Approve />} />
        <Route path="/admin/categories" element={<Category />} />
        <Route path="/admin/customers" element={<Customer />} />
        <Route path="/admin/sellers" element={<Seller />} />
        <Route path="/admin/products" element={<Product />} />
        <Route path="/admin/product-categories" element={<ProductCategoryPage />} />
      </Route>

      {/* Redirect unknown seller routes */}
      <Route path="/seller/*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default AllRoutes;
