// const { PrismaClient } = require('@prisma/client');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const prisma = new PrismaClient();

// // Generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// // @desc    Register user
// // @route   POST /api/auth/register
// const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if user exists
//     const userExists = await prisma.user.findUnique({
//       where: { email }
//     });
    
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: role || 'member'
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         createdAt: true
//       }
//     });

//     const token = generateToken(user.id);

//     res.status(201).json({
//       _id: user.id,
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await prisma.user.findUnique({
//       where: { email }
//     });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken(user.id);

//     res.json({
//       _id: user.id,
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get current user
// // @route   GET /api/auth/me
// const getMe = async (req, res) => {
//   try {
//     res.json(req.user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { register, login, getMe };

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email }
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'member'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };