
import React, { useState } from 'react';
import { storage } from '../services/storageService';
import { Site, CrowdLevel } from '../types';
import { Plus, Edit2, Trash2, MapPin, Search, X } from 'lucide-react';

const SiteManagement: React.FC = () => {
  const [sites, setSites] = useState<Site[]>(storage.getSites());
  const [isEditing, setIsEditing] = useState(false);
  const [currentSite, setCurrentSite] = useState<Partial<Site> | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this heritage site?')) {
      const updated = sites.filter(s => s.id !== id);
      setSites(updated);
      storage.saveSites(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    let updatedSites: Site[];
    if (currentSite.id) {
      updatedSites = sites.map(s => s.id === currentSite.id ? currentSite as Site : s);
    } else {
      const newSite = { ...currentSite, id: Date.now().toString() } as Site;
      updatedSites = [...sites, newSite];
    }

    setSites(updatedSites);
    storage.saveSites(updatedSites);
    setIsEditing(false);
    setCurrentSite(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Site Management</h1>
          <p className="text-gray-500">Add, update, or remove heritage monuments from the system.</p>
        </div>
        <button 
          onClick={() => { setCurrentSite({ currentCrowdLevel: CrowdLevel.LOW }); setIsEditing(true); }}
          className="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Site
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-5">Site Details</th>
              <th className="px-8 py-5">Location</th>
              <th className="px-8 py-5">Pricing</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sites.map((site) => (
              <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img src={site.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <p className="font-bold text-gray-900">{site.name}</p>
                      <p className="text-xs text-gray-400">Limit: {site.ticketLimit} / day</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="flex items-center text-sm text-gray-500"><MapPin className="w-3 h-3 mr-1" /> {site.location}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">Adult: ₹{site.adultPrice}</p>
                    <p className="text-gray-400">Child: ₹{site.childPrice}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    site.currentCrowdLevel === CrowdLevel.LOW ? 'bg-green-100 text-green-700' :
                    site.currentCrowdLevel === CrowdLevel.MEDIUM ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {site.currentCrowdLevel} Crowd
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => { setCurrentSite(site); setIsEditing(true); }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(site.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{currentSite?.id ? 'Edit Site' : 'Add New Heritage Site'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Site Name</label>
                  <input 
                    required 
                    value={currentSite?.name || ''} 
                    onChange={(e) => setCurrentSite({...currentSite, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Location</label>
                  <input 
                    required 
                    value={currentSite?.location || ''} 
                    onChange={(e) => setCurrentSite({...currentSite, location: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Adult Price (₹)</label>
                  <input 
                    required 
                    type="number"
                    value={currentSite?.adultPrice || 0} 
                    onChange={(e) => setCurrentSite({...currentSite, adultPrice: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Ticket Limit</label>
                  <input 
                    required 
                    type="number"
                    value={currentSite?.ticketLimit || 0} 
                    onChange={(e) => setCurrentSite({...currentSite, ticketLimit: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Image URL</label>
                <input 
                  required 
                  value={currentSite?.imageUrl || ''} 
                  onChange={(e) => setCurrentSite({...currentSite, imageUrl: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-md">
                  {currentSite?.id ? 'Update Site' : 'Create Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteManagement;
