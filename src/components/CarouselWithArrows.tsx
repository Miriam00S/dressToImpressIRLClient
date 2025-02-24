import React, { useState } from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import '../styles/CarouselWithArrows.css';

interface CarouselProps {
  children: React.ReactNode[];
  itemsToShow: number;
}

const Carousel: React.FC<CarouselProps> = ({ children, itemsToShow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = children.length;

  // Strzałka w lewo: wyświetlamy, gdy nie jesteśmy w pierwszej grupie
  const showLeftArrow = currentIndex > 0;
  // Strzałka w prawo: wyświetlamy, gdy nie jesteśmy w ostatniej grupie
  const showRightArrow = currentIndex < totalItems - itemsToShow;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + itemsToShow;
      // Jeśli przekroczymy ostatnią pełną grupę, ustawiamy indeks ostatniej grupy
      return nextIndex >= totalItems - itemsToShow
        ? totalItems - itemsToShow
        : nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - itemsToShow;
      // Jeśli wychodzimy poniżej 0, ustawiamy indeks na 0
      return nextIndex < 0 ? 0 : nextIndex;
    });
  };

  return (
    <div className="carousel-wrapper">
      {showLeftArrow && (
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
            <div
              className="carousel-item"
              style={{ width: `${100 / itemsToShow}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {showRightArrow && (
        <button onClick={handleNext} className="carousel-btn carousel-btn-right">
          <ArrowForwardIosRoundedIcon />
        </button>
      )}
    </div>
  );
};

export default Carousel;
