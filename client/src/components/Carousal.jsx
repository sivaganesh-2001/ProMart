import React from 'react';
import { useNavigate } from 'react-router-dom';
import { carousalone, carousaltwo, carousalthree, carousalfour, carousalsix, carousalseven } from '../assets';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Carousal = () => {
  const navigate = useNavigate();

  const sliderLeft = () => {
    const slider = document.getElementById("slider1");
    slider.scrollLeft -= 500;
  };

  const sliderRight = () => {
    const slider = document.getElementById("slider1");
    slider.scrollLeft += 500;
  };

  return (
    <div className='w-[1850px] flex flex-row '>
      <MdChevronLeft onClick={sliderLeft} className="text-[40px] text-black ml-10 cursor-pointer opacity-50 hover:opacity-100 mt-6 md:mt-36"/>
      <div
        id="slider1"
        className="mt-8 flex-row gap-6 cursor-pointer relative flex items-center w-[1350px] h-full whitespace-nowrap scroll-smooth overflow-x-hidden"
      >
        <img
          src={carousalone}
          alt="carousalone"
          className='h-[250px] cursor-pointer'
          onClick={() => navigate('/shop/67ae2aa73dcf3e26bc7de269/product/67d90b9397523723470b05df')}
        />
        <img
          src={carousaltwo}
          alt="carousaltwo"
          className='h-[250px] cursor-pointer'
          onClick={() => navigate('/shop/67ae2a9f3dcf3e26bc7de268/product/67d90ed397523723470b05e2')}
        />
        <img
          src={carousalthree}
          alt="carousalthree"
          className='h-[250px] cursor-pointer'
          onClick={() => navigate('/shop/67ae2aa73dcf3e26bc7de269/product/67d910a697523723470b05e3')}
        />
        <img
          src={carousalfour}
          alt="carousalfour"
          className='h-[250px] cursor-pointer'
          onClick={() => navigate('/shop/67ae2aa73dcf3e26bc7de269/product/67d9125197523723470b05e4')}
        />
        <img
          src={carousalsix}
          alt="carousalsix"
          className='h-[250px] cursor-pointer'
          onClick={() => navigate('/shop/67d8371c691e0207cb967684/product/67d90df697523723470b05e0')}
        />
        <img
          src={carousalseven}
          alt="carousalseven"
          className='rounded-xl h-[250px] cursor-pointer'
          onClick={() => navigate('/shop/67d8371c691e0207cb967684/product/67d90e2797523723470b05e1')}
        />
      </div>
      <MdChevronRight onClick={sliderRight} className="text-[40px] text-black ml-2 cursor-pointer opacity-50 hover:opacity-100 mt-6 md:mt-36"/>
    </div>
  );
};

export default Carousal;
