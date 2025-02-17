import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedCustomerRoute = () => {
  const customerEmail = localStorage.getItem("customerEmail");
  return customerEmail ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedCustomerRoute;
