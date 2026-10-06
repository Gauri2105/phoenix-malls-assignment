import { describe, expect, it } from 'vitest';

import { getMallLocalTime, getMallStatus } from '../utils/mallStatus';
import type { Mall } from '../types/mall';

const puneMall: Mall = {
  id: 'test-pune',
  name: 'Test Phoenix Mall Pune',
  country: 'India',
  city: 'Pune',
  latitude: 18.5615,
  longitude: 73.9167,
  image: '',
  address: 'Pune, India',
  openingTime: '10:00',
  closingTime: '22:00',
  timezone: 'Asia/Kolkata',
};

describe('mall status and timezone logic', () => {
  it('returns OPEN during operating hours', () => {
    // 14:30 IST = 09:00 UTC
    const date = new Date('2026-10-06T09:00:00.000Z');

    expect(getMallStatus(puneMall, date)).toBe('OPEN');
  });

  it('returns CLOSED before opening time', () => {
    // 09:30 IST = 04:00 UTC
    const date = new Date('2026-10-06T04:00:00.000Z');

    expect(getMallStatus(puneMall, date)).toBe('CLOSED');
  });

  it('returns CLOSED at the exact closing time', () => {
    // 22:00 IST = 16:30 UTC
    const date = new Date('2026-10-06T16:30:00.000Z');

    expect(getMallStatus(puneMall, date)).toBe('CLOSED');
  });

  it('returns CLOSED after closing time', () => {
    // 22:30 IST = 17:00 UTC
    const date = new Date('2026-10-06T17:00:00.000Z');

    expect(getMallStatus(puneMall, date)).toBe('CLOSED');
  });

  it('calculates local time using the mall timezone', () => {
    const date = new Date('2026-10-06T09:00:00.000Z');

    expect(getMallLocalTime('Asia/Kolkata', date)).toBe('14:30');
  });

  it('handles a mall whose operating hours cross midnight', () => {
    const nightMall: Mall = {
      ...puneMall,
      openingTime: '22:00',
      closingTime: '02:00',
    };

    const lateNight = new Date('2026-10-06T20:00:00.000Z');
    const afternoon = new Date('2026-10-06T10:00:00.000Z');

    expect(getMallStatus(nightMall, lateNight)).toBe('OPEN');
    expect(getMallStatus(nightMall, afternoon)).toBe('CLOSED');
  });
});
