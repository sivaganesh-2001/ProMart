import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedSellerRoute = () => {
  const sellerEmail = localStorage.getItem("sellerEmail");
  return sellerEmail ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedSellerRoute;
