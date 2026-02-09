
import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Calendar, Phone, Globe, Shield, LogOut, Save } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-32 bg-amber-600 relative">
          <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-3xl shadow-lg">
            <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-amber-200" />
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{user.username}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="space-x-4">
              <button 
                onClick={onLogout}
                className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center"><UserIcon className="w-3 h-3 mr-1"/> Full Name</label>
                <input 
                  disabled={!isEditing}
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center"><Mail className="w-3 h-3 mr-1"/> Email Address</label>
                <input 
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center"><Calendar className="w-3 h-3 mr-1"/> Date of Birth</label>
                <input 
                  disabled={!isEditing}
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center"><Phone className="w-3 h-3 mr-1"/> Mobile Number</label>
                <input 
                  disabled={!isEditing}
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center"><Globe className="w-3 h-3 mr-1"/> Nationality</label>
                <input 
                  disabled={!isEditing}
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center"><Shield className="w-3 h-3 mr-1"/> Aadhaar Number</label>
                <input 
                  disabled={!isEditing}
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-60"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex justify-end">
              {isEditing ? (
                <div className="flex space-x-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-md flex items-center">
                    <Save className="w-5 h-5 mr-2" /> Save Changes
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
