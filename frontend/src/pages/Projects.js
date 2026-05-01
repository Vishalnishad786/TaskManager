import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/projects`);
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/projects`, newProject);
      toast.success('Project created successfully');
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${API_URL}/projects/${id}`);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: 'white' }}>Projects</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Create Project
          </button>
        </div>

        <div className="grid">
          {projects.map(project => (
            <div key={project._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3>{project.name}</h3>
                {(project.owner._id === user._id || user.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="btn btn-danger"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p style={{ color: '#666', marginTop: '10px' }}>{project.description}</p>
              <div style={{ marginTop: '15px' }}>
                <span className="badge badge-pending">{project.status}</span>
              </div>
              <div style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
                Owner: {project.owner.name}
              </div>
              {project.members && project.members.length > 0 && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                  Members: {project.members.length}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Project Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Project</h2>
                <span className="modal-close" onClick={() => setShowModal(false)}>&times;</span>
              </div>
              <form onSubmit={handleCreateProject}>
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Create Project
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;