
import React from 'react';
import { ArrowRight, Users, Calendar, MapPin } from 'lucide-react';

interface UserHomeProps {
  onExplore: () => void;
}

const UserHome: React.FC<UserHomeProps> = ({ onExplore }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Hero Heritage"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            AI-Driven Crowd Prediction <br/>
            <span className="text-amber-400">for Cultural Heritage</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            Experience the past without the crowds. Our AI analyzes real-time data to recommend the best time for your cultural journey.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onExplore}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-lg"
            >
              Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Stats */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: 'AI Crowd Analysis', desc: 'Predictive modeling for peak visit times.' },
          { icon: Calendar, title: 'Optimized Slots', desc: 'Book tickets in low-density time windows.' },
          { icon: MapPin, title: 'Verified Locations', desc: 'Official heritage sites and monuments.' },
        ].map((feat, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <feat.icon className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feat.title}</h3>
            <p className="text-gray-500">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UserHome;
