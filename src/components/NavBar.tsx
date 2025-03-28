import React, { useContext, useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';
import {
  Autocomplete,
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginDialog from './LoginDialog';
import { BASE_URL, fetchGET, fetchPOST, fetchPUT } from '../services/api';
import { Notification } from '../services/types';
import CreateShowDialog from './CreateShowDialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/contexts/AuthContextType';

interface NavBarProps {
  onSearch: (query: string) => void;
  autocompleteOptions?: string[];
}

const NavBar: React.FC<NavBarProps> = ({ onSearch, autocompleteOptions }) => {
  const navigate = useNavigate(); 
  const location = useLocation();
  const { user, setUser, isLogged } = useContext(AuthContext)!; 
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [isCreateShowOpen, setIsCreateShowOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await fetchGET('/users/me');
        if (userData) {
          setUser(userData);
        }

        if (location.pathname === '/dressToImpressIRLClient') {
          navigate('/dressToImpressIRLClient/loggedIn', { replace: true });
        }
      } catch (error) {
        console.error('No active session or error while checking the session:', error);
        if (location.pathname === '/dressToImpressIRLClient/loggedIn') {
          navigate('/dressToImpressIRLClient', { replace: true });
        }
      }
    };

    checkSession();
  }, []);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      const response = await fetchPOST('/users/logout', {});
      console.log(response);
      setUser(null);
      navigate('/dressToImpressIRLClient');
      handleMenuClose();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const unreadCount = user?.notifications
    ? user.notifications.filter((notification: Notification) => !notification.read).length
    : 0;

    const handleNotificationItemClick = async (notification: Notification) => {
      try {
        const updatedNotification = await fetchPUT<{ read: boolean; message: string }, Notification>(
          `/notifications/${notification.id}`,
          {
            read: true,
            message: notification.message,
          }
        );
    
        if (user) {
          setUser({
            ...user,
            notifications: user.notifications.map((n: Notification) =>
              n.id === notification.id ? updatedNotification : n
            ),
          });
        }
      } catch (error) {
        console.error('Błąd podczas aktualizacji powiadomienia:', error);
      }
      handleNotificationMenuClose();
    };
    

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-2 bg-white ">
      {/* Logo */}
      <img src={logo} alt="Logo" className="h-12 w-auto" />

      {/* Search Bar*/}
      <div className="flex-1 items-center mx-4 max-w-lg space-x-2">
      <Autocomplete
        id="searchField"
        freeSolo
        inputValue={inputValue}
        onInputChange={(_, newInputValue, reason) => {
          setInputValue(newInputValue);
          if (reason === "clear") {
            onSearch("");
          }
        }}
        onChange={(_, value) => {
          if (typeof value === "string") {
            onSearch(value);
          } else if (value) {
            onSearch(value);
          }
        }}
        options={inputValue.length >= 1 ? (autocompleteOptions || []) : []}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              <div className="flex items-center">
                <SearchIcon className="mr-2" /> Search shows
              </div>
            }
            variant="outlined"
            fullWidth
            color="secondary"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                if (autocompleteOptions && autocompleteOptions.length > 0) {
                  const filteredSuggestions = autocompleteOptions.filter(opt =>
                    opt.toLowerCase().includes(inputValue.toLowerCase())
                  );
                  if (filteredSuggestions.length > 0) {
                    onSearch(filteredSuggestions.join(', '));
                  } else {
                    onSearch(inputValue);
                  }
                } else {
                  onSearch(inputValue);
                }
              }
            }}
          />
        )}
      />
      </div>

      {/* Notifications and Avatar */}
      <div className="flex items-center gap-4">
        {isLogged ? (
          <>
            <Button variant="outlined" className="gap-1" onClick={() => setIsCreateShowOpen(true)}>
              <AddIcon />
              Create show
            </Button>
            <IconButton aria-label="notification" color="secondary" onClick={handleNotificationClick}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleAvatarClick}>
              <Avatar
                alt="User Avatar"
                {...(user && user.photo ? { src: `${BASE_URL}/files/${user.photo}` } : {})}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleMenuClose} className="gap-2">
                <SettingsIcon /> Account
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <LogoutIcon /> Sign out
              </MenuItem>
            </Menu>
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                disabled
                sx={{
                  '&.Mui-disabled': {
                    opacity: 1,
                    color: 'inherit',
                    fontSize: '1.2rem',
                  },
                }}
              >
                Notifications
              </MenuItem>
              <Divider sx={{ my: 1, borderColor: 'grey.300' }} />
              {user?.notifications && user.notifications.length > 0 ? (
                user.notifications.slice().reverse().map((notification: Notification, index) => (
                  <MenuItem
                    key={notification.id || index}
                    onClick={() => handleNotificationItemClick(notification)}
                    sx={{ fontWeight: !notification.read ? 'bold' : 'normal' }}
                  >
                    {notification.message}
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={handleNotificationMenuClose}>No notifications</MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <>
            <Tooltip title="registration is not yet available">
              <Button className="gap-1 w-[100px]">Sign up</Button>
            </Tooltip>
            <Button variant="outlined" className="gap-1 w-[100px]" onClick={() => setIsLoginOpen(true)}>
              Sign in
            </Button>
          </>
        )}
      </div>

      <LoginDialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={async () => {
          const userData = await fetchGET('/users/me');
          setUser(userData);
          navigate('/dressToImpressIRLClient/loggedIn');
        }}
      />

      {user && (
        <CreateShowDialog 
          open={isCreateShowOpen} 
          onClose={() => setIsCreateShowOpen(false)}
          creatorId={user?.id}
        />
      )}

    </div>

    
  );
};

export default NavBar;