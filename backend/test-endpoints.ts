import app from './src/app';

const server = app.listen(4000, async () => {
  console.log('Test server running on port 4000');
  try {
    const health = await fetch('http://localhost:4000/health');
    console.log('/health status:', health.status);
    console.log('/health body:', await health.json());

    const ready = await fetch('http://localhost:4000/ready');
    console.log('/ready status:', ready.status);
    console.log('/ready body:', await ready.json());

    const notFound = await fetch('http://localhost:4000/api/v1/auth/non-existent');
    console.log('404 status:', notFound.status);
    console.log('404 body:', await notFound.json());

    // Test rate limiter
    console.log('Testing rate limiter...');
    for (let i = 0; i < 12; i++) {
      const res = await fetch('http://localhost:4000/api/v1/auth/test');
      if (res.status === 429) {
        console.log('Auth Rate Limit Triggered at request', i + 1);
        console.log('Rate Limit body:', await res.json());
        break;
      }
    }
  } catch(e) {
    console.error(e);
  } finally {
    server.close();
    process.exit(0);
  }
});
