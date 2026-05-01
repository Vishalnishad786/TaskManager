const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to Railway PostgreSQL!');
    
    // Test creating a table query
    const result = await prisma.$queryRaw`SELECT current_database() as db_name, version() as pg_version`;
    console.log('📊 Database:', result[0].db_name);
    console.log('🐘 PostgreSQL Version:', result[0].pg_version);
    
    // Count existing users
    const userCount = await prisma.user.count();
    console.log('👥 Existing users:', userCount);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();