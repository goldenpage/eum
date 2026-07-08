import { Children, type ReactNode } from "react";
import { A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "./css/ChartSwiper.css";

interface ChartSwiperProps {
  children: ReactNode;
  onSlideChange?: () => void;
}

function ChatrtSwiper({ children, onSlideChange }: ChartSwiperProps) {
  const slides = Children.toArray(children);

  return (
    <Swiper
      className="chart-swiper"
      modules={[Pagination, A11y]}
      spaceBetween={16}
      slidesPerView={1}
      pagination={{ clickable: true }}
      onSlideChange={onSlideChange}
      onResize={onSlideChange}
      observer
      observeParents
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
      }}
    >
      {slides.map((child, index) => (
        <SwiperSlide key={index} className="chart-swiper__slide">
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ChatrtSwiper;
