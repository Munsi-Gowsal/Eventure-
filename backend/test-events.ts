import app from './src/app';

const server = app.listen(4002, async () => {
  console.log('Event Test server running on port 4002');
  let exitCode = 0;
  try {
    // 1. Invalid Create Event Validation
    console.log('\n--- Testing Invalid Create Event Validation ---');
    const resCreateInvalid = await fetch('http://localhost:4002/api/v1/events', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Mock the auth header to bypass requireAuth and hit validate()
        'Authorization': `Bearer fake_token` 
      },
      body: JSON.stringify({
        title: '',
        maxAttendees: 0, // Should be > 0
        date: 'not-a-date'
      }),
    });
    // We expect 401 because the fake token is invalid. Wait! validate() runs AFTER requireAuth in our routes.
    // router.post('/', requireAuth, validate(createEventSchema), eventController.createEvent);
    // So 401 is expected.
    console.log('Status (Auth fail before validate):', resCreateInvalid.status);

    // Let's test a public route validation
    console.log('\n--- Testing Invalid Public Query Validation ---');
    const resQueryInvalid = await fetch('http://localhost:4002/api/v1/events?limit=999&page=-1');
    console.log('Status (expect 400):', resQueryInvalid.status);
    console.log('Body:', await resQueryInvalid.json());

    // 2. Invalid ObjectId validation
    console.log('\n--- Testing Invalid ObjectId Validation ---');
    const resIdInvalid = await fetch('http://localhost:4002/api/v1/events/invalid-id');
    console.log('Status (expect 400):', resIdInvalid.status);
    console.log('Body:', await resIdInvalid.json());

  } catch(e) {
    console.error(e);
    exitCode = 1;
  } finally {
    server.close();
    process.exit(exitCode);
  }
});
