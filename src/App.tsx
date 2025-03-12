import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { AuthProvider } from './services/contexts/AuthContextType';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/dressToImpressIRLClient" element={<HomePage />} />
          <Route path="/dressToImpressIRLClient/loggedIn" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
