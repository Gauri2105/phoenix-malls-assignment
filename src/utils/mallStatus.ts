import type { Mall, MallStatus } from '../types/mall';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function timeToMinutes(time: string): number {
  if (!TIME_PATTERN.test(time)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
}

export function getMallLocalTime(
  timezone: string,
  date: Date = new Date(),
): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function getMallStatus(
  mall: Mall,
  date: Date = new Date(),
): MallStatus {
  const localTime = getMallLocalTime(mall.timezone, date);

  const currentMinutes = timeToMinutes(localTime);
  const openingMinutes = timeToMinutes(mall.openingTime);
  const closingMinutes = timeToMinutes(mall.closingTime);

  // Normal operating hours, e.g. 10:00 → 22:00
  if (openingMinutes < closingMinutes) {
    return currentMinutes >= openingMinutes &&
      currentMinutes < closingMinutes
      ? 'OPEN'
      : 'CLOSED';
  }

  // Midnight-crossing hours, e.g. 18:00 → 02:00
  if (openingMinutes > closingMinutes) {
    return currentMinutes >= openingMinutes ||
      currentMinutes < closingMinutes
      ? 'OPEN'
      : 'CLOSED';
  }

  // opening === closing is treated as closed.
  return 'CLOSED';
}

export function getMallWithStatus(
  mall: Mall,
  date: Date = new Date(),
) {
  return {
    ...mall,
    status: getMallStatus(mall, date),
    currentLocalTime: getMallLocalTime(mall.timezone, date),
  };
}