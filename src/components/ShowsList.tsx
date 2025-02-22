import React, { useState, useEffect } from 'react';
import { Show } from '../services/types';
import { fetchGET } from '../services/api';
import ShowCard from './ShowCard';

const ShowsList: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const categoryName = "Special ocasions"; // Przykładowa kategoria

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await fetchGET(`/shows/by-category?name=${categoryName}`);
        setShows(data);
      } catch (error) {
        console.error("Błąd podczas pobierania pokazów:", error);
      }
    };

    fetchShows();
  }, [categoryName]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
        padding: "16px",
      }}
    >
      {shows.map((show) => (
        <div key={show.id}>
          <ShowCard show={show} />
        </div>
      ))}
    </div>
  );
};

export default ShowsList;
