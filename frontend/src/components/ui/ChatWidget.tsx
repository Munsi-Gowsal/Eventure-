import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import type { Event } from '../../features/events/types';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  text: string | React.ReactNode;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I am your Eventure assistant. Do you have any questions about our events? Try asking about "tech", "music", or what\'s happening "this weekend"!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const findEvents = (query: string): Event[] => {
    const allQueries = queryClient.getQueriesData<Event[]>({ queryKey: ['events'] });
    // Flatten all cached event arrays in case of multiple query keys
    const allEvents = Array.from(new Set(allQueries.flatMap(([, data]) => data || [])));
    
    if (!allEvents.length) return [];

    const lowerQuery = query.toLowerCase();
    
    return allEvents.filter((event) => {
      const matchTitle = event.title.toLowerCase().includes(lowerQuery);
      const matchCategory = event.category?.toLowerCase().includes(lowerQuery);
      
      // Keyword matching
      if (lowerQuery.includes('tech') || lowerQuery.includes('technology')) {
        return event.category?.toLowerCase() === 'tech' || matchTitle;
      }
      if (lowerQuery.includes('workshop')) {
        return event.category?.toLowerCase() === 'workshop' || matchTitle;
      }
      if (lowerQuery.includes('music')) {
        return event.category?.toLowerCase() === 'music' || matchTitle;
      }
      if (lowerQuery.includes('business') || lowerQuery.includes('startup')) {
        return event.category?.toLowerCase().includes('business') || matchTitle;
      }
      
      if (lowerQuery.includes('weekend') || lowerQuery.includes('today') || lowerQuery.includes('tomorrow')) {
        return true; 
      }

      return matchTitle || matchCategory;
    }).slice(0, 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate typing delay
    setTimeout(() => {
      const matchedEvents = findEvents(userText);
      
      let botResponse: React.ReactNode;

      if (userText.toLowerCase().includes('event') && !matchedEvents.length) {
         botResponse = "We have many great events! Try searching by category like 'tech', 'music', or 'comedy'.";
      } else if (matchedEvents.length > 0) {
        botResponse = (
          <div className="flex flex-col gap-2">
            <span>Here are some events you might like:</span>
            <ul className="list-disc pl-4 space-y-1">
              {matchedEvents.map(ev => (
                <li key={ev._id}>
                  <Link to={`/events/${ev._id}`} className="text-blue-300 hover:underline">
                    {ev.title}
                  </Link>
                  <span className="text-gray-400 text-xs ml-2">({new Date(ev.date).toLocaleDateString()})</span>
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        botResponse = "I couldn't find a matching event right now. Try another category or search.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[var(--color-accent-primary)] text-white shadow-xl shadow-[var(--color-accent-primary)]/20 z-50 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-main)]/90">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Eventure Support</h3>
                  <p className="text-xs text-[var(--color-accent-primary)] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center mt-1 ${
                      msg.sender === 'user' ? 'bg-gray-700' : 'bg-gradient-to-tr from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]'
                    }`}
                  >
                    {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[var(--color-accent-primary)] text-white rounded-tr-sm'
                        : 'bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-gray-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-main)]/90">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about events..."
                  className="flex-1 bg-black/50 border border-[var(--color-border-subtle)] rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                >
                  <Send size={16} className="ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
