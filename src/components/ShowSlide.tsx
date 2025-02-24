import React from 'react';
import { Show } from '../services/types';
import { Typography, Button } from '@mui/material';
import { BASE_URL } from '../services/api';

interface ShowSlideProps {
  show: Show;
}

const ShowSlide: React.FC<ShowSlideProps> = ({ show }) => {
  const handleJoin = () => {
    // Obsługa przycisku Join
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BASE_URL}/files/${show.banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0) 100%)',
        }}
        />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
        }}
      >
        <div style={{ marginLeft: '5rem' }} className='text-black'>
          <Typography variant="h4" gutterBottom>
            {show.topic}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Join until {show.joiningDate}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {show.stylings.length} participants
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleJoin}
            style={{ minWidth: '150px' }}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShowSlide;
