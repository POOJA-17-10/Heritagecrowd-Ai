
import React, { useState, useEffect } from 'react';
import { Site, User, TimeSlotPrediction, CrowdLevel, Booking } from '../types';
import { predictCrowdLevels } from '../services/geminiService';
import { storage } from '../services/storageService';
import { Calendar, Users, Zap, CheckCircle, CreditCard, Loader2, Sparkles, AlertCircle, MapPin } from 'lucide-react';

interface BookTicketProps {
  site: Site;
  user: User;
  onComplete: () => void;
}

const BookTicket: React.FC<BookTicketProps> = ({ site, user, onComplete }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [predictions, setPredictions] = useState<TimeSlotPrediction[]>([]);
  const [loadingAI, setLoadingAI] = useState(true);
  const [paymentStep, setPaymentStep] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('Google Pay');

  useEffect(() => {
    async function loadAI() {
      setLoadingAI(true);
      const data = await predictCrowdLevels(site.name);
      setPredictions(data);
      // Auto-select first low crowd slot
      const lowSlot = data.find(p => p.crowdLevel === CrowdLevel.LOW);
      if (lowSlot) setSelectedSlot(lowSlot.slot);
      else if (data.length > 0) setSelectedSlot(data[0].slot);
      setLoadingAI(false);
    }
    loadAI();
  }, [site.name]);

  const totalAmount = (adultCount * site.adultPrice) + (childCount * site.childPrice);

  const handleBooking = () => {
    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      siteId: site.id,
      siteName: site.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      adultCount,
      childCount,
      totalAmount,
      status: 'Confirmed',
      qrCode: `HERITAGE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };
    storage.saveBooking(booking);
    setBookingDone(true);
    setTimeout(() => onComplete(), 3000);
  };

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(site.name + ", " + site.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  if (bookingDone) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-xl border border-green-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 mb-8">Ticket has been sent to your registered email and is available in My Bookings.</p>
        <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-32 h-32 bg-white border border-gray-100 mx-auto flex items-center justify-center mb-2 p-2">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${site.id}-${selectedDate}`} alt="QR Code" className="w-full h-full" />
          </div>
          <p className="text-xs text-gray-400 font-mono">Scan at Entry Gate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Info & AI Selection & Map */}
        <div className="space-y-8">
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg">
            <img src={site.imageUrl} className="w-full h-full object-cover" alt={site.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-end p-8 items-end">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{site.name}</h1>
                <p className="text-white/80 flex items-center"><MapPin className="w-4 h-4 mr-1" /> {site.location}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">AI Slot Recommendation</h2>
            </div>

            {loadingAI ? (
              <div className="flex flex-col items-center py-10 space-y-4">
                <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
                <p className="text-amber-800 font-medium animate-pulse">Analyzing historical crowd patterns...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {predictions.map((p) => (
                  <button
                    key={p.slot}
                    onClick={() => setSelectedSlot(p.slot)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      selectedSlot === p.slot 
                        ? 'border-amber-600 bg-white shadow-md scale-[1.02]' 
                        : 'border-white bg-white/40 hover:bg-white/60'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{p.slot}</p>
                      <p className="text-sm text-gray-500">{p.recommendation}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.crowdLevel === CrowdLevel.LOW ? 'bg-green-100 text-green-700' :
                      p.crowdLevel === CrowdLevel.MEDIUM ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.crowdLevel} Crowd
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Integration */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[350px]">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center">
              <MapPin className="w-4 h-4 text-amber-600 mr-2" />
              <span className="font-bold text-gray-900">Location Map</span>
            </div>
            <iframe
              title="Site Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={mapUrl}
              className="grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        {/* Right Column: Ticket Config & Payment */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col h-fit">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Configure Visit</h3>
          
          <div className="space-y-8 mb-auto">
            {/* Date Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-amber-600" /> Select Visit Date
              </label>
              <input 
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-900 transition-all cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-lg">Adult Ticket</p>
                <p className="text-gray-500 text-sm">₹{site.adultPrice} per person</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >-</button>
                <span className="text-xl font-bold w-4 text-center">{adultCount}</span>
                <button 
                  onClick={() => setAdultCount(adultCount + 1)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >+</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-lg">Children</p>
                <p className="text-gray-500 text-sm">₹{site.childPrice} (Age 5-12)</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setChildCount(Math.max(0, childCount - 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >-</button>
                <span className="text-xl font-bold w-4 text-center">{childCount}</span>
                <button 
                  onClick={() => setChildCount(childCount + 1)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >+</button>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Visit Date</span>
                <span className="font-bold text-gray-900">{new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Selected Slot</span>
                <span className="font-bold text-gray-900">{selectedSlot || 'Not Selected'}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center text-xl">
                <span className="text-gray-900 font-bold">Total Amount</span>
                <span className="text-amber-600 font-extrabold">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            {!paymentStep ? (
              <button 
                disabled={!selectedSlot}
                onClick={() => setPaymentStep(true)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="flex flex-col space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Google Pay', 'PhonePe', 'Paytm'].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setSelectedPayment(m)}
                        className={`p-3 border-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                          selectedPayment === m 
                          ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md ring-2 ring-amber-100' 
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleBooking}
                  className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 transition-all shadow-lg flex items-center justify-center"
                >
                  Pay ₹{totalAmount} via {selectedPayment} <CheckCircle className="ml-2 w-5 h-5" />
                </button>
                <button 
                  onClick={() => setPaymentStep(false)}
                  className="w-full py-2 text-gray-400 font-medium hover:text-gray-600"
                >
                  Back to Details
                </button>
              </div>
            )}
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
              <AlertCircle className="w-3 h-3 mr-1" /> Tickets are non-refundable 24h prior to visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon component
const ArrowRight: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default BookTicket;
