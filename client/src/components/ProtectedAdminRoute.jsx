import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const adminEmail = localStorage.getItem("adminEmail");
  return adminEmail ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedAdminRoute;
