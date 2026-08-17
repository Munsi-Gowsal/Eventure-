import React, { useState, useDeferredValue, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, MapPin, Search, Share2, ChevronsRight } from 'lucide-react';
import { eventsApi } from '../features/events/api';

import { EventCardSkeleton } from '../features/events/components/EventCardSkeleton';
import ScrollMorphHero from '../components/ui/scroll-morph-hero';
import { ChatWidget } from '../components/ui/ChatWidget';

const CATEGORIES = [
  'All', 'Tech', 'Music', 'Comedy', 'Workshop', 'Business', 'Health', 'Education', 'Art'
];

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Optional: focus the search input if they scrolled to search
        if (id === 'search') {
          const input = element.querySelector('input');
          if (input) input.focus();
        }
      }
    }
  }, [location.hash]);

  const deferredSearch = useDeferredValue(searchQuery);

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', activeCategory, deferredSearch],
    queryFn: () => eventsApi.getEvents({ 
      category: activeCategory !== 'All' ? activeCategory.toLowerCase() : undefined, 
      search: deferredSearch || undefined
    }),
  });

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="w-full h-[600px] md:h-[700px] border-b border-[var(--color-border-subtle)] relative overflow-hidden">
        <ScrollMorphHero />
      </section>

      {/* Personalize & Search Section */}
      <section id="search" className="px-6 py-12 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col mb-10 items-center justify-center text-center">
          <h2 className="text-4xl font-medium mb-8">Discover Events</h2>
          
          {/* Glassmorphic Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <div className="relative w-full max-w-2xl group">
              {/* White Circle Background for Search Icon */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[46px] h-[46px] bg-white rounded-full flex items-center justify-center shadow-sm z-10 transition-transform group-focus-within:scale-105">
                <Search className="text-[#2A0E2A]" size={22} strokeWidth={2.5} />
              </div>
              
              {/* Search Input */}
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-[70px] pr-8 py-4 rounded-full bg-[#2A0E2A]/70 backdrop-blur-xl border-2 border-white/90 text-white placeholder:text-white/80 focus:outline-none focus:border-white focus:bg-[#2A0E2A]/90 transition-all text-lg shadow-[0_8px_32px_rgba(42,14,42,0.3)] hover:shadow-[0_8px_32px_rgba(42,14,42,0.5)]"
              />
            </div>
          </div>
        </div>
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-[var(--color-accent-secondary)] border-[var(--color-accent-primary)] text-white'
                  : 'bg-[var(--color-bg-card)] border-[var(--color-border-subtle)] text-gray-300 hover:border-gray-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Events List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <EventCardSkeleton key={n} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 border border-red-500/20 rounded-xl bg-red-500/5">
            Failed to load events. Please try again.
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border border-[var(--color-border-subtle)] rounded-xl bg-[var(--color-bg-card)]/50">
            <Search className="mx-auto mb-4 text-gray-500" size={32} />
            <h3 className="text-xl text-white mb-2">No events found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events?.map((event) => (
              <div key={event._id} className="group flex flex-col bg-[#141b24] border border-[#2a3644] rounded-[16px] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 overflow-hidden relative p-3 pb-0">
                  {event.bannerImageUrl ? (
                    <img 
                      src={event.bannerImageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover rounded-t-[12px]"
                      onError={(e) => {
                        // Fallback to a placeholder pattern if the image fails to load
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-t-[12px]">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  {event.category && (
                    <div className="absolute top-5 left-5 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                      {event.category}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[15px] font-bold text-white uppercase tracking-wide leading-snug pr-4 line-clamp-2">
                      <Link to={`/events/${event._id}`} className="hover:text-[#e41e3f] transition-colors">
                        {event.title}
                      </Link>
                    </h3>
                    <Share2 size={18} className="text-white shrink-0 cursor-pointer hover:text-[#e41e3f] transition-colors" />
                  </div>
                  
                  <div className="mt-auto space-y-3 text-[13px] text-gray-300">
                    {event.location && (
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="shrink-0 mt-0.5" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} {event.time && `| ${event.time}`}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex justify-between items-center mt-2">
                  <Link to={`/events/${event._id}`} className="bg-[#e41e3f] hover:bg-[#c31733] text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm shadow-lg shadow-[#e41e3f]/20">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How to list your events section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-medium text-center text-[#9b51e0] mb-10">How to list your events</h2>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          
          <div className="flex flex-col items-center text-center flex-1">
            <span className="text-5xl font-bold text-white mb-4">01</span>
            <h3 className="text-xl font-bold text-white mb-2">Register</h3>
            <p className="text-gray-400 text-sm">Sign up as an organiser in minutes</p>
          </div>

          <div className="hidden md:block text-gray-500">
            <ChevronsRight size={32} />
          </div>

          <div className="flex flex-col items-center text-center flex-1">
            <span className="text-5xl font-bold text-white mb-4">02</span>
            <h3 className="text-xl font-bold text-white mb-2">List your event</h3>
            <p className="text-gray-400 text-sm">Add event details, images & ticketing information</p>
          </div>

          <div className="hidden md:block text-gray-500">
            <ChevronsRight size={32} />
          </div>

          <div className="flex flex-col items-center text-center flex-1">
            <span className="text-5xl font-bold text-white mb-4">03</span>
            <h3 className="text-xl font-bold text-white mb-2">Event is live</h3>
            <p className="text-gray-400 text-sm">Your event is now live on Eventure</p>
          </div>

        </div>
      </section>

      {/* Chat Widget integrated at the root page level */}
      <ChatWidget />
    </div>
  );
};
