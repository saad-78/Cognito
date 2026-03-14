import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    const { db } = await import('./src/db');
    const { users } = await import('./src/db/schema');
    
    console.log('Testing DB connection...');
    const result = await db.select().from(users).limit(1);
    console.log('Connection successful! Found users:', result.length);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    process.exit();
  }
}

testConnection();
