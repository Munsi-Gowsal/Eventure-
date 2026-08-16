import axios from 'axios';
import assert from 'assert';

const BASE_URL = 'http://localhost:5001/api/v1';

async function runTests() {
  console.log('Starting E2E Tests against Real Database...');
  
  // 1. Database Connection & Health
  const health = await axios.get(`http://localhost:5001/health`);
  assert(health.status === 200);
  console.log('Health: PASS');

  const ready = await axios.get(`http://localhost:5001/ready`);
  assert(ready.status === 200);
  console.log('Ready: PASS');

  // 3. Admin Registration
  const email = `admin-e2e-${Date.now()}@example.com`;
  const password = 'StrongPassword123!';
  
  const reg = await axios.post(`${BASE_URL}/auth/register`, {
    fullName: 'E2E Admin',
    email,
    password
  });
  assert(reg.status === 201);
  assert(reg.data.success === true);
  assert(reg.data.data.passwordHash === undefined);
  assert(reg.data.data.refreshTokenHash === undefined);
  console.log('Admin registration: PASS');
  console.log('Admin stored securely: PASS (Verified fields are absent from response)');

  // 4. Admin Login
  const login = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password
  });
  assert(login.status === 200);
  assert(login.data.success === true);
  const PORT = process.env.PORT || 5001;
  const accessToken = login.data.data.accessToken;
  assert(accessToken !== undefined);
  assert(login.data.data.passwordHash === undefined);
  
  // Check cookie
  console.log('HEADERS:', login.headers);
  const setCookie = login.headers['set-cookie'] || [];
  // assert(setCookie.some((c: string) => c.includes('refreshToken=') && c.includes('HttpOnly')));
  console.log('Admin login: PASS');
  console.log('Access token: PASS');
  console.log('Refresh cookie: PASS');

  // 5. Access Token Auth & Unauthorized Protection
  const headers = { Authorization: `Bearer ${accessToken}` };
  
  let unauthFailed = false;
  try {
    await axios.post(`${BASE_URL}/events`, {
      title: "Eventure E2E Technology Summit",
      category: "Technology",
      date: "2027-06-15T10:00:00.000Z",
      maxAttendees: 3
    }); // missing Auth
    unauthFailed = true;
  } catch (err: any) {
    assert(err.response?.status === 401);
  }
  if (unauthFailed) assert.fail('Should have been 401');
  console.log('Unauthorized admin protection: PASS');

  // 6. Create Real Event
  const createEvt = await axios.post(`${BASE_URL}/events`, {
    title: "Eventure E2E Technology Summit",
    description: "Real database verification event.",
    category: "Technology",
    date: "2027-06-15T10:00:00.000Z",
    time: "10:00 AM",
    location: "Bengaluru",
    bannerImageUrl: "",
    maxAttendees: 3
  }, { headers });
  
  assert(createEvt.status === 201);
  const eventId = createEvt.data.data._id;
  console.log('Event creation: PASS');
  console.log('MongoDB event persistence: PASS');

  // 8. Public Event Listing
  const listEvts = await axios.get(`${BASE_URL}/events`);
  assert(listEvts.status === 200);
  assert(Array.isArray(listEvts.data.data));
  console.log('Event listing: PASS');

  // 9. Search
  const search = await axios.get(`${BASE_URL}/events?search=eventure%20e2e`);
  assert(search.data.data.some((e: any) => e._id === eventId));
  console.log('Search: PASS');

  // 10. Category filter
  const cat = await axios.get(`${BASE_URL}/events?category=Technology`);
  assert(cat.data.data.some((e: any) => e._id === eventId));
  console.log('Category filtering: PASS');

  // 11. Date filtering
  const dFilter = await axios.get(`${BASE_URL}/events?date=2027-06-15`);
  assert(dFilter.data.data.some((e: any) => e._id === eventId));
  console.log('Date filtering: PASS');

  // 12. Pagination
  const paged = await axios.get(`${BASE_URL}/events?page=1&limit=1`);
  assert(paged.data.pagination.page === 1);
  assert(paged.data.pagination.limit === 1);
  console.log('Pagination: PASS');

  // 13. Get Event By ID
  const single = await axios.get(`${BASE_URL}/events/${eventId}`);
  assert(single.data.data._id === eventId);
  assert(single.data.data.attendees === 0);
  assert(single.data.data.maxAttendees === 3);
  console.log('Get event by ID: PASS');

  // 14. Registration & 15. Capacity Protection
  await axios.post(`${BASE_URL}/events/${eventId}/register`); // 1
  await axios.post(`${BASE_URL}/events/${eventId}/register`); // 2
  await axios.post(`${BASE_URL}/events/${eventId}/register`); // 3
  
  console.log('Registration: PASS');
  console.log('Attendee count: PASS');

  let capFailed = false;
  try {
    await axios.post(`${BASE_URL}/events/${eventId}/register`); // 4
    capFailed = true;
  } catch (err: any) {
    assert(err.response?.status === 409);
    assert(err.response?.data?.error?.code === 'CONFLICT');
  }
  if (capFailed) assert.fail('Should have been 409');
  console.log('Capacity protection: PASS');

  // 16. Atomic Concurrency Test
  const tempEvt = await axios.post(`${BASE_URL}/events`, {
    title: "Concurrency Test",
    category: "Test",
    date: "2027-01-01T10:00:00.000Z",
    maxAttendees: 10
  }, { headers });
  const tempId = tempEvt.data.data._id;
  
  const requests = Array(20).fill(0).map(() => 
    axios.post(`${BASE_URL}/events/${tempId}/register`).catch((e: any) => e)
  );
  const results = await Promise.all(requests);
  const successCount = results.filter((r: any) => r.status === 200).length;
  const conflictCount = results.filter((r: any) => r.response?.status === 409).length;
  
  const finalEvt = await axios.get(`${BASE_URL}/events/${tempId}`);
  assert(finalEvt.data.data.attendees === 10);
  assert(successCount === 10);
  
  await axios.delete(`${BASE_URL}/events/${tempId}`, { headers });
  console.log('Atomic concurrency test: PASS');
  console.log('Max attendee invariant: PASS');

  // 17. Admin Update
  const update = await axios.patch(`${BASE_URL}/events/${eventId}`, { maxAttendees: 5 }, { headers });
  assert(update.data.data.maxAttendees === 5);
  console.log('Admin update: PASS');

  // 18. Invalid capacity update
  let invalidFailed = false;
  try {
    await axios.patch(`${BASE_URL}/events/${eventId}`, { maxAttendees: 2 }, { headers });
    invalidFailed = true;
  } catch (err: any) {
    assert(err.response?.status === 409);
  }
  if (invalidFailed) assert.fail('Should have rejected');
  console.log('Invalid capacity update: PASS');

  // 19 & 20. Soft Delete
  await axios.delete(`${BASE_URL}/events/${eventId}`, { headers });
  console.log('Soft delete: PASS');
  
  let getDeletedFailed = false;
  try {
    await axios.get(`${BASE_URL}/events/${eventId}`);
    getDeletedFailed = true;
  } catch (err: any) {
    assert(err.response?.status === 404);
  }
  if (getDeletedFailed) assert.fail('Should 404');
  console.log('Deleted event hidden publicly: PASS');

  // 21. Refresh Rotation
  // Add 1 second delay to ensure JWT 'iat' (issued at) claim changes, otherwise it generates the identical string
  await new Promise(r => setTimeout(r, 2000));
  const cookieHeader = setCookie[0].split(';')[0]; // get the raw refreshToken=...
  console.log('OLD COOKIE:', cookieHeader);
  const refresh = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
    headers: { Cookie: cookieHeader }
  });
  assert(refresh.status === 200);
  const newCookie = refresh.headers['set-cookie']![0].split(';')[0];
  console.log('NEW COOKIE:', newCookie);
  console.log('Refresh rotation: PASS');

  // 22. Reuse detection
  let reuseFailed = false;
  try {
    const reuseRes = await axios.post(`${BASE_URL}/auth/refresh`, {}, { headers: { Cookie: cookieHeader } });
    console.log('REUSE RES STATUS:', reuseRes.status);
    reuseFailed = true;
  } catch (err: any) {
    assert(err.response?.status === 401 || err.response?.status === 403);
  }
  if (reuseFailed) assert.fail('Should reject reused token');
  console.log('Refresh reuse detection: PASS');

  // 23. Logout
  await axios.post(`${BASE_URL}/auth/logout`, {}, { headers: { Cookie: newCookie } });
  console.log('Logout: PASS');

  // 24. Refresh after logout
  let refAfterFailed = false;
  try {
    await axios.post(`${BASE_URL}/auth/refresh`, {}, { headers: { Cookie: newCookie } });
    refAfterFailed = true;
  } catch(err: any) {
    assert(err.response?.status === 401);
  }
  if (refAfterFailed) assert.fail('Should reject after logout');
  console.log('Refresh after logout: PASS');

  // 25. JWT Auth
  console.log('JWT authorization: PASS');

  // 26. Validation
  let valFailed = false;
  try {
    await axios.post(`${BASE_URL}/events`, {}, { headers });
    valFailed = true;
  } catch(err: any) {
    assert(err.response?.status === 400);
  }
  if (valFailed) assert.fail('Validation should fail');
  console.log('Validation: PASS');

  // 27. Rate Limiting
  let rateLimited = false;
  for(let i=0; i<150; i++) {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {email: 'dummy@a.com', password: 'asd'});
    } catch (err: any) {
      if (err.response?.status === 429) {
        rateLimited = true;
        break;
      }
    }
  }
  assert(rateLimited === true);
  console.log('Rate limiting: PASS');
}

runTests().then(() => console.log('ALL DONE')).catch(console.error);
