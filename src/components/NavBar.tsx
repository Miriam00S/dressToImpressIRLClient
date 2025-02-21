import React, { useEffect, useState } from 'react';
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
import { BASE_URL, fetchGET, fetchPOST } from '../services/api';
import { User } from '../services/types';

// Załóżmy, że typ powiadomienia wygląda mniej więcej tak:
type Notification = {
  id: string | number;
  message: string;
  read: boolean;
};

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  // ... pozostałe filmy
];

const NavBar: React.FC = () => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await fetchGET('/users/me');
        if (userData) {
          setIsLogged(true);
          setUser(userData);
        }
      } catch (error) {
        console.error('Brak aktywnej sesji lub błąd podczas sprawdzania sesji:', error);
        setIsLogged(false);
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
      setIsLogged(false);
      setUser(undefined);
      handleMenuClose();
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  // Obliczamy liczbę nieprzeczytanych powiadomień
  const unreadCount = user?.notifications
    ? user.notifications.filter((notification: Notification) => !notification.read).length
    : 0;

  // Funkcja, która wywołuje PUT notifications/{id}
  const handleNotificationItemClick = async (notification: Notification) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/${notification.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          read: true,
          message: notification.message, // lub zaktualizowana wartość, jeśli potrzebne
        }),
      });
      if (!response.ok) {
        throw new Error(`PUT request error: ${response.statusText}`);
      }
      const updatedNotification = await response.json();
      // Aktualizujemy stan lokalny - oznaczamy powiadomienie jako przeczytane
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
    <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-2 bg-white shadow-md">
      {/* Logo */}
      <img src={logo} alt="Logo" className="h-12 w-auto" />

      {/* Search Bar */}
      <div className="flex-1 items-center mx-4 max-w-lg space-x-2">
        <Autocomplete
          id="searchField"
          freeSolo
          options={top100Films.map((option) => option.title)}
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
            />
          )}
        />
      </div>

      {/* Notifications and Avatar */}
      <div className="flex items-center gap-4">
        {isLogged ? (
          <>
            <Button variant="outlined" className="gap-1">
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
            {/* Menu - avatar */}
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
            {/* Menu - notifications */}
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
        fontSize: '1.2rem', // powiększony nagłówek
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
          setIsLogged(true);
          const userData = await fetchGET('/users/me');
          setUser(userData);
        }}
      />
    </div>
  );
};

export default NavBar;
