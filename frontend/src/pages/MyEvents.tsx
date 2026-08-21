import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink, QrCode } from 'lucide-react';

export const MyEvents: React.FC = () => {
  // Mock data for user's registered events
  const registeredEvents = [
    {
      id: '1',
      title: 'Global Tech Summit 2026',
      date: '2026-10-15T09:00:00Z',
      time: '9:00 AM PST',
      location: 'Moscone Center, SF',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Neon Nights Festival',
      date: '2026-09-05T20:00:00Z',
      time: '8:00 PM EST',
      location: 'Brooklyn Mirage, NY',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      status: 'upcoming'
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="w-full py-12 px-6 md:px-12 lg:px-16 border-b-[3px] border-black bg-[#FF3366]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-block bg-white border-2 border-black px-3 py-1 font-bold uppercase text-xs mb-4 shadow-[2px_2px_0px_0px_#000]">
              Attendee Dashboard
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter text-white text-shadow-[4px_4px_0px_#000]">
              My Events
            </h1>
          </div>
          <Link to="/" className="neo-button px-6 py-3 bg-white text-black hover:bg-[#FFD23F] flex items-center gap-2">
            Browse More <ExternalLink size={18} strokeWidth={3} />
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16">
        {registeredEvents.length === 0 ? (
          <div className="neo-card p-12 bg-white text-center flex flex-col items-center">
            <h2 className="text-3xl font-black font-display uppercase mb-4">No events yet</h2>
            <p className="font-bold text-gray-500 mb-8">You haven't registered for any events.</p>
            <Link to="/" className="neo-button px-8 py-4 bg-[#00E5FF] text-xl">Start Exploring</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {registeredEvents.map(event => (
              <div key={event.id} className="neo-card bg-white flex flex-col sm:flex-row overflow-hidden group">
                <div className="w-full sm:w-2/5 h-48 sm:h-auto border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-black relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute top-2 right-2 bg-[#FFD23F] border-2 border-black px-2 py-1 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                    {event.status}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black font-display uppercase leading-tight mb-4">
                    <Link to={`/events/${event.id}`} className="hover:underline decoration-[3px] underline-offset-4">
                      {event.title}
                    </Link>
                  </h3>
                  
                  <div className="space-y-2 font-bold text-sm mb-6 flex-1">
                    <div className="flex items-start gap-3">
                      <Calendar size={18} strokeWidth={3} className="text-[#00E5FF] shrink-0 mt-0.5" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | {event.time}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} strokeWidth={3} className="text-[#FF3366] shrink-0 mt-0.5" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="neo-button flex-1 py-3 bg-[#00E5FF] hover:bg-white text-sm flex items-center justify-center gap-2">
                      <QrCode size={16} strokeWidth={3} /> Ticket
                    </button>
                    <button className="neo-button px-4 py-3 bg-white text-sm hover:bg-gray-200">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
