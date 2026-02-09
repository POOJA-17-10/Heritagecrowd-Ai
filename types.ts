
export enum CrowdLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Site {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  adultPrice: number;
  childPrice: number;
  ticketLimit: number;
  currentCrowdLevel: CrowdLevel;
}

export interface Booking {
  id: string;
  userId: string;
  siteId: string;
  siteName: string;
  date: string;
  timeSlot: string;
  adultCount: number;
  childCount: number;
  totalAmount: number;
  status: 'Confirmed' | 'Cancelled';
  qrCode: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  // password is required for authentication logic in login and signup flows
  password?: string;
  dob: string;
  mobile: string;
  nationality: string;
  aadhaar: string;
  role: 'user' | 'admin';
}

export interface TimeSlotPrediction {
  slot: string;
  crowdLevel: CrowdLevel;
  recommendation: string;
}
