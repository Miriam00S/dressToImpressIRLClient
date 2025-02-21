// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme'; // Zaimportuj motyw
import './index.css'; // Zaimportuj Tailwind CSS

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <ThemeProvider theme={theme}> {/* MUI ThemeProvider musi obejmować całą aplikację */}
    <App />
  </ThemeProvider>
);
