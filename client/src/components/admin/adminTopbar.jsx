import { useDispatch } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa"; // Import logout 
export default function AdminTopbar() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear all stored user data
    localStorage.clear();
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <header className="bg-[#019875] h-[80px] flex items-center justify-between px-8 shadow-lg relative">
      {/* Left Section: ProMart Title */}
      <div className="flex items-center space-x-6">
        <h1 className="text-white font-semibold cursor-pointer mt-3 ml-2">ProMart</h1>
      </div>

      {/* Center Section: Admin Dashboard Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-white text-2xl font-bold mt-3">Admin Dashboard</h1>
      </div>

      {/* Right Section: Logout Icon */}
      <div className="relative flex items-center">
        <FaSignOutAlt
          className="text-white text-2xl cursor-pointer"
          onClick={handleLogout} // Direct logout
        />
      </div>
    </header>
  );
}
