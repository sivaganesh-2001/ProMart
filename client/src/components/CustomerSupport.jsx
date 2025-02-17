import React from "react";
import { BsPenFill, BsTelephoneFill } from "react-icons/bs";

function CustomerSupport() {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Us</h2>

      <div className="flex flex-col items-center gap-4">
        {/* Email Section */}
        <div className="flex items-center gap-4 p-3 w-full bg-gray-100 rounded-lg shadow-sm">
          <BsPenFill className="text-blue-500 text-2xl" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-600">Email</p>
            <p className="text-md font-medium text-gray-800">promart@gmail.com</p>
          </div>
        </div>

        {/* Phone Section */}
        <div className="flex items-center gap-4 p-3 w-full bg-gray-100 rounded-lg shadow-sm">
          <BsTelephoneFill className="text-blue-500 text-2xl" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-600">Phone</p>
            <p className="text-md font-medium text-gray-800">+91-9443485296</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSupport;
