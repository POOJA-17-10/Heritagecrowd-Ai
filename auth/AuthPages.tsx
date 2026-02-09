
import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../services/storageService';
import { Landmark, Mail, Lock, User as UserIcon, Calendar, Phone, Globe, Shield, Eye, EyeOff, ChevronDown } from 'lucide-react';

interface AuthProps {
  onLogin?: (user: User) => void;
  onSignup?: (user: User) => void;
  onSwitch: () => void;
}

const AuthLayout: React.FC<{ children: React.ReactNode, title: string, subtitle: string }> = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
          < Landmark className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

export const UserLogin: React.FC<AuthProps> = ({ onLogin, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.role === 'user');
    if (user) {
      if (user.password === password) {
        onLogin?.(user);
      } else {
        alert('Incorrect password. Please try again.');
      }
    } else {
      alert('User not found. Try to create an account by clicking "Sign Up"');
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to book your next heritage tour.">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              required type="email" placeholder="Email address" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              required type={showPassword ? "text" : "password"} placeholder="Password" 
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button type="submit" className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 transition-all shadow-lg">
          Log In
        </button>
        <p className="text-center text-sm text-gray-500">
          New here? <button type="button" onClick={onSwitch} className="text-amber-600 font-bold hover:underline">Create an account</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export const UserSignup: React.FC<AuthProps> = ({ onSignup, onSwitch }) => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', dob: '', mobile: '', nationality: 'Indian', aadhaar: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const { confirmPassword, ...userData } = formData;
    const newUser: User = { ...userData, id: Date.now().toString(), role: 'user' };
    storage.saveUser(newUser);
    onSignup?.(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
            <Landmark className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">Join our community and explore history.</p>
        </div>
        <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
            <input required placeholder="Full Name" onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
            <input required type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
            <div className="relative">
              <input required type={showPass ? "text" : "password"} placeholder="Enter Password" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Confirm Password</label>
            <div className="relative">
              <input required type={showConfirm ? "text" : "password"} placeholder="Confirm Password" onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Date of Birth</label>
            <input required type="date" onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mobile Number</label>
            <input required placeholder="e.g. 9876543210" onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nationality</label>
            <div className="relative">
              <select 
                value={formData.nationality}
                onChange={e => setFormData({...formData, nationality: e.target.value})} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer pr-10"
              >
                <option value="Indian">Indian</option>
                <option value="Foreigner">Foreigner</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Aadhaar / ID Number</label>
            <input required placeholder="Identification Number" onChange={e => setFormData({...formData, aadhaar: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          <div className="col-span-1 md:col-span-2 pt-4">
            <button type="submit" className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 transition-all shadow-lg active:scale-95">
              Create Account
            </button>
            <p className="text-center mt-6 text-sm text-gray-500">
              Already have an account? <button type="button" onClick={onSwitch} className="text-amber-600 font-bold hover:underline">Log In</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminLogin: React.FC<AuthProps> = ({ onLogin, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const admin = users.find(u => u.email === email && u.role === 'admin');
    if (admin) {
      if (admin.password === password) {
        onLogin?.(admin);
      } else {
        alert('Incorrect admin password.');
      }
    } else {
      alert('Admin account not found. Please register an admin account first.');
    }
  };

  return (
    <AuthLayout title="Admin Control" subtitle="Access the administrative dashboard.">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input required type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input required type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
          Admin Login
        </button>
        <p className="text-center text-sm text-gray-500">
          Need admin access? <button type="button" onClick={onSwitch} className="text-amber-600 font-bold hover:underline">Admin Sign Up</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export const AdminSignup: React.FC<AuthProps> = ({ onSignup, onSwitch }) => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', dob: '', mobile: '', nationality: 'Indian', aadhaar: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const { confirmPassword, ...userData } = formData;
    const newAdmin: User = { ...userData, id: 'admin-' + Date.now(), role: 'admin' };
    storage.saveUser(newAdmin);
    onSignup?.(newAdmin);
  };

  return (
    <AuthLayout title="Admin Registration" subtitle="Create an administrative account.">
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Manager Name</label>
          <input required placeholder="e.g. John Doe" onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Corporate Email</label>
          <input required type="email" placeholder="admin@heritage.gov" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Contact Number</label>
          <input required placeholder="e.g. 9876543210" onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Date of Birth</label>
          <input required type="date" onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
            <div className="relative">
              <input required type={showPass ? "text" : "password"} placeholder="Secure Password" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Confirm</label>
            <div className="relative">
              <input required type={showConfirm ? "text" : "password"} placeholder="Confirm" onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Official ID / Aadhaar</label>
          <input required placeholder="Employee ID / Aadhaar" onChange={e => setFormData({...formData, aadhaar: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <button type="submit" className="w-full py-4 mt-4 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 transition-all shadow-lg">
          Register Admin
        </button>
        <p className="text-center text-sm text-gray-500">
          Already registered? <button type="button" onClick={onSwitch} className="text-amber-600 font-bold hover:underline">Admin Login</button>
        </p>
      </form>
    </AuthLayout>
  );
};
