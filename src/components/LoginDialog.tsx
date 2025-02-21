import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material';
import { fetchPOST } from '../services/api';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLoginSuccess }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = await fetchPOST(`/users/login?nickname=${encodeURIComponent(nickname)}`, {});
      console.log('Logged in user:', user);
      
      setError(false);
      setHelperText('');
      onLoginSuccess();
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
      setHelperText('Incorrect nickname.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle className="flex justify-center bahaur">Sign in to Dress to impress IRL</DialogTitle>
      <form onSubmit={handleLogin}>
        <DialogContent>
          <TextField
            id="nickname"
            autoFocus
            margin="dense"
            label="Nickname"
            type="text"
            fullWidth
            variant="outlined"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            error={error}
            helperText={error ? helperText : ''}
          />
        </DialogContent>
        <DialogActions className="flex justify-center">
          <Box width="100%" display="flex" justifyContent="center">
            <Button type="submit" variant="outlined" className="w-[100px]">
              Sign in
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
