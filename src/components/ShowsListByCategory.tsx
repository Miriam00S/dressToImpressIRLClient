import React, { useState, useEffect } from 'react';
import { Typography, Skeleton } from '@mui/material';
import { Show } from '../services/types';
import { fetchGET } from '../services/api';
import ShowCard from './ShowCard';
import Carousel from './CarouselWithArrows';

interface ShowListByCategoryProps {
  category: string;
}

const ShowListByCategory: React.FC<ShowListByCategoryProps> = ({ category }) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsToShow, setItemsToShow] = useState<number>(1);
  const [cardWidth, setCardWidth] = useState<number>(300);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        // Opóźnienie dla efektu ładowania
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const data = await fetchGET(`/shows/by-category?name=${encodeURIComponent(category)}`);
        setShows(data);
      } catch (error) {
        console.error(`Błąd podczas pobierania pokazów dla kategorii ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [category]);

  useEffect(() => {
    const handleResize = () => {
      // Ustalane wartości:
      const containerPadding = 56; // p-7: 28px + 28px
      const gap = 12; // gap-3 = 12px
      // Dostępna szerokość kontenera:
      const availableWidth = window.innerWidth - containerPadding;
      // Obliczamy liczbę kart: (320N - 12 <= availableWidth) <=> N <= (window.innerWidth - 44)/320
      const newItemsCount = Math.floor((window.innerWidth - 44) / 320);
      setItemsToShow(Math.max(1, newItemsCount));
      // Obliczamy efektywną szerokość pojedynczej karty (w opakowaniu):
      const effectiveCardWidth = (availableWidth - (newItemsCount - 1) * gap) / newItemsCount;
      setCardWidth(effectiveCardWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="pb-3 mb-4">
      {loading ? (
        <Skeleton variant="text" width={200} height={40} />
      ) : (
        <Typography variant="h4" gutterBottom color="secondary">
          {category}
        </Typography>
      )}

      <div className="flex gap-3 pb-2">
        {loading ? (
          // Renderujemy tyle skeletonów, ile miejsc na karty się zmieści
          Array.from({ length: itemsToShow }, (_, index) => (
            <div key={index}>
              <Skeleton variant="rectangular" width={cardWidth} height={250} />
            </div>
          ))
        ) : shows.length > 0 ? (
          <Carousel itemsToShow={itemsToShow}>
            {shows.map((show) => (
              <div className="p-1" key={show.id}>
                <ShowCard show={show} />
              </div>
            ))}
          </Carousel>
        ) : (
          <Typography variant="body1">No shows available.</Typography>
        )}
      </div>
    </div>
  );
};

export default ShowListByCategory;
