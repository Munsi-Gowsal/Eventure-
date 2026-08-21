import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, ArrowLeft, Users, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { eventsApi } from '../features/events/api';
import { useToast } from '../components/ui/ToastContext';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getEvent(id!),
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.registerForEvent(id!),
    onSuccess: (data) => {
      setRegisterStatus('success');
      toast('Successfully registered for the event!', 'success');
      queryClient.setQueryData(['event', id], data.event);
    },
    onError: (err: any) => {
      setRegisterStatus('error');
      toast(err.response?.data?.error || 'Failed to register for the event.', 'error');
    },
  });

  if (isLoading) return <div className="p-12 text-center text-xl font-bold uppercase">Loading event details...</div>;
  if (error || !event) return <div className="p-12 text-center text-xl font-bold uppercase text-[#FF3366]">Failed to load event.</div>;

  const isFull = event.attendees >= event.maxAttendees;

  return (
    <div className="w-full">
      {/* Hero Banner Section */}
      <section className="relative w-full h-[500px] flex items-end pb-12 px-6 md:px-12 lg:px-16 border-b-[3px] border-black bg-[#FFD23F]">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-40 mix-blend-multiply" 
            style={{ backgroundImage: `url('${event.bannerImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL1GU9XOmAWbJT-5VRtAAduDblUlCO6pnKjNS4fSBLdweKSQ-SbqC_MRrjLDn8jtB6vW-YEsK9TkF6IoBvFVEdRToTa167aODah0YKqWTev0YAGDF3o3-tAo-hx_yNPqt2hnbatRJnzRuqI44ax8BALrsg9u_PlGkRG7_8z_tOa8HLuoPzXMb7baqlFdBSic4zCwpmt9KC078y6WwSdpNdVPwGxLJwiN2JVqkTpIiqyKyUEVpDtHRSIg'}')` }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-4">
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center gap-2 text-black hover:bg-black hover:text-white border-2 border-black px-4 py-2 transition-colors font-bold uppercase">
              <ArrowLeft size={18} strokeWidth={3} />
              <span>Back</span>
            </Link>
          </div>
          
          <div className="flex gap-3 mb-2">
            <span className="bg-white border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
              {event.category || 'General'}
            </span>
            <span className="bg-white border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
              Conference
            </span>
          </div>
          
          <h1 className="text-5xl md:text-[80px] font-black font-display text-black leading-[0.9] tracking-tighter uppercase max-w-5xl">
            {event.title}
          </h1>
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          {/* Quick Info Bar */}
          <div className="flex flex-wrap gap-6 bg-white neo-card p-6 border-[3px] border-black shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center gap-3 text-black font-bold uppercase">
              <Calendar size={24} strokeWidth={2.5} className="text-[#FF3366]" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {event.time && `- ${event.time}`}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-3 text-black font-bold uppercase">
                <MapPin size={24} strokeWidth={2.5} className="text-[#00E5FF]" />
                <span>{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-black font-bold uppercase">
              <Users size={24} strokeWidth={2.5} className="text-[#FFD23F]" />
              <span>{event.attendees} / {event.maxAttendees} Attending</span>
            </div>
          </div>
          
          {/* About */}
          <div>
            <h2 className="text-4xl font-black font-display uppercase mb-6 flex items-center gap-3">
              <Info size={32} strokeWidth={3} className="text-[#FF3366]" />
              About the Event
            </h2>
            <div className="neo-card p-8 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000]">
              <p className="text-lg text-black font-medium leading-relaxed whitespace-pre-wrap">
                {event.description || "No description provided for this event."}
              </p>
            </div>
          </div>
          
          {/* Speakers */}
          <div>
            <h2 className="text-4xl font-black font-display uppercase mb-8 flex items-center gap-3">
              <Users size={32} strokeWidth={3} className="text-[#00E5FF]" />
              Featured Speakers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Speaker 1 */}
              <div className="neo-card flex flex-col items-center text-center bg-white p-6 border-[3px] border-black shadow-[6px_6px_0px_0px_#000]">
                <div className="w-24 h-24 mb-4 border-[3px] border-black bg-[#FFD23F] p-1 shadow-[4px_4px_0px_0px_#000]">
                  <img className="w-full h-full object-cover grayscale" alt="Speaker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC39ofCFRcus2nWMCPDOr9-V9gL73KxlGEUwfk-UA1425ZD2J75ze4bcg9eVKqb1tXe9DUUvmBg7A2bpMg0sHQHPJeVI2qUYYQSnmXmhY-C5P0qaafFB_PXEr6n-rCo7CpHGlx8Xq69eeL7c7VZR12vc7CwUH2rYi-bOZ7YvJdGEYDboy_nq958VvqAepF6Wb2HtJMlXo-UTmWJHNE5UrHEI4sNZ5DNBPzi-0vZxI133Uj8idoQ-cODMw" />
                </div>
                <h3 className="text-xl font-black font-display uppercase">Dr. Sarah Chen</h3>
                <p className="text-xs font-bold uppercase mt-1">AI Research Lead, Quantumate</p>
              </div>
              {/* Speaker 2 */}
              <div className="neo-card flex flex-col items-center text-center bg-white p-6 border-[3px] border-black shadow-[6px_6px_0px_0px_#000]">
                <div className="w-24 h-24 mb-4 border-[3px] border-black bg-[#00E5FF] p-1 shadow-[4px_4px_0px_0px_#000]">
                  <img className="w-full h-full object-cover grayscale" alt="Speaker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2fWgEbUPvkUUCyc3KVS1i5_4TDE7MEp9xbXJOxVaLcUoQEq3JgzU-vYRA_VI7Zm8_DrHQ5BKU4RUCgOwuWs9epFxV2iilxM6ORH8SLFkp05Ql1R515W0xDiwI91CYes0AKYF-9hCA-WQex4xPiAxm630Vk-_sP4dPeCZrCcTHf7_6kOdxle2k1qDZOOc89KeUDCR8TqQLFP2KmcWFivtaSYg-zWX-N6u6uKop1BnlMnFCHGAfda8fSw" />
                </div>
                <h3 className="text-xl font-black font-display uppercase">Marcus Vance</h3>
                <p className="text-xs font-bold uppercase mt-1">CEO, NeuralWeb</p>
              </div>
              {/* Speaker 3 */}
              <div className="neo-card flex flex-col items-center text-center bg-white p-6 border-[3px] border-black shadow-[6px_6px_0px_0px_#000]">
                <div className="w-24 h-24 mb-4 border-[3px] border-black bg-[#FF3366] p-1 shadow-[4px_4px_0px_0px_#000]">
                  <img className="w-full h-full object-cover grayscale" alt="Speaker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsnHK3k4tzOrJggSxNQRv9ZISnQWVXy-tIe9akJZWAv8_XDeXaX5IEgtO0TzbjPXSceWIi_O9NsKyAg_pgNpwnR4J_BFZBK57ki1PScZBsz9p49n5PjjqQtdrebjW-OMQAXXfx2j-zznuBq71dAaQtct4xDAjB5VvcmO0s62zkw73Ue2m-QLzJ1h5kuA9kfKRumO0uTD_ad83u11N9LFUKczfF9Sc654dG4iKgDiRsm8y-3PU32ttn9w" />
                </div>
                <h3 className="text-xl font-black font-display uppercase">Elara Vance</h3>
                <p className="text-xs font-bold uppercase mt-1">Chief Visionary, SynthCorp</p>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Right Column: Sticky Booking Sidebar */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 neo-card p-8 bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_#000]">
            
            <h3 className="text-3xl font-black font-display uppercase mb-4">General Admission</h3>
            <p className="font-bold text-sm mb-6 border-l-[4px] border-[#00E5FF] pl-3">
              Full access to all keynotes, breakout sessions, and the expo floor for three days.
            </p>
            
            <div className="flex items-baseline gap-2 mb-8 border-b-[3px] border-black pb-6">
              <span className="text-6xl font-black font-display">FREE</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 font-bold uppercase">
                <CheckCircle2 strokeWidth={3} className="text-[#FF3366] w-6 h-6" />
                <span>All Keynotes & Tracks</span>
              </div>
              <div className="flex items-center gap-3 font-bold uppercase">
                <CheckCircle2 strokeWidth={3} className="text-[#FF3366] w-6 h-6" />
                <span>Networking Events</span>
              </div>
              <div className="flex items-center gap-3 font-bold uppercase">
                <CheckCircle2 strokeWidth={3} className="text-[#FF3366] w-6 h-6" />
                <span>Expo Hall Access</span>
              </div>
            </div>
            
            <button 
              onClick={() => registerMutation.mutate()}
              disabled={isFull || registerMutation.isPending || registerStatus === 'success'}
              className="neo-button w-full py-5 text-xl flex justify-center items-center gap-3 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
            >
              {isFull 
                ? 'EVENT FULL' 
                : registerStatus === 'success'
                ? '✓ REGISTERED'
                : registerMutation.isPending
                ? 'PROCESSING...'
                : 'BOOK NOW'
              }
              {!isFull && registerStatus !== 'success' && !registerMutation.isPending && (
                <ArrowRight strokeWidth={3} />
              )}
            </button>
            <p className="text-center font-bold text-xs mt-4">Prices increase by $200 on Nov 1st.</p>
          </div>
        </div>
        
      </section>
    </div>
  );
};
