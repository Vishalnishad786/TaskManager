import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    if (user.role === 'admin') {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users');
      }
    }
  }, [user.role]);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, [fetchTasks, fetchProjects, fetchUsers]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask);
      toast.success('Task created successfully');
      setShowModal(false);
      setNewTask({
        title: '',
        description: '',
        project: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: ''
      });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/status`, { status: newStatus });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge-pending',
      'in-progress': 'badge-in-progress',
      'completed': 'badge-completed',
      'overdue': 'badge-overdue'
    };
    return `badge ${badges[status]}`;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'low': 'badge-low',
      'medium': 'badge-medium',
      'high': 'badge-high',
      'urgent': 'badge-high'
    };
    return `badge ${badges[priority]}`;
  };

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: 'white' }}>Tasks</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Create Task
          </button>
        </div>

        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Project</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Assigned To</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Priority</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Due Date</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px' }}>{task.title}</td>
                    <td style={{ padding: '10px' }}>{task.project?.name}</td>
                    <td style={{ padding: '10px' }}>{task.assignedTo?.name}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span className={getStatusBadge(task.status)}>{task.status}</span>
                    </td>
                    <td style={{ padding: '10px' }}>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td style={{ padding: '10px' }}>
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '5px', border: '1px solid #e5e7eb' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Task Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Task</h2>
                <span className="modal-close" onClick={() => setShowModal(false)}>&times;</span>
              </div>
              <form onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label>Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Project</label>
                  <select
                    value={newTask.project}
                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Create Task
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;