import app from './src/app';
import { signAccessToken } from './src/utils/jwt';
import { env } from './src/config/env';

const server = app.listen(4001, async () => {
  console.log('Auth Test server running on port 4001');
  let exitCode = 0;
  try {
    // 1. Zod Validation (Register)
    console.log('\n--- Testing Zod Validation (Register) ---');
    const resReg = await fetch('http://localhost:4001/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', password: 'short' }),
    });
    console.log('Status (expect 400):', resReg.status);
    const bodyReg = await resReg.json();
    console.log('Body:', bodyReg);

    // 2. Production Registration Blocked
    console.log('\n--- Testing Production Registration Blocked ---');
    env.NODE_ENV = 'production'; // temporarily fake it
    const resProd = await fetch('http://localhost:4001/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });
    console.log('Status (expect 403):', resProd.status);
    console.log('Body:', await resProd.json());
    env.NODE_ENV = 'development'; // revert

    console.log('\n--- Testing requireAuth (No Header) ---');
    const { requireAuth } = require('./src/middleware/requireAuth');
    let resStatus = 0;
    let resBody: any = null;
    const mockRes = {
      status: (s: number) => { resStatus = s; return mockRes; },
      json: (b: any) => { resBody = b; return mockRes; }
    };
    
    requireAuth({ headers: {} } as any, mockRes as any, () => {});
    console.log('Status (expect 401):', resStatus);
    console.log('Body:', resBody);

    console.log('\n--- Testing requireAuth (Invalid Token) ---');
    requireAuth({ headers: { authorization: 'Bearer bad_token' } } as any, mockRes as any, () => {});
    console.log('Status (expect 401):', resStatus);
    console.log('Body:', resBody);

    console.log('\n--- Testing requireAuth (Valid Token) ---');
    const validToken = signAccessToken({ id: '123', email: 'admin@test.com' });
    let nextCalled = false;
    const mockReq = { headers: { authorization: `Bearer ${validToken}` } };
    requireAuth(mockReq as any, mockRes as any, () => { nextCalled = true; });
    console.log('Next called (expect true):', nextCalled);
    console.log('req.admin:', (mockReq as any).admin);

  } catch(e) {
    console.error(e);
    exitCode = 1;
  } finally {
    server.close();
    process.exit(exitCode);
  }
});
