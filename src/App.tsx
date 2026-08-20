import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Sparkles, 
  Ticket, 
  MapPin,
  User,
  LogIn
} from 'lucide-react';
import { 
  MediaItem, 
  Showtime, 
  Venue, 
  Seat, 
  FoodItem, 
  Currency, 
  Booking, 
  SplitGroup,
  CustomerUser
} from './types';
import { MOCK_MEDIA, MOCK_VENUES, MOCK_SHOWTIMES } from './data/mockData';
import { useLocationManager } from './hooks/useLocationManager';

// Component imports
import { Header } from './components/Header';
import { MobileTab } from './components/MobileBottomNav';
import { MobileCityDrawer } from './components/MobileCityDrawer';
import { NearbyTheatersView } from './components/NearbyTheatersView';
import { HeroBanner } from './components/HeroBanner';
import { MediaGrid } from './components/MediaGrid';
import { MediaDetailModal } from './components/MediaDetailModal';
import { SeatMap3D } from './components/SeatMap3D';
import { FoodAndBeverage } from './components/FoodAndBeverage';
import { CheckoutModal } from './components/CheckoutModal';
import { GroupSplitPaymentModal } from './components/GroupSplitPaymentModal';
import { TicketPassModal } from './components/TicketPassModal';
import { AIConciergeModal } from './components/AIConciergeModal';
import { CustomerProfileView } from './components/CustomerProfileView';
import { CustomerLoginModal } from './components/CustomerLoginModal';

