import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsChevronRight } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { explorenewcategory } from "../constant/data";
import CuratedForYou from "./CuratedForYou";

const ExploreByCategories = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(locationData);
          localStorage.setItem("userLocation", JSON.stringify(locationData)); // Store location
        },
        (error) => {
          console.error("Error getting geolocation", error);
        }
      );
    }
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (categoryName) {
      navigate(`/category/${encodeURIComponent(categoryName.toLowerCase())}`);
    }
  };
  

  const sliderLeft = () => {
    document.getElementById("slider2").scrollLeft -= 500;
  };

  const sliderRight = () => {
    document.getElementById("slider2").scrollLeft += 500;
  };

  return (
    <div>
      <div>
        <div className="flex flex-row justify-around gap-[200px] ml-0 md:gap-[700px] pb-6 sm:ml-0">
          <h2 className="text-md sm:text-xl font-semibold">Explore By Categories</h2>
          <a href="/" className="flex flex-row justify-center items-center gap-2 font-semibold text-[#FF3269]">
            See All <BsChevronRight />
          </a>
        </div>

        <div className="w-[1850px] flex flex-row">
          <MdChevronLeft
            onClick={sliderLeft}
            className="text-[40px] text-black ml-16 cursor-pointer opacity-50 hover:opacity-100 mt-6 md:mt-24"
          />

          <div className="ml-1 w-[1250px] overflow-x-hidden scroll-smooth" id="slider2">
            <div className="flex-row cursor-pointer relative flex items-center w-[1550px] h-full whitespace-nowrap">
              {explorenewcategory.map((item) => (
                <div key={item.id} onClick={() => handleCategoryClick(item.name)}>
                  <img
                    src={item.img}
                    alt={item.name || "Category"}
                    className="h-[220px] w-full cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <MdChevronRight
            onClick={sliderRight}
            className="text-[40px] text-black ml-2 cursor-pointer opacity-50 hover:opacity-100 mt-6 md:mt-24"
          />
        </div>
      </div>

      <CuratedForYou />

      <div className="mt-12 mb-6">
        <img src="./images/banner.png" alt="bannerimg" className="h-[180px] lg:h-[430px] flex pl-2 lg:pl-[150px]" />
      </div>
    </div>
  );
};

export default ExploreByCategories;
