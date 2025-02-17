import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import ProtectedCustomerRoute from '../components/ProtectedCustomerRoute';
import ProtectedSellerRoute from '../components/ProtectedSellerRoute';

// Pages
import Home from '../Pages/Home';
import SignUp from '../Pages/SignUp';
import Login from '../Pages/Login';
import OTPVerification from '../Pages/OTPpage';
import AllProducts from '../Pages/AllProducts';
import SingleProduct from '../Pages/SingleProduct';
import Cart from '../Pages/Cart';
import UserAccount from '../Pages/UserAccount';
import Payment from '../Pages/Payment';
import OrderReview from '../Pages/OrderReviewPage';
import OrderReviewPayment from '../Pages/OrderReviewPagePayment';
import OrderPage from '../Pages/OrderPage';

// Shop Pages
import ExploreShops from '../components/ExploreShops/ExploreShops';
import AllShopsPage from '../Pages/AllShopPage';
import ShopProductsPage from '../Pages/ShopProductsPage';
import ProductDetailsPage from '../Pages/ProductDetailsPage';
import { CategoryShops } from '../components';

// Seller Pages
import Dashboard from '../Pages/owner/Dashboard';
import Products from '../Pages/owner/Products';
import OrderHistory from '../Pages/owner/SellerOrderHistory';
import Orders from '../Pages/owner/Orders';
import Overview from '../Pages/owner/Analysis';
import Billing from '../Pages/owner/Billing';
import AddProduct from '../Pages/owner/AddProducts';
import SellerAnalyticDashboard from '../Pages/owner/SellerAnalyticDashboard';
import SellerTimelyDashboard from '../Pages/Analytics/SellerDashboard';
// Admin Pages
import AdminHome from '../Pages/admin/AdminHome';
import Approve from '../Pages/admin/Approve';

function AllRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OTPVerification />} />
      <Route path="/shop" element={<ExploreShops />} />
      <Route path="/all-shops" element={<AllShopsPage />} />
      <Route path="/shop/:shopId" element={<ShopProductsPage />} />
      <Route path="/shop/:shopId/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/category/:categoryName" element={<CategoryShops />} />
      <Route path="/account" element={<UserAccount />} />

      <Route path="/seller-timely-dashboard" element={<SellerTimelyDashboard />} />


      {/* Protected Customer Routes */}
      <Route element={<ProtectedCustomerRoute />}>
        <Route path="/allproducts/:products" element={<AllProducts />} />
        <Route path="/allproducts/:products/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-review" element={<OrderReview />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order-review-pay" element={<OrderReviewPayment />} />
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
        <Route path="/seller-analytics" element={<SellerAnalyticDashboard />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin-dashboard" element={<AdminHome />} />
        <Route path="/approve-seller" element={<Approve />} />
      </Route>

      {/* Redirect unknown seller routes */}
      <Route path="/seller/*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default AllRoutes;
