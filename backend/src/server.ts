import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express server only after database connection succeeds
    app.listen(env.PORT, () => {
      console.log(`🚀 Eventure backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
