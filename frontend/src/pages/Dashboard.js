// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import Navbar from '../components/Navbar';
// import toast from 'react-hot-toast';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     totalTasks: 0,
//     completedTasks: 0,
//     pendingTasks: 0,
//     overdueTasks: 0
//   });
//   const [recentTasks, setRecentTasks] = useState([]);

//   const fetchDashboardData = useCallback(async () => {
//     try {
//       const { data: tasks } = await axios.get(`${API_URL}/tasks`);
      
//       const completed = tasks.filter(t => t.status === 'completed').length;
//       const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
//       const overdue = tasks.filter(t => t.status === 'overdue').length;
      
//       setStats({
//         totalTasks: tasks.length,
//         completedTasks: completed,
//         pendingTasks: pending,
//         overdueTasks: overdue
//       });
      
//       setRecentTasks(tasks.slice(0, 5));
//     } catch (error) {
//       toast.error('Failed to fetch dashboard data');
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   const getStatusBadge = (status) => {
//     const badges = {
//       'pending': 'badge-pending',
//       'in-progress': 'badge-in-progress',
//       'completed': 'badge-completed',
//       'overdue': 'badge-overdue'
//     };
//     return `badge ${badges[status]}`;
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container fade-in">
//         <h1 style={{ color: 'white', marginBottom: '30px' }}>Dashboard</h1>
        
//         {/* Stats Cards */}
//         <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
//           <div className="card" style={{ textAlign: 'center' }}>
//             <h3>Total Tasks</h3>
//             <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalTasks}</p>
//           </div>
//           <div className="card" style={{ textAlign: 'center' }}>
//             <h3>Completed</h3>
//             <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981' }}>{stats.completedTasks}</p>
//           </div>
//           <div className="card" style={{ textAlign: 'center' }}>
//             <h3>Pending</h3>
//             <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pendingTasks}</p>
//           </div>
//           <div className="card" style={{ textAlign: 'center' }}>
//             <h3>Overdue</h3>
//             <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444' }}>{stats.overdueTasks}</p>
//           </div>
//         </div>

//         {/* Recent Tasks */}
//         <div className="card" style={{ marginTop: '30px' }}>
//           <h2 style={{ marginBottom: '20px' }}>Recent Tasks</h2>
//           {recentTasks.length === 0 ? (
//             <p>No tasks assigned yet.</p>
//           ) : (
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                   <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
//                     <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
//                     <th style={{ padding: '10px', textAlign: 'left' }}>Project</th>
//                     <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
//                     <th style={{ padding: '10px', textAlign: 'left' }}>Due Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentTasks.map(task => (
//                     <tr key={task._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
//                       <td style={{ padding: '10px' }}>{task.title}</td>
//                       <td style={{ padding: '10px' }}>{task.project?.name}</td>
//                       <td style={{ padding: '10px' }}>
//                         <span className={getStatusBadge(task.status)}>{task.status}</span>
//                       </td>
//                       <td style={{ padding: '10px' }}>{new Date(task.dueDate).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const API_URL = 'https://taskmanager-backend-nfx9.onrender.com/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: tasks } = await axios.get(`${API_URL}/tasks`);
      
      const completed = tasks.filter(t => t.status === 'completed').length;
      const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
      const overdue = tasks.filter(t => t.status === 'overdue').length;
      
      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        pendingTasks: pending,
        overdueTasks: overdue
      });
      
      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
          <h3 style={{ color: 'white' }}>Loading dashboard...</h3>
        </div>
      </>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge-pending',
      'in-progress': 'badge-in-progress',
      'completed': 'badge-completed',
      'overdue': 'badge-overdue'
    };
    return `badge ${badges[status] || 'badge-pending'}`;
  };

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <h1 style={{ color: 'white', marginBottom: '30px' }}>Dashboard</h1>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Total Tasks</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalTasks}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Completed</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981' }}>{stats.completedTasks}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Pending</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pendingTasks}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Overdue</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444' }}>{stats.overdueTasks}</p>
          </div>
        </div>

        <div className="card" style={{ marginTop: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Project</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map(task => (
                    <tr key={task._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px' }}>{task.title}</td>
                      <td style={{ padding: '10px' }}>{task.project?.name || 'N/A'}</td>
                      <td style={{ padding: '10px' }}>
                        <span className={getStatusBadge(task.status)}>{task.status}</span>
                      </td>
                      <td style={{ padding: '10px' }}>{new Date(task.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;