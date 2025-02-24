import React, { useState, useEffect } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import '../styles/Carousel.css'

type CarouselProps = {
  slides: React.ReactNode[];
};

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [slides]);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setSlideIndex((index) => {
        if (index === slides.length - 1) return 0;
        return index + 1;
      });
    }, 20000); 

    return () => clearInterval(autoSlide);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <section className="h-full w-full relative rounded-lg">
        No slides
      </section>
    );
  }

  return (
    <section className="h-full w-full relative rounded-lg">
      <div className="w-full h-full flex overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            aria-hidden={slideIndex !== index}
            className="img-slider-img"
            style={{ translate: `${-100 * slideIndex}%` }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="absolute bottom-2 flex justify-center w-full h-10 items-center">
        <div className="flex bg-opacity-60 rounded-full px-2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className="img-slider-dot-btn"
              onClick={() => setSlideIndex(index)}
            >
              {index === slideIndex ? (
                <CircleIcon
                  fontSize="inherit"
                  className="text-black w-[8px] h-[8px]"
                />
              ) : (
                <CircleIcon
                  fontSize="inherit"
                  className="text-black w-[5px] h-[5px]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div id="after-image-slider-controls" />
    </section>
  );
};

export default Carousel;
