
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Filter, Info } from 'lucide-react';
import { storage } from '../services/storageService';
import { CrowdLevel } from '../types';

interface ExploreSitesProps {
  onBook: (id: string) => void;
}

const ExploreSites: React.FC<ExploreSitesProps> = ({ onBook }) => {
  const sites = storage.getSites();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');

  const locations = useMemo(() => {
    const locs = sites.map(s => s.location.split(', ').pop() || '');
    return ['All', ...Array.from(new Set(locs))];
  }, [sites]);

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          site.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'All' || site.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const getCrowdColor = (level: CrowdLevel) => {
    switch (level) {
      case CrowdLevel.LOW: return 'bg-green-100 text-green-700 border-green-200';
      case CrowdLevel.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
      case CrowdLevel.HIGH: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Heritage Sites</h1>
        <p className="text-gray-500">Discover monuments and temples with live crowd prediction.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm min-w-[200px]">
          <Filter className="text-gray-400 w-4 h-4" />
          <select 
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700 font-medium"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredSites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No sites found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSites.map((site) => (
            <div key={site.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
              <div className="relative h-64">
                <img src={site.imageUrl} alt={site.name} className="w-full h-full object-cover" />
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${getCrowdColor(site.currentCrowdLevel)}`}>
                  {site.currentCrowdLevel} Crowd Today
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">Starts from</span>
                    <p className="font-bold text-amber-600">₹{site.adultPrice}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" /> {site.location}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                  {site.description}
                </p>
                <button 
                  onClick={() => onBook(site.id)}
                  className="mt-auto w-full py-3.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-md active:scale-95"
                >
                  View & Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreSites;
