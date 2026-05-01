const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get all users (admin only)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    const transformedUsers = users.map(user => ({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));
    
    res.json(transformedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers };