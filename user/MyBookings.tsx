
import React, { useState } from 'react';
import { storage } from '../services/storageService';
import { User, Booking, CrowdLevel, TimeSlotPrediction } from '../types';
import { QrCode, Calendar, Clock, Search, X, Trash2, Edit3, CheckCircle, Info, Loader2, Sparkles, AlertTriangle, CreditCard } from 'lucide-react';
import { predictCrowdLevels } from '../services/geminiService';

interface MyBookingsProps {
  user: User;
}

const MyBookings: React.FC<MyBookingsProps> = ({ user }) => {
  const [allBookings, setAllBookings] = useState<Booking[]>(storage.getBookings());
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPredictions, setEditPredictions] = useState<TimeSlotPrediction[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  
  // States for cancellation flow
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  const userBookings = allBookings.filter(b => b.userId === user.id).reverse();

  const handleCancelInitiate = (booking: Booking) => {
    setCancelTarget(booking);
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      storage.updateBooking(cancelTarget.id, { status: 'Cancelled' });
      setAllBookings(storage.getBookings());
      setShowCancelConfirmation(false);
      setShowCancelSuccess(true);
      // Target remains set for the success message if needed, but we clear it after closing success
    }
  };

  const handleOpenEdit = async (booking: Booking) => {
    setEditingBooking({ ...booking });
    setIsEditModalOpen(true);
    setLoadingPredictions(true);
    const predictions = await predictCrowdLevels(booking.siteName);
    setEditPredictions(predictions);
    setLoadingPredictions(false);
  };

  const handleSaveEdit = () => {
    if (editingBooking) {
      storage.updateBooking(editingBooking.id, {
        date: editingBooking.date,
        timeSlot: editingBooking.timeSlot
      });
      setAllBookings(storage.getBookings());
      setIsEditModalOpen(false);
      setEditingBooking(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-500">Manage your past and upcoming heritage visits.</p>
        </div>
        <div className="mt-4 md:mt-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {userBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-20 text-center">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">You haven't booked any heritage tours yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {userBookings.map((booking) => (
            <div key={booking.id} className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow ${booking.status === 'Cancelled' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
              <div className="p-8 flex-grow flex flex-col md:flex-row md:items-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-8 ${booking.status === 'Cancelled' ? 'bg-gray-100' : 'bg-amber-50'}`}>
                  <QrCode className={`w-10 h-10 ${booking.status === 'Cancelled' ? 'text-gray-400' : 'text-amber-600'}`} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: #{booking.id}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${booking.status === 'Confirmed' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{booking.siteName}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {booking.timeSlot}</div>
                    <div className="flex items-center">₹{booking.totalAmount} for {booking.adultCount + booking.childCount} persons</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-8 py-6 md:w-64 flex flex-col justify-center space-y-3 border-t md:border-t-0 md:border-l border-gray-100">
                <button 
                  onClick={() => setSelectedTicket(booking)}
                  className="flex items-center justify-center space-x-2 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <QrCode className="w-4 h-4" /> <span>View Ticket</span>
                </button>
                {booking.status !== 'Cancelled' && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleCancelInitiate(booking)}
                      className="flex-grow py-2 text-xs font-bold text-red-400 hover:text-red-600 flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" /> <span>Cancel</span>
                    </button>
                    <button 
                      onClick={() => handleOpenEdit(booking)}
                      className="flex-grow py-2 text-xs font-bold text-amber-500 hover:text-amber-700 flex items-center justify-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" /> <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Double Confirmation Modal */}
      {showCancelConfirmation && cancelTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Confirm Cancellation</h2>
                <p className="text-gray-500">
                  Are you sure you want to cancel your visit to <span className="font-bold text-gray-900">{cancelTarget.siteName}</span>?
                  This action cannot be undone.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Refund Amount</span>
                  <span className="font-bold text-green-600">₹{cancelTarget.totalAmount}</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Policy: 100% Refundable</p>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowCancelConfirmation(false)}
                  className="flex-grow py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={handleConfirmCancel}
                  className="flex-grow py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Success Message Modal */}
      {showCancelSuccess && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Cancellation Successful</h2>
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <p className="text-green-800 font-medium">
                    Your booking has been cancelled. 
                    <br/>
                    <span className="font-bold">You will be refunded within 5 working days.</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowCancelSuccess(false); setCancelTarget(null); }}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
              >
                Got it, thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket View Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-amber-600 text-white">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <h2 className="font-bold">E-Ticket</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 text-center space-y-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900">{selectedTicket.siteName}</h3>
                <p className="text-gray-500 font-medium">{selectedTicket.timeSlot}</p>
                <p className="text-amber-600 font-bold">{new Date(selectedTicket.date).toLocaleDateString()}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedTicket.id}`} 
                  alt="QR Code" 
                  className="mx-auto w-48 h-48 rounded-lg shadow-sm bg-white p-2"
                />
                <div className="mt-4 text-[10px] font-mono text-gray-400 tracking-widest uppercase">
                  Booking Reference: {selectedTicket.id}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left text-sm pt-4 border-t border-gray-100">
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px]">Adults</p>
                  <p className="text-gray-900 font-bold">{selectedTicket.adultCount}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px]">Children</p>
                  <p className="text-gray-900 font-bold">{selectedTicket.childCount}</p>
                </div>
              </div>
              
              <button 
                onClick={() => window.print()}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Reschedule Visit</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                   <Calendar className="w-3 h-3 mr-2" /> New Visit Date
                </label>
                <input 
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={editingBooking.date}
                  onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                  <Sparkles className="w-3 h-3 mr-2 text-amber-500" /> AI Slot Prediction
                </label>
                {loadingPredictions ? (
                  <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span className="text-sm text-gray-500">Recalculating crowd patterns...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {editPredictions.map((p) => (
                      <button
                        key={p.slot}
                        onClick={() => setEditingBooking({...editingBooking, timeSlot: p.slot})}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          editingBooking.timeSlot === p.slot 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-sm font-bold text-gray-900">{p.slot}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.crowdLevel === CrowdLevel.LOW ? 'bg-green-100 text-green-700' :
                          p.crowdLevel === CrowdLevel.MEDIUM ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {p.crowdLevel}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-grow py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="flex-grow py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" /> <span>Update Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        @media print {
          body * { visibility: hidden; }
          .fixed { visibility: visible; }
          .fixed * { visibility: visible; }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
