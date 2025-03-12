import React, { useContext, useState } from 'react';
import { Card, CardMedia, CardContent, Button, Typography } from '@mui/material';
import { Show} from '../services/types';
import { BASE_URL, fetchGET } from '../services/api';
import JoinShowDialog from './JoinShowDialog';
import LoginDialog from './LoginDialog';
import { AuthContext } from '../services/contexts/AuthContextType';
import { useNavigate } from 'react-router-dom';

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
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
    <Card sx={{minwidth: 300}}> 
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
          <Button variant="contained" color="secondary" onClick={handleJoinClick}>
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
      </CardContent>
    </Card>
  );
};

export default ShowCard;
