import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EA3399',
    },
    secondary: {
      main: '#181818',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            '&:hover': {
              borderColor: '#EA3399', 
            },
          },
        },
      ],
    },
  },
});

export default theme;
