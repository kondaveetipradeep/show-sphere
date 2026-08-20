import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ChevronRight
} from 'lucide-react';
import { FoodItem, Currency } from '../types';
import { MOCK_FOOD_ITEMS } from '../data/mockData';
import { formatPrice } from '../utils/formatters';

interface FoodAndBeverageProps {
  currency: Currency;
  onProceedToCheckout: (items: { item: FoodItem; quantity: number }[], totalFoodPrice: number) => void;
  onSkip: () => void;
  onBack: () => void;
}

export const FoodAndBeverage: React.FC<FoodAndBeverageProps> = ({
  currency,
  onProceedToCheckout,
  onSkip,
  onBack,
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'f-truffle-popcorn': 1,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Popcorn', 'Combos', 'Snacks', 'Beverages', 'Desserts'];

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const safeFoodItems = Array.isArray(MOCK_FOOD_ITEMS) ? MOCK_FOOD_ITEMS : [];

  const selectedItems = safeFoodItems.filter((item) => (quantities[item.id] || 0) > 0).map((item) => ({
    item,
    quantity: quantities[item.id] || 0,
  }));

  const totalFoodPrice = selectedItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);

  const filteredItems = selectedCategory === 'All'
    ? safeFoodItems
    : safeFoodItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 pb-28 pt-4 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header Navigation */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer border border-slate-200"
            >
              &larr; Seats
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-rose-600" />
                <span>Cinema Concessions & Dining</span>
              </h2>
              <p className="text-xs text-slate-500">
                Delivered straight to your seat before showtime
              </p>
            </div>
          </div>

          <button
            onClick={onSkip}
            className="text-xs text-slate-500 hover:text-slate-900 underline font-medium transition cursor-pointer"
          >
            Skip to Pay
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredItems.map((item) => {
            const qty = quantities[item.id] || 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-3.5 flex gap-3.5 hover:border-slate-300 transition shadow-2xs"
              >
                {/* Food Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative border border-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.isVeg && (
                    <div className="absolute top-1 left-1 w-3.5 h-3.5 rounded bg-white flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-1">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-extrabold text-sm text-slate-900">
                      {formatPrice(item.price, currency)}
                    </span>

                    {/* Add / Quantity buttons */}
                    {qty === 0 ? (
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        <button
                          onClick={() => handleDecrement(item.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 w-4 text-center">{qty}</span>
                        <button
                          onClick={() => handleIncrement(item.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-rose-600 hover:text-rose-700 cursor-pointer font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-xl">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              Food Total: {selectedItems.length} item(s)
            </div>
            <div className="text-lg font-black text-rose-600">
              {formatPrice(totalFoodPrice, currency)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSkip}
              className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer border border-slate-200"
            >
              Skip Food
            </button>
            <button
              onClick={() => onProceedToCheckout(selectedItems, totalFoodPrice)}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Pay & Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
