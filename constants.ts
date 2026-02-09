
import { Site, CrowdLevel } from './types';

export const INITIAL_SITES: Site[] = [
  {
    id: '1',
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna, built by Shah Jahan.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/49HToQyz9S8',
    adultPrice: 50,
    childPrice: 0,
    ticketLimit: 5000,
    currentCrowdLevel: CrowdLevel.HIGH
  },
  {
    id: '2',
    name: 'Qutub Minar',
    location: 'Mehrauli, New Delhi',
    description: 'A 73-metre tall tapering tower of five storeys, built by Qutb-ud-din Aibak.',
    imageUrl: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/SshM977P_O0',
    adultPrice: 35,
    childPrice: 0,
    ticketLimit: 3000,
    currentCrowdLevel: CrowdLevel.MEDIUM
  },
  {
    id: '3',
    name: 'Brihadisvara Temple',
    location: 'Thanjavur, Tamil Nadu',
    description: 'A Hindu temple dedicated to Shiva located in Thanjavur, one of the largest South Indian temples.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/K8w3tH90T9c',
    adultPrice: 40,
    childPrice: 10,
    ticketLimit: 2500,
    currentCrowdLevel: CrowdLevel.LOW
  },
  {
    id: '4',
    name: 'Padmanabhaswamy Temple',
    location: 'Thiruvananthapuram, Kerala',
    description: 'A Hindu temple dedicated to Lord Vishnu, built in an intricate fusion of the Chera style.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/nUf-E-p4z00',
    adultPrice: 20,
    childPrice: 5,
    ticketLimit: 2000,
    currentCrowdLevel: CrowdLevel.MEDIUM
  },
  {
    id: '5',
    name: 'Ajanta Caves',
    location: 'Aurangabad, Maharashtra',
    description: '30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE.',
    imageUrl: 'https://images.unsplash.com/photo-1626027357494-b1b709df8c8f?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/qO85GvC4o80',
    adultPrice: 40,
    childPrice: 20,
    ticketLimit: 1500,
    currentCrowdLevel: CrowdLevel.MEDIUM
  },
  {
    id: '6',
    name: 'Hampi Virupaksha Temple',
    location: 'Hampi, Karnataka',
    description: 'Part of the Group of Monuments at Hampi, a UNESCO World Heritage Site.',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-23a9d7fc2194?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/zH39vP-g2Yg',
    adultPrice: 40,
    childPrice: 10,
    ticketLimit: 2000,
    currentCrowdLevel: CrowdLevel.LOW
  }
];

export const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM'
];
