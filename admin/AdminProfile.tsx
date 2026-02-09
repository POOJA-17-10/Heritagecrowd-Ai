
import React from 'react';
import { User } from '../types';
import { Shield, Mail, Phone, LogOut } from 'lucide-react';

interface AdminProfileProps {
  user: User;
  onLogout: () => void;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-12 text-center">
          <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{user.username}</h1>
          <p className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-8">System Administrator</p>
          
          <div className="max-w-md mx-auto grid grid-cols-1 gap-4 text-left mb-12">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Contact</p>
                <p className="text-gray-900 font-medium">{user.mobile || 'N/A'}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="px-12 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all flex items-center mx-auto"
          >
            <LogOut className="w-5 h-5 mr-2" /> Sign Out from System
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
