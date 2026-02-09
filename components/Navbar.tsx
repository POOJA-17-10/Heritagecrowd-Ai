
import React from 'react';
import { Landmark, User as UserIcon, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentView }) => {
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Landmark className="h-8 w-8 text-amber-600 mr-2" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">HeritageCrowd AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin ? (
              <>
                <button 
                  onClick={() => onNavigate('home')}
                  className={`${currentView === 'home' ? 'text-amber-600 font-semibold' : 'text-gray-600 hover:text-amber-600'} transition-colors`}
                >
                  Home
                </button>
                <button 
                  onClick={() => onNavigate('explore')}
                  className={`${currentView === 'explore' ? 'text-amber-600 font-semibold' : 'text-gray-600 hover:text-amber-600'} transition-colors`}
                >
                  Explore Sites
                </button>
                {user && (
                  <button 
                    onClick={() => onNavigate('my-bookings')}
                    className={`${currentView === 'my-bookings' ? 'text-amber-600 font-semibold' : 'text-gray-600 hover:text-amber-600'} transition-colors`}
                  >
                    My Bookings
                  </button>
                )}
              </>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('admin-dash')}
                  className={`${currentView === 'admin-dash' ? 'text-amber-600 font-semibold' : 'text-gray-600 hover:text-amber-600'} transition-colors flex items-center`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
                </button>
                <button 
                  onClick={() => onNavigate('site-mgmt')}
                  className={`${currentView === 'site-mgmt' ? 'text-amber-600 font-semibold' : 'text-gray-600 hover:text-amber-600'} transition-colors`}
                >
                  Site Management
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onNavigate(isAdmin ? 'admin-profile' : 'profile')}
                  className="flex items-center text-gray-700 hover:text-amber-600 transition-colors"
                >
                  <UserIcon className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline font-medium">{user.username}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-medium text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50"
                >
                  Login
                </button>
                <button 
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                >
                  Sign Up
                </button>
              </div>
            )}
            {!user && (
              <button 
                onClick={() => onNavigate('admin-login')}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Admin Area
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
