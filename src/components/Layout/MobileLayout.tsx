
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../Navigation/BottomNav';

const MobileLayout: React.FC = () => {
  return (
    <div className="mobile-container">
      <div className="content-area pt-safe">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default MobileLayout;
