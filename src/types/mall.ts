export interface Mall {
  id: string;
  name: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  image: string;
  address: string;
  openingTime: string;
  closingTime: string;
  timezone: string;
  phone?: string;
  website?: string;
}

export type MallStatus = 'OPEN' | 'CLOSED';

export interface MallWithStatus extends Mall {
  status: MallStatus;
  currentLocalTime: string;
}