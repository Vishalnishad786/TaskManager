const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Create a project
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        members: {
          create: [
            { userId: req.user.id, role: 'admin' },
            ...(members || []).map(m => ({ userId: m.user, role: m.role || 'member' }))
          ]
        }
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
    
    // Transform to match frontend expected format
    const transformedProject = {
      _id: project.id,
      id: project.id,
      name: project.name,
      description: project.description,
      owner: project.owner,
      members: project.members.map(m => ({
        user: m.user,
        role: m.role
      })),
      status: project.status,
      createdAt: project.createdAt
    };
    
    res.status(201).json(transformedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for user
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const transformedProjects = projects.map(project => ({
      _id: project.id,
      id: project.id,
      name: project.name,
      description: project.description,
      owner: project.owner,
      members: project.members.map(m => ({
        user: m.user,
        role: m.role
      })),
      status: project.status,
      createdAt: project.createdAt
    }));
    
    res.json(transformedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access
    const hasAccess = project.ownerId === req.user.id || 
                     project.members.some(m => m.userId === req.user.id);
    
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const transformedProject = {
      _id: project.id,
      id: project.id,
      name: project.name,
      description: project.description,
      owner: project.owner,
      members: project.members.map(m => ({
        user: m.user,
        role: m.role
      })),
      status: project.status,
      createdAt: project.createdAt
    };
    
    res.json(transformedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        members: true
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin
    const isAdmin = project.ownerId === req.user.id || 
                   project.members.some(m => m.userId === req.user.id && m.role === 'admin');
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
    
    const transformedProject = {
      _id: updatedProject.id,
      id: updatedProject.id,
      name: updatedProject.name,
      description: updatedProject.description,
      owner: updatedProject.owner,
      members: updatedProject.members.map(m => ({
        user: m.user,
        role: m.role
      })),
      status: updatedProject.status,
      createdAt: updatedProject.createdAt
    };
    
    res.json(transformedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can delete' });
    }
    
    // Delete project (cascade will delete members and tasks due to schema relations)
    await prisma.project.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };