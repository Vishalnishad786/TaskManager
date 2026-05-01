const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Create a task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    
    // Check if project exists and user has access
    const projectExists = await prisma.project.findUnique({
      where: { id: project },
      include: { members: true }
    });
    
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const hasAccess = projectExists.ownerId === req.user.id || 
                     projectExists.members.some(m => m.userId === req.user.id);
    
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId: project,
        assignedToId: assignedTo,
        assignedById: req.user.id,
        priority,
        dueDate: new Date(dueDate)
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        assignedBy: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    });
    
    const transformedTask = {
      _id: task.id,
      id: task.id,
      title: task.title,
      description: task.description,
      project: task.project,
      assignedTo: task.assignedTo,
      assignedBy: task.assignedBy,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      createdAt: task.createdAt
    };
    
    res.status(201).json(transformedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for user
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    // Get projects user has access to
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } }
        ]
      },
      select: { id: true }
    });
    
    const projectIds = userProjects.map(p => p.id);
    
    let whereClause = { projectId: { in: projectIds } };
    
    if (req.query.project) {
      whereClause.projectId = req.query.project;
    }
    
    if (req.query.assignedTo) {
      whereClause.assignedToId = req.query.assignedTo;
    }
    
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        assignedBy: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const transformedTasks = tasks.map(task => ({
      _id: task.id,
      id: task.id,
      title: task.title,
      description: task.description,
      project: task.project,
      assignedTo: task.assignedTo,
      assignedBy: task.assignedBy,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      createdAt: task.createdAt
    }));
    
    res.json(transformedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { project: true }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
      include: { members: true }
    });
    
    const hasAccess = project.ownerId === req.user.id || 
                     project.members.some(m => m.userId === req.user.id);
    
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if due date passed and mark as overdue
    let finalStatus = status;
    if (task.dueDate < new Date() && status !== 'completed') {
      finalStatus = 'overdue';
    }
    
    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: { status: finalStatus },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        assignedBy: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    });
    
    const transformedTask = {
      _id: updatedTask.id,
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      project: updatedTask.project,
      assignedTo: updatedTask.assignedTo,
      assignedBy: updatedTask.assignedBy,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      createdAt: updatedTask.createdAt
    };
    
    res.json(transformedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { project: { include: { members: true } } }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const isAdmin = task.project.ownerId === req.user.id || 
                   task.project.members.some(m => m.userId === req.user.id && m.role === 'admin');
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can update tasks' });
    }
    
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.priority) updateData.priority = req.body.priority;
    if (req.body.dueDate) updateData.dueDate = new Date(req.body.dueDate);
    if (req.body.assignedTo) updateData.assignedToId = req.body.assignedTo;
    
    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        assignedBy: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    });
    
    const transformedTask = {
      _id: updatedTask.id,
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      project: updatedTask.project,
      assignedTo: updatedTask.assignedTo,
      assignedBy: updatedTask.assignedBy,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      createdAt: updatedTask.createdAt
    };
    
    res.json(transformedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { project: { include: { members: true } } }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const isAdmin = task.project.ownerId === req.user.id || 
                   task.project.members.some(m => m.userId === req.user.id && m.role === 'admin');
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }
    
    await prisma.task.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus, updateTask, deleteTask };