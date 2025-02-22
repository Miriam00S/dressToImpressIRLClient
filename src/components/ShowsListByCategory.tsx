import React, { useState, useEffect } from 'react';
import { Typography, Skeleton } from '@mui/material';
import { Show } from '../services/types';
import { fetchGET } from '../services/api';
import ShowCard from './ShowCard';
import Carousel from './Carousel';

interface ShowListByCategoryProps {
  category: string;
}

const ShowListByCategory: React.FC<ShowListByCategoryProps> = ({ category }) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        // Force a delay for the loading effect
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

  return (
    <div className="pb-3 mb-4">
      {loading ? (
        <Skeleton variant="text" width={200} height={40} />
      ) : (
        <Typography variant="h4" gutterBottom color='secondary'>
          {category}
        </Typography>
      )}
      <div className="flex gap-3 pb-2">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index}>
              <Skeleton variant="rectangular" width={300} height={250} />
            </div>
          ))
        ) : shows.length > 0 ? (
          <Carousel itemsToShow={5}>
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
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
