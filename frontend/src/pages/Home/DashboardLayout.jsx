 
import React from 'react';
import Header from '../../pages/Header';  

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;
