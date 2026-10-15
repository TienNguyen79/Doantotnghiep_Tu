import React, { useState } from "react";
import Slider from "react-slick";
import Image from "../../components/Image/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

const listImg = [
  {
    id: 1,
    url: "/Sliderbanner/FS_G4.png",
    to: "",
  },
  {
    id: 7,
    url: "/Sliderbanner/ronaldoImg.png",
    to: "",
  },
  {
    id: 2,
    url: "/Sliderbanner/FS_G2.png",
    to: "",
  },
  {
    id: 3,
    url: "/Sliderbanner/FS_G3.png",
    to: "",
  },
  {
    id: 8,
    url: "/Sliderbanner/FS_B2.png",
    to: "",
  },
  {
    id: 4,
    url: "/Sliderbanner/FS_G9.png",
    to: "",
  },
  {
    id: 12,
    url: "/Sliderbanner/FS_B1.png",
    to: "",
  },
  {
    id: 5,
    url: "/Sliderbanner/FS_G5.png",
    to: "",
  },
  {
    id: 6,
    url: "/Sliderbanner/FS_G7.png",
    to: "",
  },

  {
    id: 9,
    url: "/Sliderbanner/FS_B3.png",
    to: "",
  },
  {
    id: 10,
    url: "/Sliderbanner/FS_B4.png",
    to: "",
  },

  {
    id: 13,
    url: "/Sliderbanner/Vi_1.png",
    to: "",
  },
  {
    id: 14,
    url: "/Sliderbanner/Vi_2.png",
    to: "",
  },
  {
    id: 15,
    url: "/Sliderbanner/Vi_3.png",
    to: "",
  },
];

const SliderBanner = () => {
  const [isHovered, setIsHovered] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "ease-in",
    arrows: false,
    // prevArrow: <FontAwesomeIcon icon={faChevronLeft} />, // Component mũi tên prev
    // nextArrow: <FontAwesomeIcon icon={faChevronRight} />, // Component mũi tên next
  };
  return (
    <div className="mt-[104px]">
      <div className="sliderBanner slider-container">
        <Slider {...settings}>
          {listImg.length > 0 &&
            listImg.map((img) => (
              <div className="relative" key={img.id}>
                <Image
                  url={img.url}
                  className={`h-[650px] z-[1] ${isHovered ? " blur-sm" : ""}`}
                ></Image>

                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Button
                    kind="secondary"
                    className="shopnow py-3 px-4 rounded-md absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-60 hover:bg-primary hover:text-white transition-all hover:opacity-100 "
                    href="/shopping/all"
                  >
                    Mua sắm ngay!
                  </Button>
                </div>
              </div>
            ))}
          {/* <div>
            <Image className="h-[608px] z-[1]"></Image>
          </div> */}
        </Slider>
      </div>
    </div>
  );
};

export default SliderBanner;
