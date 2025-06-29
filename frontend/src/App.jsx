import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import Interview from './pages/Interview/components/InterView';
import { SignIn, SignUp } from '@clerk/clerk-react';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview-prep/:sessionId" element={<Interview />} />
      </Routes>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default App;
