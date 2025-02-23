// useItemsToShow.ts
import { useState, useEffect } from 'react';

const useItemsToShow = (cardWidth: number): number => {
  const getItemsCount = () => Math.floor(window.innerWidth / cardWidth) || 1;
  const [itemsToShow, setItemsToShow] = useState<number>(getItemsCount());

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getItemsCount());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardWidth]);

  return itemsToShow;
};

export default useItemsToShow;
