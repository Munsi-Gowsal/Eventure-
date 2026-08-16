import { useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { AuthService } from './api/auth.service';
import { EventService } from './api/event.service';
import { AppError } from './api/errors';
import './App.css';

const queryClient = new QueryClient();

function MainApp() {
  const [email, setEmail] = useState('admin_test_1@example.com');
  const [password, setPassword] = useState('CHANGE_ME');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-clear errors when token expires globally
  window.addEventListener('auth:unauthorized', () => {
    setErrorMsg('Session expired. Please log in again.');
  });

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: () => {
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err: AppError) => {
      setErrorMsg(err.message || 'Login failed');
    }
  });

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: () => EventService.listEvents(),
    retry: false, // Don't retry on 401s since interceptor handles it
  });

  const createEventMutation = useMutation({
    mutationFn: EventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setErrorMsg(null);
    },
    onError: (err: AppError) => {
      if (err.fields) {
        // Display validation fields
        setErrorMsg(Object.entries(err.fields).map(([k, v]) => `${k}: ${v.join(', ')}`).join(' | '));
      } else {
        setErrorMsg(err.message || 'Failed to create event');
      }
    }
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Eventure Admin Dashboard</h1>
      
      {errorMsg && <div style={{ color: 'red', padding: '10px', border: '1px solid red', marginBottom: '10px' }}>
        <strong>Error:</strong> {errorMsg}
      </div>}

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ marginRight: '10px' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ marginRight: '10px' }} />
        <button onClick={() => loginMutation.mutate({ email, password })} disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
        <button onClick={() => { AuthService.logout(); queryClient.invalidateQueries({ queryKey: ['events'] }); }} style={{ marginLeft: '10px' }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Test Error Handling</h2>
        <button onClick={() => createEventMutation.mutate({} as any)} style={{ marginRight: '10px' }}>
          Trigger 400 Validation Error (Empty Event)
        </button>
        <button onClick={() => createEventMutation.mutate({ title: 'Valid Title', category: 'Tech', maxAttendees: 10, date: new Date().toISOString() })}>
          Create Valid Event
        </button>
      </div>

      <div>
        <h2>Events List</h2>
        {eventsQuery.isLoading && <p>Loading events...</p>}
        {eventsQuery.isError && <p style={{ color: 'red' }}>Failed to load events: {(eventsQuery.error as AppError).message}</p>}
        <ul>
          {eventsQuery.data?.data?.map(event => (
            <li key={event._id}>
              {event.title} - {event.attendees}/{event.maxAttendees} attendees
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}
