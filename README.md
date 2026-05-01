===============================================================================
                         TASK MANAGER - FRONTEND
                         Complete README for Render Deployment
===============================================================================

PROJECT OVERVIEW
================
A modern task management application built with React.js that allows teams to 
collaborate on projects and tasks. Users can create projects, assign tasks, 
track progress, and manage deadlines with role-based access control.

KEY FEATURES
============
• User Authentication - JWT-based login and registration system
• Project Management - Create, read, and delete projects
• Task Management - Create, update status, and track tasks
• Role-Based Access - Admin and Member roles with different permissions
• Dashboard Analytics - View task statistics and recent activities
• Responsive Design - Fully responsive UI for all devices
• Real-time Updates - Instant feedback with toast notifications
• Priority Levels - Low, Medium, High priority for tasks
• Due Date Tracking - Set and track task deadlines
• Project Assignment - Assign tasks to specific projects

TECHNOLOGY STACK
================
Frontend Framework: React.js 18.2.0
Routing: React Router DOM 6.20.0
HTTP Client: Axios 1.6.0
Notifications: React Hot Toast 2.4.0
Styling: Custom CSS3 with modern features
Build Tool: Create React App 5.0.1
Deployment Platform: Render.com (Static Site)

PROJECT STRUCTURE
=================
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js         - Navigation bar component
│   │   └── PrivateRoute.js   - Protected route wrapper
│   ├── context/
│   │   └── AuthContext.js    - Authentication state management
│   ├── pages/
│   │   ├── Dashboard.js      - Main dashboard with stats
│   │   ├── Login.js          - Login page
│   │   ├── Register.js       - Registration page
│   │   ├── Projects.js       - Projects CRUD operations
│   │   └── Tasks.js          - Tasks CRUD operations
│   ├── App.js                - Main app with routing
│   ├── App.css               - Global styles
│   └── index.js              - Entry point
├── public/
│   └── index.html            - HTML template
├── .env                      - Environment variables
└── package.json              - Dependencies and scripts

API ENDPOINTS USED
==================
Authentication:
• POST   /api/auth/login      - User login
• POST   /api/auth/register   - User registration
• GET    /api/auth/me         - Get current user

Projects:
• GET    /api/projects        - Get all projects
• POST   /api/projects        - Create new project
• DELETE /api/projects/:id    - Delete project

Tasks:
• GET    /api/tasks           - Get all tasks
• POST   /api/tasks           - Create new task
• PUT    /api/tasks/:id/status - Update task status

Users (Admin only):
• GET    /api/users           - Get all users

DEPLOYMENT FLOW (RENDER.COM)
=============================

STEP 1: PREPARATION
-------------------
• Push code to GitHub repository
• Ensure all dependencies are in package.json
• Create .env file with REACT_APP_API_URL

STEP 2: RENDER SETUP
--------------------
• Go to render.com and sign in with GitHub
• Click "New +" and select "Static Site"
• Connect your GitHub repository
• Configure build settings:
  - Build Command: npm install && npm run build
  - Publish Directory: build

STEP 3: ENVIRONMENT VARIABLES
-----------------------------
Add the following environment variable in Render dashboard:
• REACT_APP_API_URL = https://your-backend-url.onrender.com/api

STEP 4: DEPLOY
--------------
• Click "Create Static Site"
• Render will automatically build and deploy
• Get your live URL (e.g., https://taskmanager-frontend.onrender.com)

STEP 5: CORS CONFIGURATION
--------------------------
Add your Render frontend URL to backend CORS allowed origins:
• http://localhost:3000 (development)
• https://your-frontend-url.onrender.com (production)

AUTOMATIC DEPLOYMENTS
======================
Render automatically deploys when you push to the connected branch:
• Push to main branch → Automatic deployment
• Each deployment gets a unique URL
• Previous versions are preserved for rollback

ENVIRONMENT VARIABLES
=====================
Variable              Description                    Example Value
------------------    --------------------------    ---------------------------------
REACT_APP_API_URL     Backend API URL               https://backend.onrender.com/api

LOCAL DEVELOPMENT SETUP
=======================

Prerequisites:
• Node.js (v14 or higher)
• npm (v6 or higher)
• Backend API running

Steps:
1. Clone the repository
   git clone <your-repo-url>
   cd task-manager-frontend

2. Install dependencies
   npm install

3. Create .env file
   REACT_APP_API_URL=http://localhost:5000/api

4. Start development server
   npm start

5. Open http://localhost:3000

Build for Production:
   npm run build

DEPLOYMENT CHECKLIST
====================
□ Code pushed to GitHub
□ package.json has correct build script
□ Backend is deployed and CORS configured
□ Environment variables set in Render
□ Tested locally with npm run build
□ Verify API_URL is correct in production

COMMON ISSUES & SOLUTIONS
=========================

Issue 1: Blank page after deployment
Solution: Add "homepage": "." to package.json

Issue 2: API calls failing (CORS)
Solution: Add frontend URL to backend CORS allowed origins

Issue 3: Routes don't work on refresh
Solution: Render's static sites handle this automatically with build directory

Issue 4: Environment variables not working
Solution: Variables must start with REACT_APP_ prefix

Issue 5: Build fails on Render
Solution: Check Node version compatibility and clear build cache

RENDER URL STRUCTURE
====================
• Production URL: https://taskmanager-frontend.onrender.com
• Dashboard: https://taskmanager-frontend.onrender.com/
• Projects: https://taskmanager-frontend.onrender.com/projects
• Tasks: https://taskmanager-frontend.onrender.com/tasks
• Login: https://taskmanager-frontend.onrender.com/login
• Register: https://taskmanager-frontend.onrender.com/register

SECURITY CONSIDERATIONS
=======================
• Never commit .env file to git
• Keep all secrets in Render environment variables
• Use HTTPS (automatically provided by Render)
• Implement proper CORS restrictions
• JWT tokens stored in localStorage

MONITORING & ANALYTICS
======================
• Build Logs: Available in Render dashboard
• Deployment History: View all deployments
• Traffic Metrics: Basic analytics available
• Health Checks: Automatic by Render

COST ESTIMATION
===============
Render Static Sites:
• Free Tier: Included with account
• Bandwidth: 100GB/month free
• Build Minutes: 400 minutes/month free
• Custom Domain: Available on free tier

SUPPORT & RESOURCES
===================
• Render Documentation: https://render.com/docs/static-sites
• React Documentation: https://reactjs.org/docs
• Project Backend Repository: [Add backend repo link]

VERSION HISTORY
===============
Version 1.0.0 - Initial release
- User authentication
- Project CRUD operations
- Task CRUD operations
- Dashboard analytics
- Role-based access control

CONTACT & CONTRIBUTION
======================
For issues or contributions:
• Create an issue in the repository
• Submit pull requests for improvements
• Contact the development team

LICENSE
=======
ISC License - See LICENSE file for details

===============================================================================
                              END OF README
===============================================================================