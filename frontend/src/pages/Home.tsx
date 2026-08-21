import React, { useState, useDeferredValue, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, MapPin, Search, ArrowRight, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { eventsApi } from '../features/events/api';
import { EventCardSkeleton } from '../features/events/components/EventCardSkeleton';

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
      {/* Neo-Brutalist Hero Section */}
      <section className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6 border-b-[3px] border-black bg-[#FF3366] relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div 
          animate={{ 
            x: [0, 100, 300, 150, 0], 
            y: [0, 80, -20, 50, 0], 
            scale: [1, 1.5, 0.8, 1.2, 1],
            rotate: [12, -45, 90, -12, 12] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-20 h-20 bg-[#FFD23F] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hidden md:block z-20" 
        />
        <motion.div 
          animate={{ 
            x: [0, -200, -400, -150, 0], 
            y: [0, -100, 50, -80, 0],
            scale: [1, 0.6, 1.8, 0.9, 1],
            rotate: [0, 180, 360, 180, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-32 h-32 bg-[#00E5FF] border-[3px] border-black shadow-[8px_8px_0px_0px_#000] rounded-full hidden md:block z-0" 
        />
        
        <div className="z-10 max-w-4xl mx-auto flex flex-col items-center bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_#000] p-10 md:p-16">
          <div className="inline-flex items-center gap-2 bg-[#FFD23F] border-2 border-black px-4 py-2 mb-6 font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_#000]">
            <Star size={18} fill="currentColor" /> The Best Events
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-display tracking-tighter uppercase mb-6 leading-none">
            Find Your Next <br /> <span className="text-[#FF3366]">Obsession.</span>
          </h1>
          <p className="text-lg md:text-xl font-bold max-w-2xl mx-auto mb-10 border-l-[6px] border-[#00E5FF] pl-4 text-left">
            Discover underground music, cutting-edge tech conferences, and workshops that will blow your mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}
              className="neo-button px-8 py-4 text-xl flex items-center justify-center gap-2 bg-[#00E5FF]"
            >
              Start Exploring <ArrowRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      </section>

      {/* Personalize & Search Section */}
      <section id="search" className="px-6 py-20 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col mb-16 items-center justify-center text-center">
          <h2 className="text-5xl md:text-6xl font-black font-display uppercase mb-10 inline-block border-b-[6px] border-[#FFD23F]">
            Discover Events
          </h2>
          
          {/* Neo-Brutalist Search Bar */}
          <div className="w-full max-w-3xl relative flex">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10">
              <Search size={28} strokeWidth={3} />
            </div>
            <input 
              type="text" 
              placeholder="SEARCH EVENTS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neo-input w-full pl-16 pr-8 py-6 text-xl font-bold uppercase placeholder:text-gray-400"
            />
          </div>
        </div>
        
        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 font-bold font-display uppercase border-[3px] border-black transition-all ${
                activeCategory === category
                  ? 'bg-[#FF3366] text-white shadow-[4px_4px_0px_0px_#000] -translate-y-1'
                  : 'bg-white text-black hover:bg-[#FFD23F] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Events List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <EventCardSkeleton key={n} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-black border-[3px] border-black neo-card bg-white font-bold text-xl uppercase">
            Failed to load events. Please try again.
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-20 border-[3px] border-black neo-card bg-white flex flex-col items-center">
            <Search className="mb-6" size={64} strokeWidth={2} />
            <h3 className="text-3xl font-black font-display uppercase mb-4">No events found</h3>
            <p className="font-bold text-lg">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events?.map((event) => (
              <div key={event._id} className="neo-card flex flex-col h-full bg-white group">
                <div className="h-56 relative border-b-[3px] border-black overflow-hidden bg-[#f4f4f0]">
                  {event.bannerImageUrl ? (
                    <img 
                      src={event.bannerImageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold uppercase text-gray-400">
                      No Image
                    </div>
                  )}
                  {event.category && (
                    <div className="absolute top-4 left-4 bg-[#FFD23F] border-2 border-black px-3 py-1 font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                      {event.category}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black font-display uppercase leading-tight mb-6 line-clamp-2">
                    <Link to={`/events/${event._id}`} className="hover:underline decoration-[3px] underline-offset-4">
                      {event.title}
                    </Link>
                  </h3>
                  
                  <div className="mt-auto space-y-3 font-bold text-sm">
                    {event.location && (
                      <div className="flex items-start gap-3">
                        <MapPin size={18} strokeWidth={2.5} className="text-[#FF3366] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Calendar size={18} strokeWidth={2.5} className="text-[#00E5FF] shrink-0 mt-0.5" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {event.time && `| ${event.time}`}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Link 
                    to={`/events/${event._id}`} 
                    className="neo-button w-full py-3 flex items-center justify-center gap-2 bg-white hover:bg-[#FFD23F]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How to list your events section */}
      <section className="w-full border-t-[3px] border-black bg-transparent relative">
        <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 flex flex-col lg:flex-row items-center gap-10 md:gap-12 relative z-10">
          
          {/* Left Side */}
          <div className="flex flex-col justify-center w-full lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, rotateX: -90, y: 50 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              style={{ transformPerspective: 1000, transformOrigin: "bottom" }}
              className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-4 md:mb-6 leading-none"
            >
              <span className="text-black block">HOST YOUR OWN</span>
              <span 
                className="text-white block mt-2" 
                style={{ WebkitTextStroke: '2px black' }}
              >
                EVENT
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, rotateX: -90, y: 30 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              style={{ transformPerspective: 1000, transformOrigin: "bottom" }}
              className="font-bold text-lg md:text-xl text-black mb-8 max-w-lg leading-relaxed"
            >
              Got an idea? We've got the platform. Create, manage, and sell tickets to your event in minutes.
            </motion.p>
            <Link 
              to="/admin/login" 
              className="neo-button px-6 py-3 text-lg inline-flex items-center justify-between gap-4 w-fit bg-white text-black hover:bg-black hover:text-white transition-colors"
            >
              CREATE EVENT <Plus size={20} strokeWidth={3} />
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-4 md:gap-5 w-full lg:w-1/2">
            {[
              { step: '1', color: 'bg-[#00E5FF]', title: 'SET THE DETAILS', desc: 'Name, date, location (or virtual link).' },
              { step: '2', color: 'bg-[#FF3366]', title: 'PRICE IT RIGHT', desc: 'Free, paid, or tiered ticketing options.' },
              { step: '3', color: 'bg-[#FFD23F]', title: 'GO LIVE & HYPE', desc: 'Publish and share your unique event page.' }
            ].map((item) => (
              <div key={item.step} className="neo-card bg-white p-4 md:p-6 flex items-center gap-4 md:gap-6">
                <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full border-[3px] border-black flex items-center justify-center text-2xl font-black font-display text-black ${item.color}`}>
                  {item.step}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-black font-display uppercase mb-1 md:mb-2 leading-none text-black">
                    {item.title}
                  </h3>
                  <p className="font-bold text-gray-700 text-xs md:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* About Us Section */}
      <section className="w-full bg-transparent relative overflow-hidden py-24 border-t-[3px] border-black">
        {/* Decorative Shapes */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#00E5FF] border-[4px] border-black z-0"></div>
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#FFD23F] border-[4px] border-black transform rotate-12 z-0"></div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-10 text-center"
          >
            WE ARE <span className="text-[#FF3366]">EVENTURE.</span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="bg-white border-[4px] border-black p-8 md:p-14 max-w-4xl shadow-[12px_12px_0px_0px_#000]"
          >
            <p className="text-xl md:text-[28px] font-bold font-sans leading-snug md:leading-relaxed text-center text-black">
              We're not here for the ordinary. We're here for the{' '}
              <span className="bg-[#00E5FF] px-2 py-0.5 border-2 border-black inline-block -rotate-2 transform">bold</span>, the{' '}
              <span className="bg-[#FFD23F] px-2 py-0.5 border-2 border-black inline-block rotate-2 transform">loud</span>, and the{' '}
              <span className="text-[#FF3366] underline decoration-4 underline-offset-4 font-black">unforgettable</span>. 
              Eventure is the ultimate playground for creators and seekers to collide, building a community where every gathering is a statement and every moment is an obsession.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
