import { ToastContainer } from "react-toastify";
import { Footer, Navbar } from "./components";
import AllRoutes from "./Routes/AllRoutes";
import { useLocation } from "react-router-dom";

import SellerLayout from "./components/layouts/SellerLayout";

function App() {
  const { pathname } = useLocation();
  const isSellerRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/overview") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/add-product") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/hourly-sales") ||
    pathname.startsWith("/daily-sales") ||
    pathname.startsWith("/weekly-sales") ||
    pathname.startsWith("/monthly-sales") ||
    pathname.startsWith("/yearly-sales") ||
    pathname.startsWith("/fast-slow-stocks") ||
    pathname.startsWith("/order-status") ||
    pathname.startsWith("/sales-mode");

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      {!isSellerRoute && <Navbar />}
      <AllRoutes />
      {!isSellerRoute && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
