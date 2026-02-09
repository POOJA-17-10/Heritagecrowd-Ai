
import { Site, User, Booking } from '../types';
import { INITIAL_SITES } from '../constants';

const KEYS = {
  SITES: 'heritage_sites',
  USERS: 'heritage_users',
  BOOKINGS: 'heritage_bookings',
  AUTH: 'heritage_auth'
};

export const storage = {
  getSites: (): Site[] => {
    const data = localStorage.getItem(KEYS.SITES);
    return data ? JSON.parse(data) : INITIAL_SITES;
  },
  saveSites: (sites: Site[]) => localStorage.setItem(KEYS.SITES, JSON.stringify(sites)),
  
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  
  getBookings: (): Booking[] => {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },
  saveBooking: (booking: Booking) => {
    const bookings = storage.getBookings();
    bookings.push(booking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },
  updateBooking: (id: string, updated: Partial<Booking>) => {
    const bookings = storage.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index > -1) {
      bookings[index] = { ...bookings[index], ...updated };
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
    else localStorage.removeItem(KEYS.AUTH);
  }
};
