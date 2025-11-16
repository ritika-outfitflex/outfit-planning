
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Search, TrendingUp, Sparkles } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({isActive}) => 
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
        end
      >
        <Home className="bottom-nav-icon" />
        <span>Home</span>
      </NavLink>
      <NavLink 
        to="/wardrobe" 
        className={({isActive}) => 
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Search className="bottom-nav-icon" />
        <span>Wardrobe</span>
      </NavLink>
      <NavLink 
        to="/analytics" 
        className={({isActive}) => 
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <TrendingUp className="bottom-nav-icon" />
        <span>Analytics</span>
      </NavLink>
      <NavLink 
        to="/outfits" 
        className={({isActive}) => 
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Sparkles className="bottom-nav-icon" />
        <span>Outfits</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({isActive}) => 
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <User className="bottom-nav-icon" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
