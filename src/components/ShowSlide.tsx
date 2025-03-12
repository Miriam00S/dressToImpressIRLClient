import React, { useContext, useState } from 'react';
import { Show } from '../services/types';
import { Typography, Button } from '@mui/material';
import { BASE_URL, fetchGET } from '../services/api';
import JoinShowDialog from './JoinShowDialog';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/contexts/AuthContextType';
import LoginDialog from './LoginDialog';

interface ShowSlideProps {
  show: Show;
}

const ShowSlide: React.FC<ShowSlideProps> = ({ show }) => {
  const navigate = useNavigate(); 
  const { user, setUser } = useContext(AuthContext)!;
  const [isJoinShowOpen, setIsJoinShowOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  
     
  const handleJoinClick = () => {
    if (user) {
      setIsJoinShowOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  }; 

  return (
    <div
      style={{
        backgroundImage: show.banner ? `url(${BASE_URL}/files/${show.banner})` : 'none',
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
            onClick={handleJoinClick}
            style={{ minWidth: '150px' }}
          >
            Join
          </Button>
          { user && 
          <JoinShowDialog 
            open={isJoinShowOpen} 
            onClose={() => setIsJoinShowOpen(false)}
            show={show}
            user={user}
          /> 
          }
          <LoginDialog
            open={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={async () => {
              const userData = await fetchGET('/users/me');
              setUser(userData);
              navigate('/dressToImpressIRLClient/loggedIn');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowSlide;
