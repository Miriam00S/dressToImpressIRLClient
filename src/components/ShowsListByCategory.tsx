import React, { useState, useEffect } from 'react';
import { Typography, Skeleton, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Show } from '../services/types';
import { fetchGET } from '../services/api';
import ShowCard from './ShowCard';

interface ShowListByCategoryProps {
  category: string;
}

const ShowListByCategory: React.FC<ShowListByCategoryProps> = ({ category }) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupIndex, setGroupIndex] = useState<number>(0);
  const [cardsPerGroup, setCardsPerGroup] = useState<number>(Math.max(Math.floor(window.innerWidth / 300), 1));

  useEffect(() => {
    const handleResize = () => {
      const newCardsPerGroup = Math.max(Math.floor(window.innerWidth / 300), 1);
      setCardsPerGroup(newCardsPerGroup);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        // Dodajemy opóźnienie dla efektu ładowania
        await new Promise((resolve) => setTimeout(resolve, 1000));
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

  // Grupowanie pokazów na podstawie cardsPerGroup
  const groups: Show[][] = [];
  for (let i = 0; i < shows.length; i += cardsPerGroup) {
    groups.push(shows.slice(i, i + cardsPerGroup));
  }

  useEffect(() => {
    if (groupIndex >= groups.length) {
      setGroupIndex(0);
    }
  }, [groups, groupIndex]);

  const handlePrev = () => {
    if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
    }
  };

  const handleNext = () => {
    if (groupIndex < groups.length - 1) {
      setGroupIndex(groupIndex + 1);
    }
  };

  const showArrows = groups.length > 1;

  return (
    <div className="pb-3 mb-4">
      {loading ? (
        <Skeleton variant="text" width={200} height={40} />
      ) : (
        <Typography variant="h4" gutterBottom color="secondary">
          {category}
        </Typography>
      )}

      {showArrows ? (
        <div className="flex items-center gap-3 pb-2">
          {groupIndex > 0 && (
            <IconButton onClick={handlePrev} disabled={loading}>
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          <div className="flex gap-3">
            {loading ? (
              Array.from({ length: cardsPerGroup }).map((_, index) => (
                <div key={index}>
                  <Skeleton variant="rectangular" width={300} height={250} />
                </div>
              ))
            ) : groups.length > 0 ? (
              groups[groupIndex].map((show) => <ShowCard key={show.id} show={show} />)
            ) : (
              <Typography variant="body1">No shows available.</Typography>
            )}
          </div>
          {groupIndex < groups.length - 1 && (
            <IconButton onClick={handleNext} disabled={loading}>
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </div>
      ) : (
        <div className="flex gap-3 pb-2">
          {loading ? (
            Array.from({ length: cardsPerGroup }).map((_, index) => (
              <div key={index}>
                <Skeleton variant="rectangular" width={300} height={250} />
              </div>
            ))
          ) : groups.length > 0 ? (
            groups[0].map((show) => <ShowCard key={show.id} show={show} />)
          ) : (
            <Typography className='text-gray-500' variant="body1">No shows available.</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowListByCategory;
