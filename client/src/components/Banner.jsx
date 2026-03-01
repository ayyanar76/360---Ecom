import React, { useEffect, useRef, useState } from 'react'

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const images = [
    "image.png",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
  ];

  const totalSlides = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
 

  <div className="w-full flex items-center justify-center px-4 sm:px-6 py-6">
      <div className="flex flex-col items-center justify-center w-full max-w-6xl">
      <div className="w-full overflow-hidden relative rounded-2xl shadow-lg">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-[220px] sm:h-[320px] md:h-[460px] lg:h-[560px] flex-shrink-0 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center mt-5 space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
              currentSlide === index
                ? "bg-black"
                : "bg-black/20"
            }`}
          ></span>
        ))}
      </div>
    </div>
  </div>
 
  )
}

export default Banner
