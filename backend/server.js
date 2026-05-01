// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { PrismaClient } = require('@prisma/client');

// dotenv.config();

// const prisma = new PrismaClient();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Health check
// app.get('/api/health', async (req, res) => {
//   try {
//     await prisma.$queryRaw`SELECT 1`;
//     res.json({
//       status: 'OK',
//       database: 'PostgreSQL Connected',
//       databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
//       timestamp: new Date()
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'ERROR',
//       database: 'Disconnected',
//       error: error.message
//     });
//   }
// });

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/projects', require('./routes/projectRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: err.message || 'Server Error' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;

// async function startServer() {
//   try {
//     await prisma.$connect();
//     console.log('✅ Railway PostgreSQL connected successfully');
    
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📍 http://localhost:${PORT}`);
//       console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
//     });
//   } catch (error) {
//     console.error('❌ Database connection error:', error.message);
//     process.exit(1);
//   }
// }

// startServer();

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await prisma.$disconnect();
//   process.exit(0);
// });


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Enhanced CORS configuration for Render
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-render-url.onrender.com', // Replace with your frontend URL
    'https://taskmanager-backend-nfx9.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      database: 'PostgreSQL Connected',
      timestamp: new Date(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      tasks: '/api/tasks',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: `Route not found: ${req.method} ${req.url}`,
    availableEndpoints: {
      auth: '/api/auth/register, /api/auth/login, /api/auth/me',
      projects: '/api/projects',
      tasks: '/api/tasks',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({ 
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});