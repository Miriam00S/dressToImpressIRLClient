import React, { useState } from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import '../styles/Carousel.css';

interface CarouselProps {
  children: React.ReactNode[];
  itemsToShow: number;
}

const Carousel: React.FC<CarouselProps> = ({ children, itemsToShow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = children.length;
  const showArrows = totalItems >= 6; //show arrows when there are at least 6 tabs

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= totalItems - itemsToShow ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? totalItems - itemsToShow : prevIndex - 1
    );
  };

  return (
    <div className="carousel-wrapper">
      {showArrows && (
        <button onClick={handlePrev} className="carousel-btn carousel-btn-left">
          <ArrowBackIosNewRoundedIcon />
        </button>
      )}
      <div className="carousel-container">
        <div
          className="carousel-inner"
          style={{
            transform: `translateX(-${(100 / itemsToShow) * currentIndex}%)`,
          }}
        >
          {React.Children.map(children, (child) => (
            <div className="carousel-item" style={{ width: `${100 / itemsToShow}%` }}>
              {child}
            </div>
          ))}
        </div>
      </div>
      {showArrows && (
        <button onClick={handleNext} className="carousel-btn carousel-btn-right">
          <ArrowForwardIosRoundedIcon />
        </button>
      )}
    </div>
  );
};

export default Carousel;
