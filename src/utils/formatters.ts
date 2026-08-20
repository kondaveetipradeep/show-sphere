import { Currency, Seat, SeatTier, Showtime } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

export function formatPrice(amountInINR: number, currency: Currency): string {
  const rateObj = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
  const converted = amountInINR * rateObj.rate;
  
  if (currency === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }
  if (currency === 'USD') {
    return `$${converted.toFixed(2)}`;
  }
  if (currency === 'EUR') {
    return `€${converted.toFixed(2)}`;
  }
  if (currency === 'GBP') {
    return `£${converted.toFixed(2)}`;
  }
  if (currency === 'AED') {
    return `AED ${converted.toFixed(1)}`;
  }
  return `${rateObj.symbol}${converted.toFixed(2)}`;
}

export function generateSeatsForShowtime(showtime: Showtime): Seat[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const colsPerRow = 16;
  const seats: Seat[] = [];

  rows.forEach((row, rIdx) => {
    let tier: SeatTier = 'classic';
    let basePrice = showtime.basePrices.classic;

    if (rIdx <= 1) {
      tier = 'vip'; // Recliner rows A & B
      basePrice = showtime.basePrices.vip;
    } else if (rIdx <= 4) {
      tier = 'primePlus'; // Prime rows C, D, E
      basePrice = showtime.basePrices.primePlus;
    } else if (rIdx <= 7) {
      tier = 'executive'; // Executive rows F, G, H
      basePrice = showtime.basePrices.executive;
    } else {
      tier = 'classic'; // Classic rows J, K
      basePrice = showtime.basePrices.classic;
    }

    const distanceRatio = (rIdx + 1) / rows.length;

    for (let c = 1; c <= colsPerRow; c++) {
      const isAisle = c === 4 || c === 12;
      const isCouple = tier === 'vip' && (c === 7 || c === 8 || c === 9 || c === 10);
      const isWheelchair = tier === 'classic' && (c === 1 || c === 16);
      
      // Calculate angle to center screen
      const centerCol = 8.5;
      const offset = c - centerCol;
      const angle = Math.round(offset * 2.8);

      // Seed pseudo-random pre-booked status for realism
      const seed = (showtime.id.charCodeAt(showtime.id.length - 1) * 31 + rIdx * 17 + c * 13) % 100;
      const isPreBooked = seed < 28; // ~28% booked seats

      seats.push({
        id: `${row}${c}`,
        row,
        col: c,
        tier,
        price: basePrice,
        status: isPreBooked ? 'booked' : 'available',
        isAisleRight: isAisle,
        isCouple,
        isWheelchair,
        angleToScreen: angle,
        distanceToScreenRatio: distanceRatio,
      });
    }
  });

  return seats;
}

export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
