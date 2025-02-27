import React from 'react';
import { Card, CardMedia, CardContent, Button, Typography } from '@mui/material';
import { Show } from '../services/types';
import { BASE_URL } from '../services/api';

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  const handleJoin = () => {
    console.log("Joining show:", show);
  };

  return (
    <Card sx={{minwidth: 300 }}> 
      <CardMedia
        component="img"
        sx={{ height: 150, objectFit: 'cover' }}
        image={show.banner ? `${BASE_URL}/files/${show.banner}` : ''}
        alt={show.topic}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {show.topic}
        </Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          <div>
            <Typography variant="body2" color="text.secondary">
              Join until {show.joiningDate ? show.joiningDate.split('T')[0] : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {show.stylings ? show.stylings.length : 0} participants
            </Typography>
          </div>
          <Button variant="contained" color="secondary" onClick={handleJoin}>
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowCard;