export default function App() {
  // Mobile Location & Proximity State Engine
  const {
    userLocation,
    isLocating,
    currentCity,
    detectLocation,
    setCityWithPresetCoords,
    getDynamicVenues,
    getDistanceToCity
  } = useLocationManager('Hyderabad');

  const [currency, setCurrency] = useState<Currency>('INR');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Mobile Tab Navigation State: 'explore' | 'theaters' | 'passes'
  const [activeTab, setActiveTab] = useState<MobileTab>('explore');
  const [isCityDrawerOpen, setIsCityDrawerOpen] = useState<boolean>(false);

  // Filter states
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');

  // Customer Authentication State
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('showsphere_customer_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved user', e);
    }
    return null;
  });

  // Login Modal State - opens on startup if not logged in to collect user phone/email
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('showsphere_customer_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) return false;
      }
    } catch (e) {}
    return true;
  });

  const [loginNotice, setLoginNotice] = useState<string | undefined>(undefined);
  const [pendingBookingAction, setPendingBookingAction] = useState<(() => void) | null>(null);

  // Navigation / Workflow view state: 'browse' | 'seatmap' | 'food'
  const [currentView, setCurrentView] = useState<'browse' | 'seatmap' | 'food'>('browse');

  // Active Flow Selections
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedFoodItems, setSelectedFoodItems] = useState<{ item: FoodItem; quantity: number }[]>([]);
  const [seatTotalPrice, setSeatTotalPrice] = useState<number>(0);
  const [foodTotalPrice, setFoodTotalPrice] = useState<number>(0);

  // Active Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState<boolean>(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState<boolean>(false);

  // Split and Confirmed Bookings
  const [activeSplitGroup, setActiveSplitGroup] = useState<SplitGroup | undefined>(undefined);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Mandatory Authentication Guard
  const requireLogin = (action: () => void, noticeMessage?: string) => {
    if (currentUser && currentUser.isLoggedIn) {
      action();
    } else {
      setLoginNotice(noticeMessage || 'Please sign in with your phone or email to book tickets.');
      setPendingBookingAction(() => action);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: CustomerUser) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setLoginNotice(undefined);
    try {
      localStorage.setItem('showsphere_customer_user', JSON.stringify(user));
    } catch (err) {
      console.error('Failed to persist user profile', err);
    }
    if (pendingBookingAction) {
      const action = pendingBookingAction;
      setPendingBookingAction(null);
      action();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('showsphere_customer_user');
    } catch (err) {
      console.error(err);
    }
    setIsProfileOpen(false);
  };

  // Dynamically sorted venues for the active city / location
  const dynamicVenues = useMemo(() => {
    return getDynamicVenues(currentCity);
  }, [getDynamicVenues, currentCity]);

  // Filter Media Catalog
  const filteredMedia = useMemo(() => {
    return MOCK_MEDIA.filter((item) => {
      // Language
      if (selectedLanguage !== 'All' && !item.languages.includes(selectedLanguage as any)) return false;
      // Genre
      if (selectedGenre !== 'All' && !item.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()))) return false;
      // Format
      if (selectedFormat !== 'All' && !item.formats.some((f) => f.toLowerCase().includes(selectedFormat.toLowerCase()))) return false;
      
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesGenre = item.genres.some((g) => g.toLowerCase().includes(q));
        const matchesCast = item.cast.some((c) => c.name.toLowerCase().includes(q));
        const matchesDirector = item.director?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesGenre && !matchesCast && !matchesDirector) return false;
      }
      return true;
    });
  }, [selectedLanguage, selectedGenre, selectedFormat, searchQuery]);

  // Handler: Open Media Details (allows browsing details)
  const handleOpenMediaDetail = (item: MediaItem) => {
    setSelectedMedia(item);
    setIsDetailModalOpen(true);
  };

  // Handler: Quick Book (Requires Login)
  const handleQuickBook = (item: MediaItem) => {
    requireLogin(() => {
      setSelectedMedia(item);
      const availableVenues = getDynamicVenues(currentCity);
      const closestVenue = availableVenues[0] || MOCK_VENUES[0];
      const availableShow = MOCK_SHOWTIMES.find((st) => st.mediaId === item.id && st.venueId === closestVenue.id) 
        || MOCK_SHOWTIMES.find((st) => st.mediaId === item.id) 
        || MOCK_SHOWTIMES[0];
      const venue = MOCK_VENUES.find((v) => v.id === availableShow.venueId) || closestVenue;
      
      setSelectedMedia(item);
      setSelectedShowtime(availableShow);
      setSelectedVenue(venue);
      setIsDetailModalOpen(false);
      setCurrentView('seatmap');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, `Please enter your mobile number or email to book tickets for "${item.title}".`);
  };

  // Handler: Select Showtime -> Transition to 3D Seat Layout (Requires Login)
  const handleSelectShowtime = (showtime: Showtime, venue: Venue, mediaOverride?: MediaItem) => {
    const mediaToUse = mediaOverride || selectedMedia || MOCK_MEDIA.find((m) => m.id === showtime.mediaId) || MOCK_MEDIA[0];
    requireLogin(() => {
      setSelectedMedia(mediaToUse);
      setSelectedShowtime(showtime);
      setSelectedVenue(venue);
      setIsDetailModalOpen(false);
      setCurrentView('seatmap');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, `Please enter your mobile number or email to reserve seats for "${mediaToUse.title}".`);
  };

  // Handler: Seats Selected -> Go to Food or Checkout (Requires Login)
  const handleProceedFromSeats = (seats: Seat[], totalSeatsCost: number) => {
    requireLogin(() => {
      setSelectedSeats(seats);
      setSeatTotalPrice(totalSeatsCost);
      setCurrentView('food');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 'Please enter your mobile number or email to reserve seats.');
  };

  // Handler: Food Selected -> Open Checkout (Requires Login)
  const handleProceedFromFood = (items: { item: FoodItem; quantity: number }[], totalFoodCost: number) => {
    requireLogin(() => {
      setSelectedFoodItems(items);
      setFoodTotalPrice(totalFoodCost);
      setIsCheckoutModalOpen(true);
    }, 'Please enter your mobile number or email to proceed to checkout.');
  };

  // Handler: Skip Food -> Open Checkout (Requires Login)
  const handleSkipFood = () => {
    requireLogin(() => {
      setSelectedFoodItems([]);
      setFoodTotalPrice(0);
      setIsCheckoutModalOpen(true);
    }, 'Please enter your mobile number or email to proceed to checkout.');
  };

  // Handler: Successful Booking Completion
  const handleBookingConfirmed = (booking: Booking) => {
    setLatestBooking(booking);
    setUserBookings((prev) => [booking, ...prev]);
    setIsTicketModalOpen(true);
    setCurrentView('browse');
    setActiveTab('passes');
    setSelectedSeats([]);
    setSelectedFoodItems([]);
    setActiveSplitGroup(undefined);
  };

  // Handle Tab Switch
  const handleSelectTab = (tab: MobileTab) => {
    setActiveTab(tab);
    if (tab === 'passes') {
      if (userBookings.length > 0) {
        setLatestBooking(userBookings[0]);
      }
      setIsTicketModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-rose-500 selection:text-white flex flex-col antialiased">
      {/* Top Header (Clean single bar) */}
      {currentView === 'browse' && (
        <Header
          currentCity={currentCity}
          onOpenCityDrawer={() => setIsCityDrawerOpen(true)}
          userLocation={userLocation}
          isLocating={isLocating}
          onDetectLocation={() => detectLocation(true)}
          getDistanceToCity={getDistanceToCity}
          currency={currency}
          onSelectCurrency={setCurrency}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLanguage={selectedLanguage as any}
          onSelectLanguage={setSelectedLanguage as any}
          bookedTicketsCount={userBookings.length}
          onOpenAIConcierge={() => setIsAiConciergeOpen(true)}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          currentUser={currentUser}
          onOpenLogin={() => {
            setLoginNotice(undefined);
            setIsLoginModalOpen(true);
          }}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenWallet={() => {
            if (userBookings.length > 0) {
              setLatestBooking(userBookings[0]);
            }
            setIsTicketModalOpen(true);
          }}
        />
      )}

      {/* Main Content Area */}
      {currentView === 'browse' && (
        <main className="flex-1 max-w-5xl w-full mx-auto pb-20">
          {/* TAB 1: Movies */}
          {activeTab === 'explore' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Hero Banner Carousel (hidden when searching) */}
              {!searchQuery && (
                <div className="px-3 sm:px-4 pt-3 sm:pt-4">
                  <HeroBanner
                    items={MOCK_MEDIA}
                    onSelectMedia={handleOpenMediaDetail}
                    onQuickBook={handleQuickBook}
                    currency={currency}
                  />
                </div>
              )}

              {/* Media Grid */}
              <MediaGrid
                items={filteredMedia}
                onSelectMedia={handleOpenMediaDetail}
                onQuickBook={handleQuickBook}
                title={`Now Showing in ${currentCity}`}
                subtitle="Tap any movie to explore showtimes and select seats"
              />
            </div>
          )}

          {/* TAB 2: Dedicated Cinemas / Theaters View */}
          {activeTab === 'theaters' && (
            <div className="pt-4 px-3 sm:px-4">
              <NearbyTheatersView
                currentCity={currentCity}
                venues={dynamicVenues}
                userLocation={userLocation}
                isLocating={isLocating}
                onDetectLocation={() => detectLocation(true)}
                currency={currency}
                onSelectShowtime={handleSelectShowtime}
                onSelectMedia={handleOpenMediaDetail}
              />
            </div>
          )}

          {/* TAB 3: My Tickets */}
          {activeTab === 'passes' && (
            <div className="pt-12 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-sm">
                <Ticket className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your Movie Tickets</h2>
              <p className="text-sm text-slate-600">
                {userBookings.length > 0 
                  ? `You have ${userBookings.length} confirmed booking(s).` 
                  : "You haven't booked any movie tickets yet. Pick a movie and book your seats!"}
              </p>
              {userBookings.length > 0 ? (
                <button
                  onClick={() => setIsTicketModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 cursor-pointer transition"
                >
                  View Digital Passes & QR Code
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 cursor-pointer transition"
                >
                  Browse Now Showing Movies
                </button>
              )}
            </div>
          )}

          {/* Small Floating Customer Profile Popover (Anchored at Bottom Right) */}
          {(isProfileOpen || activeTab === 'profile') && (
            <div className="fixed inset-0 sm:inset-auto sm:bottom-18 sm:right-5 z-50 flex items-end sm:items-auto justify-center sm:justify-end p-3 sm:p-0 bg-slate-900/40 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none">
              <CustomerProfileView
                currentCity={currentCity}
                currentUser={currentUser}
                userBookings={userBookings}
                currency={currency}
                onClose={() => {
                  setIsProfileOpen(false);
                  if (activeTab === 'profile') setActiveTab('explore');
                }}
                onOpenLogin={() => {
                  setIsProfileOpen(false);
                  setLoginNotice(undefined);
                  setIsLoginModalOpen(true);
                }}
                onLogout={handleLogout}
                onUpdateUser={setCurrentUser}
                onOpenTickets={() => {
                  setIsProfileOpen(false);
                  if (userBookings.length > 0) {
                    setLatestBooking(userBookings[0]);
                    setIsTicketModalOpen(true);
                  } else {
                    setActiveTab('passes');
                  }
                }}
                onSelectBookingTicket={(bk) => {
                  setLatestBooking(bk);
                  setIsTicketModalOpen(true);
                }}
                onExploreMovies={() => {
                  setIsProfileOpen(false);
                  setActiveTab('explore');
                }}
              />
            </div>
          )}

          {/* Small Floating Customer Profile Button on the Bottom Right */}
          <div className="fixed bottom-5 right-5 z-40">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
              }}
              className={`flex items-center gap-2 p-1.5 pr-3 rounded-full shadow-lg border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                isProfileOpen || activeTab === 'profile'
                  ? 'bg-slate-900 text-white border-slate-700 shadow-slate-900/30'
                  : 'bg-white/95 hover:bg-white text-slate-800 border-slate-200 shadow-slate-300/40 backdrop-blur-sm'
              }`}
              title="Customer Profile & CineClub"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {currentUser?.isLoggedIn ? currentUser.name.charAt(0) : <User className="w-4 h-4 text-white" />}
                </div>
                {currentUser?.isLoggedIn && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center text-[8px] font-black border border-white">
                    ★
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold leading-tight">
                  {currentUser?.isLoggedIn ? currentUser.name.split(' ')[0] : 'Sign In'}
                </div>
                <div className="text-[9px] text-amber-500 font-bold leading-tight">
                  {currentUser?.isLoggedIn ? currentUser.membershipTier : 'Required to Book'}
                </div>
              </div>
            </button>
          </div>
        </main>
      )}

      {/* Step 1: 3D Seat Map View */}
      {currentView === 'seatmap' && selectedShowtime && selectedVenue && (
        <SeatMap3D
          showtime={selectedShowtime}
          venue={selectedVenue}
          currency={currency}
          onProceedToFoodOrCheckout={handleProceedFromSeats}
          onBack={() => setCurrentView('browse')}
        />
      )}

      {/* Step 2: Food & Concessions Dining View */}
      {currentView === 'food' && (
        <FoodAndBeverage
          currency={currency}
          onProceedToCheckout={handleProceedFromFood}
          onSkip={handleSkipFood}
          onBack={() => setCurrentView('seatmap')}
        />
      )}

      {/* City Drawer */}
      <MobileCityDrawer
        isOpen={isCityDrawerOpen}
        onClose={() => setIsCityDrawerOpen(false)}
        currentCity={currentCity}
        onSelectCity={setCityWithPresetCoords}
        userLocation={userLocation}
        isLocating={isLocating}
        onDetectLocation={() => detectLocation(true)}
        getDistanceToCity={getDistanceToCity}
      />

      {/* Movie Details & Showtimes Modal */}
      <MediaDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        media={selectedMedia}
        currentCity={currentCity}
        currency={currency}
        userLocation={userLocation}
        isLocating={isLocating}
        onDetectLocation={() => detectLocation(true)}
        onSelectShowtime={handleSelectShowtime}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        media={selectedMedia}
        venue={selectedVenue}
        showtime={selectedShowtime}
        seats={selectedSeats}
        foodItems={selectedFoodItems}
        seatTotalPrice={seatTotalPrice}
        foodTotalPrice={foodTotalPrice}
        currency={currency}
        currentUser={currentUser}
        onBookingConfirmed={handleBookingConfirmed}
        onOpenSplitModal={(group) => {
          setActiveSplitGroup(group);
          setIsSplitModalOpen(true);
        }}
      />

      {/* Group Split Pay Modal */}
      <GroupSplitPaymentModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        splitGroup={activeSplitGroup}
        currency={currency}
        onCompleteAllSplits={(booking) => {
          setIsSplitModalOpen(false);
          setIsCheckoutModalOpen(false);
          handleBookingConfirmed(booking);
        }}
      />

      {/* Ticket Pass with QR Modal */}
      <TicketPassModal
        isOpen={isTicketModalOpen}
        onClose={() => {
          setIsTicketModalOpen(false);
        }}
        booking={latestBooking}
        allBookings={userBookings}
        onSelectBooking={(b) => setLatestBooking(b)}
        currency={currency}
      />

      {/* AI Movie Recommendation Modal */}
      <AIConciergeModal
        isOpen={isAiConciergeOpen}
        onClose={() => {
          setIsAiConciergeOpen(false);
        }}
        currentCity={currentCity}
        currency={currency}
        onQuickBook={handleQuickBook}
        onSelectShowtime={handleSelectShowtime}
      />

      {/* Mandatory Customer Login Modal */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingBookingAction(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        bookingBlockedNotice={loginNotice}
      />
    </div>
  );
}
