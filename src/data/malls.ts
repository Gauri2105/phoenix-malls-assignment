import type { Mall } from '../types/mall';

export const malls: Mall[] = [
  {
    id: 'pmc-pune',
    name: 'Phoenix Marketcity Pune',
    country: 'India',
    city: 'Pune',
    latitude: 18.5615,
    longitude: 73.9167,
    image:
      'https://images.unsplash.com/photo-1519567241046-7f570eee3e0f?auto=format&fit=crop&w=1200&q=80',
    address:
      'Viman Nagar Road, Clover Park, Viman Nagar, Pune, Maharashtra 411014',
    openingTime: '10:00',
    closingTime: '22:00',
    timezone: 'Asia/Kolkata',
    phone: '+91 20 6689 0000',
    website: 'https://www.phoenixmarketcity.com/pune',
  },
  {
    id: 'pmc-mumbai',
    name: 'Phoenix Marketcity Mumbai',
    country: 'India',
    city: 'Mumbai',
    latitude: 19.086,
    longitude: 72.889,
    image:
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
    address:
      'Lal Bahadur Shastri Marg, Kurla West, Mumbai, Maharashtra 400070',
    openingTime: '10:00',
    closingTime: '22:00',
    timezone: 'Asia/Kolkata',
    phone: '+91 22 6180 0000',
    website: 'https://www.phoenixmarketcity.com/mumbai',
  },
  {
    id: 'phoenix-palladium-mumbai',
    name: 'Phoenix Palladium Mumbai',
    country: 'India',
    city: 'Mumbai',
    latitude: 18.9947,
    longitude: 72.8258,
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    address:
      'Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    openingTime: '11:00',
    closingTime: '23:00',
    timezone: 'Asia/Kolkata',
    phone: '+91 22 4333 0000',
    website: 'https://www.phoenixpalladium.com',
  },
];