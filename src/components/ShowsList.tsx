import React from 'react';
import { Categories } from '../services/enums';
import ShowListByCategory from './ShowsListByCategory';
const ShowList: React.FC = () => {
  // iterate through the enuma Categories values
  const categories = Object.values(Categories);

  return (
    <div className='w-full p-7'>
      {categories.map((category) => (
        <ShowListByCategory key={category} category={category} />
      ))}
    </div>
  );
};

export default ShowList;
