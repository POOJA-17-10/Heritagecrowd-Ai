
import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService';
import { User, Site } from './types';
import Navbar from './components/Navbar';
import UserHome from './user/UserHome';
import ExploreSites from './user/ExploreSites';
import MyBookings from './user/MyBookings';
import UserProfile from './user/UserProfile';
import BookTicket from './user/BookTicket';
import AdminDashboard from './admin/AdminDashboard';
import SiteManagement from './admin/SiteManagement';
import AdminProfile from './admin/AdminProfile';
import { UserLogin, UserSignup, AdminLogin, AdminSignup } from './auth/AuthPages';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  useEffect(() => {
    storage.setCurrentUser(currentUser);
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const navigateToBooking = (siteId: string) => {
    if (!currentUser) {
      setCurrentView('login');
    } else {
      setSelectedSiteId(siteId);
      setCurrentView('book-ticket');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <UserHome onExplore={() => setCurrentView('explore')} />;
      case 'explore':
        return <ExploreSites onBook={navigateToBooking} />;
      case 'login':
        return <UserLogin onLogin={(user) => { setCurrentUser(user); setCurrentView('home'); }} onSwitch={() => setCurrentView('signup')} />;
      case 'signup':
        return <UserSignup onSignup={(user) => { setCurrentUser(user); setCurrentView('home'); }} onSwitch={() => setCurrentView('login')} />;
      case 'admin-login':
        return <AdminLogin onLogin={(user) => { setCurrentUser(user); setCurrentView('admin-dash'); }} onSwitch={() => setCurrentView('admin-signup')} />;
      case 'admin-signup':
        return <AdminSignup onSignup={(user) => { setCurrentUser(user); setCurrentView('admin-dash'); }} onSwitch={() => setCurrentView('admin-login')} />;
      
      // User Auth views
      case 'my-bookings':
        return currentUser ? <MyBookings user={currentUser} /> : <UserLogin onLogin={(u) => {setCurrentUser(u); setCurrentView('my-bookings');}} onSwitch={() => setCurrentView('signup')} />;
      case 'profile':
        return currentUser ? <UserProfile user={currentUser} onUpdate={(u) => setCurrentUser(u)} onLogout={handleLogout} /> : null;
      case 'book-ticket':
        const site = storage.getSites().find(s => s.id === selectedSiteId);
        return currentUser && site ? <BookTicket site={site} user={currentUser} onComplete={() => setCurrentView('my-bookings')} /> : null;

      // Admin views
      case 'admin-dash':
        return currentUser?.role === 'admin' ? <AdminDashboard /> : null;
      case 'site-mgmt':
        return currentUser?.role === 'admin' ? <SiteManagement /> : null;
      case 'admin-profile':
        return currentUser?.role === 'admin' ? <AdminProfile user={currentUser} onLogout={handleLogout} /> : null;

      default:
        return <UserHome onExplore={() => setCurrentView('explore')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout} 
        onNavigate={setCurrentView} 
        currentView={currentView}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} HeritageCrowd AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
