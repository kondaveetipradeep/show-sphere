export type MediaType = 'movie';

export type Language = 
  | 'All'
  | 'Telugu'
  | 'Hindi'
  | 'Tamil'
  | 'English'
  | 'Malayalam'
  | 'Kannada'
  | 'Korean'
  | 'Japanese'
  | 'Spanish';

export type Format = '2D' | '3D' | 'IMAX 3D' | 'IMAX 2D' | '4DX' | 'Dolby Atmos' | 'ScreenX' | 'VIP INSIGNIA';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyRate {
  symbol: string;
  rate: number; // relative to INR (e.g. 1 INR = 0.012 USD)
  code: Currency;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  city?: string;
  state?: string;
  neighborhood?: string;
  formattedAddress?: string;
  source: 'gps' | 'manual' | 'ip' | 'preset';
  timestamp: number;
}

export interface City {
  name: string;
  state: string;
  region: 'Telangana' | 'Andhra Pradesh' | 'Other States' | 'International';
  cinemasCount: number;
  trendingTag: string;
  isTeluguState?: boolean;
  coordinates?: Coordinates;
}

export interface CastMember {
  name: string;
  role: string;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-10
  source: 'Critic' | 'Audience' | 'Verified';
  comment: string;
  date: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl?: string;
  rating: number; // out of 10
  votesCount: string;
  languages: Language[];
  formats: Format[];
  genres: string[];
  durationMinutes: number;
  releaseDate: string;
  censorRating: 'U' | 'UA' | 'A' | 'PG-13' | 'R' | 'All Ages';
  description: string;
  director?: string;
  musicDirector?: string;
  producer?: string;
  cinematographer?: string;
  cast: CastMember[];
  reviews: Review[];
  trending?: boolean;
  featured?: boolean;
  badge?: string;
  likesCount?: string;
}

export interface Venue {
  id: string;
  name: string;
  chain: string;
  city: string;
  state: string;
  address: string;
  distanceKm: number;
  amenities: string[];
  soundSystem: string;
  screenTechnology: string;
  coordinates?: Coordinates;
}

export interface Showtime {
  id: string;
  mediaId: string;
  venueId: string;
  screenName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  format: Format;
  language: Language;
  soundType: string;
  basePrices: {
    vip: number;
    primePlus: number;
    executive: number;
    classic: number;
    balcony?: number;
  };
  totalSeats: number;
  availableSeats: number;
  fillingFast?: boolean;
}

export type SeatTier = 'vip' | 'primePlus' | 'executive' | 'classic' | 'balcony';

export type SeatStatus = 'available' | 'locked' | 'booked' | 'selected' | 'handicap' | 'couple_left' | 'couple_right';

export interface Seat {
  id: string; // e.g. "A-12"
  row: string; // "A"
  col: number; // 12
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  lockedBy?: string;
  lockedUntil?: number; // timestamp
  isAisleRight?: boolean;
  isWheelchair?: boolean;
  isCouple?: boolean;
  angleToScreen: number; // degrees
  distanceToScreenRatio: number; // 0.1 to 1.0
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Snacks' | 'Combos' | 'Beverages' | 'Desserts';
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  calories?: string;
  servesCount?: number;
}

export interface SplitMember {
  id: string;
  name: string;
  phoneOrEmail: string;
  amount: number;
  status: 'pending' | 'paid' | 'declined';
  paidAt?: string;
  isHost?: boolean;
}

export interface SplitGroup {
  id: string;
  bookingId: string;
  totalAmount: number;
  currency: Currency;
  hostName: string;
  members: SplitMember[];
  expiresAt: number;
  shareableCode: string;
  isFullySettled: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  media: MediaItem;
  venue: Venue;
  showtime: Showtime;
  seats: Seat[];
  foodItems: { item: FoodItem; quantity: number }[];
  totalAmount: number;
  currency: Currency;
  currencySymbol: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  createdAt: string;
  paymentMethod: 'Stripe Card' | 'Apple Pay' | 'Google Pay' | 'UPI Instant' | 'Split Payment';
  paymentStatus: 'paid' | 'partially_paid' | 'pending';
  splitGroup?: SplitGroup;
  qrData: string;
  barcodeData: string;
  status: 'confirmed' | 'cancelled' | 'attended';
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  membershipTier: 'Silver' | 'Gold' | 'Platinum' | 'VIP';
  loyaltyPoints: number;
  isLoggedIn: boolean;
  preferredFormat?: string;
  preferredSeating?: string;
}

export interface AIRecommendationRequest {
  mood?: string;
  genres?: string[];
  language?: string;
  groupType?: 'solo' | 'couple' | 'friends' | 'family';
  budgetLevel?: 'budget' | 'standard' | 'luxury';
  city?: string;
  recentWatched?: string[];
}

export interface AIRecommendationResponse {
  recommendations: {
    mediaId: string;
    matchScore: number; // 0-100
    whyYouWillLoveIt: string;
    idealFor: string;
    suggestedFormat: string;
  }[];
  summaryAdvice: string;
  vibeAnalysis: string;
}

export interface RedisSystemStats {
  redisConnected: boolean;
  uptimeSeconds: number;
  totalLocksProcessed: number;
  activeLocksCount: number;
  cacheHitRatio: number; // e.g. 99.4%
  avgSeatQueryLatencyMs: number; // e.g. 0.8ms
  peakQPS: number;
  concurrentUsersSimulated: number;
  memoryUsedMb: number;
}
