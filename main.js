import './style.css';
import { loadFromFirestore, saveToFirestore } from './src/firebase.js';

let currentUser = null; // Will hold { role: 'admin' | 'user', username: string }


// Define globals that will be attached after layout renders
let navItems, pageHeader, pageContent, primaryActionBtn;

function renderLoginScreen() {
  document.querySelector('#app').innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <img src="./logo.png" alt="School Logo" class="school-logo">
        <h2>Welcome Back</h2>
        <p>Sign in to Al-Bushira Result Compilation</p>
        
        <div id="login-error" class="login-error">Invalid credentials. Please try again.</div>
        
        <form id="login-form">
          <div class="input-group" style="text-align: left;">
            <label>Username</label>
            <input type="text" id="login-username" class="input-control" placeholder="admin or teacher" required>
          </div>
          <div class="input-group" style="text-align: left; margin-bottom: 24px;">
            <label>Password</label>
            <input type="password" id="login-password" class="input-control" placeholder="Enter password (password)" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('login-form').onsubmit = (e) => {
    e.preventDefault();
    const user = document.getElementById('login-username').value.trim().toLowerCase();
    const pass = document.getElementById('login-password').value;
    const err = document.getElementById('login-error');

    // Check dynamic credentials
    if (!appData.users || appData.users.length === 0) {
      // Fallback if db is completely empty for some reason
      if (user === 'admin' && pass === 'password') {
        currentUser = { role: 'admin', username: 'Administrator (Fallback)' };
      }
    } else {
      const foundUser = appData.users.find(u => u.username.toLowerCase() === user && u.password === pass);
      if (foundUser) {
        currentUser = { 
          role: foundUser.role, 
          username: foundUser.username,
          fullName: foundUser.fullName || '',
          assignedClass: foundUser.assignedClass || ''
        };
      }
    }

    if (currentUser) {
      err.style.display = 'none';
      localStorage.setItem('alBushiraSession', JSON.stringify(currentUser));
      renderAppLayout();
    } else {
      err.style.display = 'block';
    }
  };
}

function renderAppLayout() {
  document.querySelector('#app').innerHTML = `
    <!-- Mobile overlay -->
    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <!-- Mobile topbar -->
    <div class="mobile-topbar">
      <div class="mobile-topbar-brand">
        <div class="brand-icon">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <span>Al-Bushira</span>
      </div>
      <button class="hamburger-btn" id="hamburger-btn" aria-label="Open menu">
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>

    <aside class="sidebar" id="main-sidebar">
      <div class="brand">
        <div class="brand-icon">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div class="brand-text">
          <h1>Al-Bushira</h1>
          <p>Result Compilation</p>
        </div>
      </div>
      
      <div class="sidebar-profile">
        <p class="label">Logged in as</p>
        <p class="name">${currentUser.fullName || currentUser.username}</p>
        <div class="badge ${currentUser.role === 'admin' ? 'admin' : ''}">${currentUser.role.toUpperCase()}</div>
      </div>

      <ul class="nav-links">
        <li class="nav-item active" data-page="dashboard">
          <i class="fa-solid fa-chart-pie"></i>
          <span>Dashboard</span>
        </li>
        <li class="nav-item" data-page="students">
          <i class="fa-solid fa-users"></i>
          <span>Students</span>
        </li>
        <li class="nav-item" data-page="results">
          <i class="fa-solid fa-file-signature"></i>
          <span>Manage Results</span>
        </li>
        <li class="nav-item" data-page="sheets">
          <i class="fa-solid fa-print"></i>
          <span>Result Sheets</span>
        </li>
        ${currentUser.role === 'admin' ? `
        <li class="nav-item" data-page="settings">
          <i class="fa-solid fa-gear"></i>
          <span>Settings</span>
        </li>
        ` : ''}
        <li class="nav-item" id="nav-change-password" style="margin-top: auto;">
          <i class="fa-solid fa-key"></i>
          <span>Change Password</span>
        </li>
        <li class="nav-item" id="nav-logout" style="color: #ef4444;">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </li>
      </ul>
    </aside>

    <main class="main-content">
      <div class="header">
        <div class="header-title" id="page-header">
          <h2>Dashboard</h2>
          <p>Overview of school performance</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="primary-action-btn" style="display: none;">
            <i class="fa-solid fa-plus"></i> Add New
          </button>
        </div>
      </div>

      <div id="page-content">
        <!-- Dashboard Content Default -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-info">
              <p>Total Students</p>
              <h3 id="stat-students">${appData.students.length}</h3>
            </div>
            <div class="stat-icon blue">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <p>Total Classes</p>
              <h3 id="stat-classes">${appData.classes.length}</h3>
            </div>
            <div class="stat-icon green">
              <i class="fa-solid fa-chalkboard-user"></i>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <p>Total Subjects</p>
              <h3 id="stat-subjects">${appData.subjects.length}</h3>
            </div>
            <div class="stat-icon orange">
              <i class="fa-solid fa-book-open"></i>
            </div>
          </div>
        </div>

        <div class="table-container">
          <h3 style="margin-bottom: 20px; font-weight: 600; color: var(--text-main);">Recent Activity</h3>
          <p style="color: var(--text-muted);">No recent activities properly recorded yet.</p>
        </div>
      </div>
    </main>

    <!-- Change Password Modal -->
    <div id="change-password-modal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 200; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div class="modal-content" style="background: white; padding: 32px; border-radius: 24px; width: 100%; max-width: 400px; box-shadow: var(--shadow-lg);">
        <h3 style="margin-bottom: 24px;">Change Password</h3>
        <form id="change-password-form">
          <div class="input-group">
            <label>Current Password</label>
            <input type="password" id="cp-current" class="input-control" required>
          </div>
          <div class="input-group">
            <label>New Password</label>
            <input type="password" id="cp-new" class="input-control" required minlength="6">
          </div>
          <div class="input-group">
            <label>Confirm New Password</label>
            <input type="password" id="cp-confirm" class="input-control" required minlength="6">
          </div>
          <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
            <button type="button" class="btn btn-ghost" id="cancel-cp-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  `;

  attachLayoutEvents();
}

function attachLayoutEvents() {
  navItems = document.querySelectorAll('.nav-item:not(#nav-logout)');
  pageHeader = document.querySelector('#page-header');
  pageContent = document.querySelector('#page-content');
  primaryActionBtn = document.querySelector('#primary-action-btn');

  // Mobile sidebar toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Close sidebar on mobile after nav click
      if (sidebar) closeSidebar();

      // Keep active state
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      
      const pageId = item.getAttribute('data-page');
      const pageData = pages[pageId];
      if(!pageData) return;
      
      // Update Header
      pageHeader.innerHTML = `<h2>${pageData.title}</h2><p>${pageData.subtitle}</p>`;
      
      // Update Action Button
      if (pageData.action) {
        primaryActionBtn.style.display = 'inline-flex';
        primaryActionBtn.innerHTML = pageData.action;
      } else {
        primaryActionBtn.style.display = 'none';
        primaryActionBtn.innerHTML = '';
      }
      
      // Render Content
      pageContent.innerHTML = pageData.render();
      
      // Re-attach specific event listeners based on page
      if(pageId === 'students') attachStudentEvents();
      if(pageId === 'results') attachResultEvents();
      if(pageId === 'sheets') attachSheetEvents();
      if(pageId === 'settings' && currentUser.role === 'admin') attachSettingsEvents();
    });
  });

  // Change Password Logic
  const cpBtn = document.getElementById('nav-change-password');
  const cpModal = document.getElementById('change-password-modal');
  const cpForm = document.getElementById('change-password-form');
  const cancelCpBtn = document.getElementById('cancel-cp-btn');

  if (cpBtn && cpModal) {
    cpBtn.addEventListener('click', () => {
      cpModal.style.display = 'flex';
      cpForm.reset();
    });
  }

  if (cancelCpBtn) {
    cancelCpBtn.addEventListener('click', () => {
      cpModal.style.display = 'none';
      cpForm.reset();
    });
  }

  if (cpForm) {
    cpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const currentPass = document.getElementById('cp-current').value;
      const newPass = document.getElementById('cp-new').value;
      const confirmPass = document.getElementById('cp-confirm').value;

      // Ensure user exists in our appData array to check current password
      const userIndex = appData.users.findIndex(u => u.username.toLowerCase() === currentUser.username.toLowerCase());
      
      if (userIndex === -1) {
        alert('Could not locate user account in the database.');
        return;
      }

      const dbUser = appData.users[userIndex];

      if (currentPass !== dbUser.password) {
        alert('Current password is incorrect.');
        return;
      }

      if (newPass !== confirmPass) {
        alert('New passwords do not match. Please ensure both fields are exactly the same.');
        return;
      }

      if (newPass === currentPass) {
        alert('New password must be different from the current password.');
        return;
      }

      // Update password
      appData.users[userIndex].password = newPass;

      try {
        await saveAppData();
        
        // Update local session to avoid needing to relogin
        currentUser.password = newPass; // Update memory
        localStorage.setItem('alBushiraSession', JSON.stringify(currentUser)); // Update local storage
        
        alert('Password updated successfully!');
        cpModal.style.display = 'none';
        cpForm.reset();
      } catch (err) {
        alert('Error saving new password to the cloud. Please try again.');
        console.error(err);
      }
    });
  }

  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if(confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('alBushiraSession');
        currentUser = null;
        renderLoginScreen();
      }
    });
  }
}

const pages = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Overview of school performance',
    action: null,
    render: () => {
      // Filter stats for teachers
      let totalStudentsCount = appData.students.length;
      if (currentUser.role !== 'admin' && currentUser.assignedClass) {
        totalStudentsCount = appData.students.filter(s => s.class === currentUser.assignedClass).length;
      }

      // Re-render dashboard stats inline
      return `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-info"><p>Total Students</p><h3 id="stat-students">${totalStudentsCount}</h3></div>
            <div class="stat-icon blue"><i class="fa-solid fa-users"></i></div>
          </div>
          <div class="stat-card">
            <div class="stat-info"><p>Total Classes</p><h3 id="stat-classes">${appData.classes.length}</h3></div>
            <div class="stat-icon green"><i class="fa-solid fa-chalkboard-user"></i></div>
          </div>
          <div class="stat-card">
            <div class="stat-info"><p>Total Subjects</p><h3 id="stat-subjects">${appData.subjects.length}</h3></div>
            <div class="stat-icon orange"><i class="fa-solid fa-book-open"></i></div>
          </div>
        </div>
        <div class="table-container">
          <h3 style="margin-bottom: 20px; font-weight: 600;">Welcome back, ${currentUser.fullName || currentUser.username}!</h3>
          <p style="color: var(--text-muted);">Manage students and records from the left menu.</p>
        </div>
      `;
    }
  },
  students: {
    title: 'Student Management',
    subtitle: 'Manage all students registered for the term',
    action: '<i class="fa-solid fa-plus"></i> Add Student',
    render: () => {
      let html = `
        <div class="table-container" style="margin-bottom: 20px;">
          <div style="display: flex; gap: 16px; align-items: flex-end;">
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Search</label>
              <input type="text" id="search-student-input" class="input-control" placeholder="Search by Name or Reg No...">
            </div>
            ${currentUser.role === 'admin' ? `
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Filter by Class</label>
              <select id="filter-class-select" class="input-control">
                <option value="">All Classes</option>
                ${appData.classes.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            ` : ''}
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Registration No</th>
                <th>Full Name</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="student-table-body">
      `;
      
      let visibleStudents = appData.students;
      if (currentUser.role !== 'admin' && currentUser.assignedClass) {
        visibleStudents = appData.students.filter(s => s.class === currentUser.assignedClass);
      }
      
      if (visibleStudents.length === 0) {
        html += `<tr class="no-results-row"><td colspan="5" style="text-align: center; color: var(--text-muted);">No students found.</td></tr>`;
      } else {
        visibleStudents.forEach((student) => {
          const trueIndex = appData.students.findIndex(s => s.regNo === student.regNo);
          html += `
            <tr class="student-row">
              <td class="stu-col-reg">${student.regNo || '-'}</td>
              <td class="stu-col-name">${student.name}</td>
              <td class="stu-col-class">${student.class}</td>
              <td>${student.gender}</td>
              <td>
                <button class="btn btn-icon btn-edit-student" data-index="${trueIndex}" style="background:#e0f2fe;color:#0284c7;margin-right:4px;"><i class="fa-solid fa-pen"></i></button>
                ${currentUser.role === 'admin' ? `<button class="btn btn-icon btn-delete-student" data-index="${trueIndex}" style="background:var(--danger-bg);color:var(--danger);"><i class="fa-solid fa-trash"></i></button>` : ''}
              </td>
            </tr>
          `;
        });
      }
      
      html += `
            </tbody>
          </table>
        </div>
        
        <!-- Add Student Modal Overlays -->
        <div id="student-modal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
          <div class="modal-content" style="background: white; padding: 32px; border-radius: 24px; width: 100%; max-width: 500px; box-shadow: var(--shadow-lg);">
            <h3 style="margin-bottom: 24px;">Add New Student</h3>
            <form id="add-student-form">
              <div class="input-group">
                <label>Registration Number</label>
                <input type="text" id="stu-reg" class="input-control" required>
              </div>
              <div class="input-group">
                <label>Full Name</label>
                <input type="text" id="stu-name" class="input-control" required>
              </div>
              <div style="display: flex; gap: 16px;">
                <div class="input-group" style="flex: 1;">
                  <label>Class</label>
                  <select id="stu-class" class="input-control" required>
                    ${appData.classes.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
                <div class="input-group" style="flex: 1;">
                  <label>Gender</label>
                  <select id="stu-gender" class="input-control" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div class="input-group">
                <label>Passport Photo (Optional)</label>
                <input type="file" id="stu-photo" class="input-control" accept="image/*">
              </div>
              <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
                <button type="button" class="btn btn-ghost" id="cancel-stu-btn">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      `;
      return html;
    }
  },
  results: {
    title: 'Manage Results',
    subtitle: 'Input scores for students across subject combinations',
    action: null,
    render: () => {
      let classOptions = appData.classes.map(c => `<option value="${c}">${c}</option>`).join('');
      let subOptions = appData.subjects.map(s => `<option value="${s}">${s}</option>`).join('');
      
      return `
        <div class="table-container" style="margin-bottom: 20px;">
          <div style="display: flex; gap: 16px; margin-bottom: 24px;">
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Select Class</label>
              <select class="input-control" id="result-class-select">
                <option value="">-- Choose Class --</option>
                ${currentUser.role !== 'admin' && currentUser.assignedClass ? `<option value="${currentUser.assignedClass}" selected>${currentUser.assignedClass}</option>` : classOptions}
              </select>
            </div>
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Select Subject</label>
              <select class="input-control" id="result-subject-select">
                <option value="">-- Choose Subject --</option>
                ${subOptions}
              </select>
            </div>
          </div>
          <div style="display: flex; gap: 16px;">
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Search Student</label>
              <input type="text" id="result-search-input" class="input-control" placeholder="Type name or registration number...">
            </div>
          </div>
        </div>
        <div id="result-entry-container" class="table-container">
           <p style="color:var(--text-muted); text-align:center;">Select class and subject to begin entry.</p>
        </div>
      `;
    }
  },
  sheets: {
    title: 'Print Result Sheets',
    subtitle: 'Generate printable termly reports',
    action: null,
    render: () => {
      let classOptions = appData.classes.map(c => `<option value="${c}">${c}</option>`).join('');
      return `
        <div class="table-container" style="margin-bottom: 20px;">
          <div style="display: flex; gap: 16px; align-items: flex-end;">
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Select Class to Generate Sheets For</label>
              <select class="input-control" id="sheet-class-select">
                <option value="">-- Choose Class --</option>
                ${currentUser.role !== 'admin' && currentUser.assignedClass ? `<option value="${currentUser.assignedClass}" selected>${currentUser.assignedClass}</option>` : classOptions}
              </select>
            </div>
            <button class="btn btn-primary" id="btn-generate-sheets" style="height: 46px;">
              <i class="fa-solid fa-file-pdf"></i> Generate Sheets
            </button>
          </div>
        </div>
        <div id="sheets-preview-container">
          <div class="table-container">
             <p style="color:var(--text-muted); text-align:center;">Select class and click generate to preview sheets.</p>
          </div>
        </div>
      `;
    }
  },
  settings: {
    title: 'Settings',
    subtitle: 'Configure application behavior',
    action: null,
    render: () => {
      let classOptions = appData.classes.map(c => `<option value="${c}">${c}</option>`).join('');
      let classHtml = appData.classes.map((c, i) => `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
          <span>${c}</span>
          <button class="btn btn-icon btn-delete-class" data-index="${i}" style="background:var(--danger-bg);color:var(--danger);"><i class="fa-solid fa-trash"></i></button>
        </div>
      `).join('');
      if(appData.classes.length === 0) classHtml = '<p style="color:var(--text-muted);">No classes configured.</p>';

      let subjectHtml = appData.subjects.map((s, i) => `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
          <span>${s}</span>
          <button class="btn btn-icon btn-delete-subject" data-index="${i}" style="background:var(--danger-bg);color:var(--danger);"><i class="fa-solid fa-trash"></i></button>
        </div>
      `).join('');
      if(appData.subjects.length === 0) subjectHtml = '<p style="color:var(--text-muted);">No subjects configured.</p>';

      let userHtml = '';
      if (appData.users && appData.users.length > 0) {
        userHtml = appData.users.map((u, i) => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border);">
            <div>
               <strong>${u.fullName || u.username}</strong>
               <span style="font-size: 11px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #475569; margin-left:8px;">${u.role.toUpperCase()}</span>
               ${u.role === 'user' && u.assignedClass ? `<span style="font-size: 11px; background: #dbf4ff; border: 1px solid #bae6fd; padding: 2px 6px; border-radius: 4px; color: #0369a1; margin-left:4px;"><i class="fa-solid fa-chalkboard-user"></i> ${u.assignedClass}</span>` : ''}
            </div>
            ${u.username.toLowerCase() !== 'admin' ? `
            <div>
               <button class="btn btn-icon btn-edit-user" data-index="${i}" style="background:#e0f2fe;color:#0284c7;margin-right:4px;"><i class="fa-solid fa-pen"></i></button>
               <button class="btn btn-icon btn-delete-user" data-index="${i}" style="background:var(--danger-bg);color:var(--danger);"><i class="fa-solid fa-trash"></i></button>
            </div>
            ` : ''}
          </div>
        `).join('');
      } else {
        userHtml = '<p style="color:var(--text-muted);">No additional users configured.</p>';
      }

      return `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="display:flex; gap:20px;">
            <!-- Manage Classes -->
            <div class="table-container" style="flex:1;">
              <h3 style="margin-bottom:16px;">Manage Classes</h3>
              <form id="add-class-form" style="display:flex; gap:12px; margin-bottom:20px;">
                <input type="text" id="new-class-input" class="input-control" placeholder="E.g. Primary 1" required>
                <button type="submit" class="btn btn-primary">Add</button>
              </form>
              <div id="class-list-container">
                ${classHtml}
              </div>
            </div>
            <!-- Manage Subjects -->
            <div class="table-container" style="flex:1;">
              <h3 style="margin-bottom:16px;">Manage Subjects</h3>
              <form id="add-subject-form" style="display:flex; gap:12px; margin-bottom:20px;">
                <input type="text" id="new-subject-input" class="input-control" placeholder="E.g. Mathematics" required>
                <button type="submit" class="btn btn-primary">Add</button>
              </form>
              <div id="subject-list-container">
                ${subjectHtml}
              </div>
            </div>
          </div>
          <!-- Manage Users -->
          <div class="table-container">
            <h3 style="margin-bottom:16px;">Manage System Users</h3>
            <form id="add-user-form" style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
              <div style="display:flex; gap:12px;">
                <div class="input-group" style="flex:1; margin-bottom:0;">
                  <label>Full Name</label>
                  <input type="text" id="new-user-fullname" class="input-control" placeholder="John Doe" required>
                </div>
                <div class="input-group" style="flex:1; margin-bottom:0;">
                  <label>Username (Login ID)</label>
                  <input type="text" id="new-user-username" class="input-control" placeholder="teacher_john" required>
                </div>
                <div class="input-group" style="flex:1; margin-bottom:0;">
                  <label>Password</label>
                  <input type="password" id="new-user-password" class="input-control" placeholder="SecretPassword123" required>
                </div>
              </div>
              <div style="display:flex; gap:12px; align-items:flex-end;">
                <div class="input-group" style="flex:1; margin-bottom:0;">
                  <label>Role</label>
                  <select id="new-user-role" class="input-control">
                    <option value="user">Teacher (User)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div class="input-group" style="flex:1; margin-bottom:0;" id="assigned-class-group">
                  <label>Assigned Class (For Teachers)</label>
                  <select id="new-user-assigned-class" class="input-control">
                    <option value="">-- No Specific Class --</option>
                    ${classOptions}
                  </select>
                </div>
                <button type="submit" id="user-submit-btn" class="btn btn-primary" style="height:46px; width: 140px;">Add User</button>
                <button type="button" id="cancel-edit-btn" class="btn" style="display:none; height:46px;">Cancel</button>
              </div>
            </form>
            <div id="user-list-container">
              ${userHtml}
            </div>
          </div>
        </div>
      `;
    }
  }
};

// Utility function to attach student page events
function attachStudentEvents() {
  const modal = document.getElementById('student-modal');
  const cancelBtn = document.getElementById('cancel-stu-btn');
  const form = document.getElementById('add-student-form');
  
  const searchInput = document.getElementById('search-student-input');
  const classFilter = document.getElementById('filter-class-select');
  
  const filterTable = () => {
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    const cls = classFilter ? classFilter.value : '';
    const rows = document.querySelectorAll('.student-row');
    
    let visibleCount = 0;
    rows.forEach(row => {
      const reg = row.querySelector('.stu-col-reg').innerText.toLowerCase();
      const name = row.querySelector('.stu-col-name').innerText.toLowerCase();
      const rowClass = row.querySelector('.stu-col-class').innerText;
      
      const matchSearch = reg.includes(term) || name.includes(term);
      const matchClass = cls === '' || rowClass === cls;
      
      if (matchSearch && matchClass) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    const noResultsRow = document.querySelector('.no-results-row');
    if (noResultsRow) {
      if (visibleCount === 0 && rows.length > 0) {
        noResultsRow.style.display = '';
      } else if (visibleCount > 0) {
        noResultsRow.style.display = 'none';
      }
    }
  };

  if(searchInput) searchInput.addEventListener('input', filterTable);
  if(classFilter) classFilter.addEventListener('change', filterTable);

  if(primaryActionBtn && pageHeader.innerText.includes('Student')) {
    primaryActionBtn.onclick = () => {
      form.removeAttribute('data-edit-index');
      document.querySelector('#student-modal h3').innerText = 'Add New Student';
      document.querySelector('#add-student-form button[type="submit"]').innerText = 'Save Student';
      
      // If teacher, pre-select class and optionally lock it
      const classSelect = document.getElementById('stu-class');
      if (currentUser.role !== 'admin' && currentUser.assignedClass) {
        classSelect.value = currentUser.assignedClass;
        classSelect.setAttribute('disabled', 'true');
      } else {
        classSelect.removeAttribute('disabled');
      }
      
      modal.style.display = 'flex';
    };
  }

  if(cancelBtn) {
    cancelBtn.onclick = () => {
      modal.style.display = 'none';
      form.reset();
      form.removeAttribute('data-edit-index');
    };
  }

  if(form) {
    form.onsubmit = async (e) => {
      e.preventDefault();

      const photoInput = document.getElementById('stu-photo');
      let photoData = null;
      
      if(photoInput.files && photoInput.files[0]) {
        photoData = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(photoInput.files[0]);
        });
      }

      const regNo = document.getElementById('stu-reg').value.trim();
      const editIndex = form.getAttribute('data-edit-index');
      
      // Prevent duplicate Registration Numbers
      const duplicateIndex = appData.students.findIndex(s => s.regNo.toLowerCase() === regNo.toLowerCase());
      if (duplicateIndex > -1 && duplicateIndex.toString() !== editIndex) {
        alert('A student with this Registration Number already exists. Please use a unique number.');
        return;
      }

      // Preserve old photo if editing and no new photo selected
      if (!photoData && editIndex !== null) {
        photoData = appData.students[editIndex].photo;
      }
      
      // Get class value, handling disabled state for teachers
      const classSelect = document.getElementById('stu-class');
      const studentClass = classSelect.disabled ? classSelect.value : classSelect.value; 

      const newStudent = {
        regNo: regNo,
        name: document.getElementById('stu-name').value,
        class: studentClass,
        gender: document.getElementById('stu-gender').value,
        photo: photoData
      };
      
      if (editIndex !== null) {
        const oldRegNo = appData.students[editIndex].regNo;
        appData.students[editIndex] = newStudent;
        
        // Cascade changes to their result records so data isn't wiped out when updating the Reg No.
        if (oldRegNo.toLowerCase() !== newStudent.regNo.toLowerCase()) {
          appData.results.forEach(r => {
            if (r.studentId === oldRegNo) r.studentId = newStudent.regNo;
          });
        }
      } else {
        appData.students.push(newStudent);
      }
      
      await saveAppData();
      
      modal.style.display = 'none';
      form.reset();
      form.removeAttribute('data-edit-index');
      
      // Re-render
      pageContent.innerHTML = pages.students.render();
      attachStudentEvents(); // re-attach after render
    };
  }

  // Edit buttons
  document.querySelectorAll('.btn-edit-student').forEach(btn => {
    btn.onclick = (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      const s = appData.students[index];
      
      document.getElementById('stu-reg').value = s.regNo;
      document.getElementById('stu-name').value = s.name;
      
      const classSelect = document.getElementById('stu-class');
      classSelect.value = s.class;
      if (currentUser.role !== 'admin' && currentUser.assignedClass) {
        classSelect.setAttribute('disabled', 'true');
      } else {
        classSelect.removeAttribute('disabled');
      }
      
      document.getElementById('stu-gender').value = s.gender;
      
      form.setAttribute('data-edit-index', index);
      document.querySelector('#student-modal h3').innerText = 'Edit Student';
      document.querySelector('#add-student-form button[type="submit"]').innerText = 'Update Student';
      
      modal.style.display = 'flex';
    };
  });
  
  // Delete buttons
  document.querySelectorAll('.btn-delete-student').forEach(btn => {
    btn.onclick = async (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      if(confirm('Are you sure you want to delete this student?')) {
        appData.students.splice(index, 1);
        await saveAppData();
        pageContent.innerHTML = pages.students.render();
        attachStudentEvents();
      }
    };
  });
}

// Utility function to attach results page events
function attachResultEvents() {
  const classSelect = document.getElementById('result-class-select');
  const subjectSelect = document.getElementById('result-subject-select');
  const container = document.getElementById('result-entry-container');
  
  if(!classSelect || !subjectSelect || !container) return;

  const renderEntryForm = () => {
    const cls = classSelect.value;
    const sub = subjectSelect.value;
    if(!cls || !sub) {
      container.innerHTML = '<p style="color:var(--text-muted); text-align:center;">Select class and subject to begin entry.</p>';
      return;
    }

    const studentsInClass = appData.students.filter(s => s.class === cls);
    if(studentsInClass.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); text-align:center;">No students found in this class.</p>';
      return;
    }

    let html = `
      <form id="save-results-form">
        <table>
          <thead>
            <tr>
              <th style="width: 30%">Student Name</th>
              <th>1st CA (15)</th>
              <th>2nd CA (15)</th>
              <th>Assignment (10)</th>
              <th>Exam (60)</th>
              <th>Total (100)</th>
            </tr>
          </thead>
          <tbody>
    `;

    studentsInClass.forEach(student => {
      // Find existing result
      const existing = appData.results.find(r => r.studentId === student.regNo && r.subject === sub && r.class === cls) || {};
      html += `
        <tr class="result-entry-row">
          <td><strong class="re-student-name">${student.name}</strong><br><small class="re-student-reg" style="color:var(--text-muted);">${student.regNo}</small></td>
          <td><input type="number" max="15" min="0" class="input-control ca1-input" data-reg="${student.regNo}" value="${existing.ca1 !== undefined ? existing.ca1 : ''}" style="width: 70px;" required></td>
          <td><input type="number" max="15" min="0" class="input-control ca2-input" data-reg="${student.regNo}" value="${existing.ca2 !== undefined ? existing.ca2 : ''}" style="width: 70px;" required></td>
          <td><input type="number" max="10" min="0" class="input-control assignment-input" data-reg="${student.regNo}" value="${existing.assignment !== undefined ? existing.assignment : ''}" style="width: 70px;" required></td>
          <td><input type="number" max="60" min="0" class="input-control exam-input" data-reg="${student.regNo}" value="${existing.exam !== undefined ? existing.exam : ''}" style="width: 80px;" required></td>
          <td><span class="total-display" id="total-${student.regNo}">${existing.total || 0}</span></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
        <div style="margin-top: 24px; text-align: right;">
          <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> Save Results</button>
        </div>
      </form>
    `;

    container.innerHTML = html;

    // Attach calculation logic
    const form = document.getElementById('save-results-form');
    document.querySelectorAll('.input-control[type="number"]').forEach(input => {
      input.addEventListener('input', (e) => {
        const tr = e.target.closest('tr');
        const ca1 = parseInt(tr.querySelector('.ca1-input').value) || 0;
        const ca2 = parseInt(tr.querySelector('.ca2-input').value) || 0;
        const assignment = parseInt(tr.querySelector('.assignment-input').value) || 0;
        const exam = parseInt(tr.querySelector('.exam-input').value) || 0;
        tr.querySelector('.total-display').innerText = ca1 + ca2 + assignment + exam;
      });
    });

    form.onsubmit = async (e) => {
      e.preventDefault();
      
      studentsInClass.forEach(student => {
        const tr = document.querySelector(`input[data-reg="${student.regNo}"]`).closest('tr');
        const ca1 = parseInt(tr.querySelector('.ca1-input').value) || 0;
        const ca2 = parseInt(tr.querySelector('.ca2-input').value) || 0;
        const assignment = parseInt(tr.querySelector('.assignment-input').value) || 0;
        const exam = parseInt(tr.querySelector('.exam-input').value) || 0;
        const total = ca1 + ca2 + assignment + exam;
        
        let grade = 'F', remark = 'Fail';
        if(total >= 70) { grade = 'A'; remark = 'Excellent'; }
        else if(total >= 60) { grade = 'B'; remark = 'Very Good'; }
        else if(total >= 50) { grade = 'C'; remark = 'Good'; }
        else if(total >= 40) { grade = 'D'; remark = 'Pass'; }
        
        const resIdx = appData.results.findIndex(r => r.studentId === student.regNo && r.subject === sub && r.class === cls);
        const resObj = { studentId: student.regNo, class: cls, subject: sub, ca1, ca2, assignment, exam, total, grade, remark };
        
        if(resIdx > -1) {
          appData.results[resIdx] = resObj;
        } else {
          appData.results.push(resObj);
        }
      });

      await saveAppData();
      alert('Results saved successfully!');
    };
  };

  classSelect.addEventListener('change', renderEntryForm);
  subjectSelect.addEventListener('change', renderEntryForm);
  
  const searchInput = document.getElementById('result-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase();
      const rows = document.querySelectorAll('.result-entry-row');
      rows.forEach(row => {
        const name = row.querySelector('.re-student-name').innerText.toLowerCase();
        const reg = row.querySelector('.re-student-reg').innerText.toLowerCase();
        if (name.includes(term) || reg.includes(term)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
}

// Outdated event listeners logic replaced by attachLayoutEvents

function attachSettingsEvents() {
  const classForm = document.getElementById('add-class-form');
  const subjectForm = document.getElementById('add-subject-form');
  const userForm = document.getElementById('add-user-form');

  if(classForm) {
    classForm.onsubmit = async (e) => {
      e.preventDefault();
      const val = document.getElementById('new-class-input').value.trim();
      if(val && !appData.classes.includes(val)) {
        appData.classes.push(val);
        await saveAppData();
        document.querySelector('[data-page="settings"]').click(); // Re-render
      } else if (appData.classes.includes(val)) {
        alert('Class already exists!');
      }
    };
  }

  if(subjectForm) {
    subjectForm.onsubmit = async (e) => {
      e.preventDefault();
      const val = document.getElementById('new-subject-input').value.trim();
      if(val && !appData.subjects.includes(val)) {
        appData.subjects.push(val);
        await saveAppData();
        document.querySelector('[data-page="settings"]').click(); // Re-render
      } else if (appData.subjects.includes(val)) {
        alert('Subject already exists!');
      }
    };
  }

  document.querySelectorAll('.btn-delete-class').forEach(btn => {
    btn.onclick = async (e) => {
      const idx = e.currentTarget.getAttribute('data-index');
      if(confirm('Are you sure you want to remove this class?')) {
        appData.classes.splice(idx, 1);
        await saveAppData();
        document.querySelector('[data-page="settings"]').click();
      }
    };
  });

  document.querySelectorAll('.btn-delete-subject').forEach(btn => {
    btn.onclick = async (e) => {
      const idx = e.currentTarget.getAttribute('data-index');
      if(confirm('Are you sure you want to remove this subject?')) {
        appData.subjects.splice(idx, 1);
        await saveAppData();
        document.querySelector('[data-page="settings"]').click();
      }
    };
  });

  document.querySelectorAll('.btn-edit-user').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.currentTarget.getAttribute('data-index');
      const u = appData.users[idx];
      document.getElementById('new-user-fullname').value = u.fullName || '';
      document.getElementById('new-user-username').value = u.username;
      
      // Prevent changing username during edit
      document.getElementById('new-user-username').setAttribute('readonly', 'true');
      document.getElementById('new-user-username').style.backgroundColor = '#f1f5f9';
      
      document.getElementById('new-user-password').value = u.password;
      document.getElementById('new-user-role').value = u.role;
      document.getElementById('new-user-assigned-class').value = u.assignedClass || '';
      
      const submitBtn = document.getElementById('user-submit-btn');
      submitBtn.innerHTML = 'Update User';
      submitBtn.style.backgroundColor = '#0ea5e9';
      
      document.getElementById('cancel-edit-btn').style.display = 'inline-block';
      document.getElementById('add-user-form').scrollIntoView({behavior: 'smooth'});
    };
  });

  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  if (cancelEditBtn) {
    cancelEditBtn.onclick = () => {
       document.querySelector('[data-page="settings"]').click(); // Re-render to reset
    };
  }

  if (userForm) {
    userForm.onsubmit = async (e) => {
      e.preventDefault();
      const username = document.getElementById('new-user-username').value.trim();
      const password = document.getElementById('new-user-password').value;
      const role = document.getElementById('new-user-role').value;
      const fullName = document.getElementById('new-user-fullname').value.trim();
      const assignedClass = document.getElementById('new-user-assigned-class').value;

      if (role === 'user' && !assignedClass) {
        alert('You must assign a class when creating a Teacher (User) account.');
        return;
      }

      if (!appData.users) appData.users = [];

      const isEditMode = document.getElementById('new-user-username').hasAttribute('readonly');
      const existingIdx = appData.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());

      if (!isEditMode && existingIdx > -1) {
        alert('A user with that username already exists.');
        return;
      }

      if (isEditMode && existingIdx > -1) {
        appData.users[existingIdx] = { username, password, role, fullName, assignedClass };
      } else {
        appData.users.push({ username, password, role, fullName, assignedClass });
      }

      await saveAppData();
      
      document.querySelector('[data-page="settings"]').click(); // Re-render
    };
  }

  // Add event listener to visually indicate required class selection
  const roleSelect = document.getElementById('new-user-role');
  const classSelect = document.getElementById('new-user-assigned-class');
  if (roleSelect && classSelect) {
    roleSelect.addEventListener('change', (e) => {
      if (e.target.value === 'user') {
        classSelect.setAttribute('required', 'true');
      } else {
        classSelect.removeAttribute('required');
      }
    });
    // Trigger on load
    if (roleSelect.value === 'user') classSelect.setAttribute('required', 'true');
  }

  document.querySelectorAll('.btn-delete-user').forEach(btn => {
    btn.onclick = async (e) => {
      const idx = e.currentTarget.getAttribute('data-index');
      if(confirm('Are you sure you want to remove this user? They will no longer be able to log in.')) {
        appData.users.splice(idx, 1);
        await saveAppData();
        document.querySelector('[data-page="settings"]').click();
      }
    };
  });
}

function attachSheetEvents() {
  const btn = document.getElementById('btn-generate-sheets');
  const classSelect = document.getElementById('sheet-class-select');
  const container = document.getElementById('sheets-preview-container');

  if(!btn || !classSelect || !container) return;

  btn.onclick = () => {
    const cls = classSelect.value;
    if(!cls) {
      alert('Please select a class first.');
      return;
    }

    const students = appData.students.filter(s => s.class === cls);
    if(students.length === 0) {
      container.innerHTML = '<div class="table-container"><p style="text-align:center;">No students in this class.</p></div>';
      return;
    }

    let html = '';
    
    // Pre-calculate positions based on Average
    const classAverages = [];
    students.forEach(s => {
      const sRes = appData.results.filter(r => r.studentId === s.regNo && r.class === cls);
      let sTotal = 0;
      sRes.forEach(r => sTotal += r.total);
      const sAvg = sRes.length > 0 ? (sTotal / sRes.length) : 0;
      classAverages.push({ regNo: s.regNo, avg: sAvg });
    });
    
    // Calculate True Rank Method (1, 1, 3, 4, 4, 6)
    classAverages.sort((a, b) => b.avg - a.avg);
    
    let currentRank = 1;
    for(let i = 0; i < classAverages.length; i++) {
      if(i > 0 && classAverages[i].avg < classAverages[i-1].avg) {
        currentRank = i + 1; // Standard competition ranking
      }
      classAverages[i].rank = currentRank;
    }
    
    // Basic Style for print
    html += `
      <style>
        .result-sheet {
          background: white;
          padding: 50px 40px;
          margin-bottom: 60px;
          border-radius: 12px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          color: #1e293b;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }
        .result-sheet::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 12px;
          background: linear-gradient(90deg, #1e3a8a, #d97706, #059669);
        }
        .result-sheet::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 500px;
          height: 500px;
          transform: translate(-50%, -50%);
          background-image: url('./logo.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 0.04;
          z-index: 0;
          pointer-events: none;
        }
        .sheet-content-wrapper {
          position: relative;
          z-index: 10;
        }
        .sheet-header {
          text-align: center;
          margin-bottom: 35px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .school-logo {
          width: 100px;
          height: 100px;
          margin-bottom: 12px;
          object-fit: contain;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }
        .sheet-header h1 { 
          color: #1e3a8a; 
          margin-bottom: 4px; 
          font-size: 28px; 
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          text-shadow: 1px 1px 0px rgba(0,0,0,0.05);
        }
        .sheet-header p { 
          font-size: 15px; 
          margin-bottom: 16px; 
          color: #475569;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .sheet-title {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 10px 30px;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 1px;
          border-radius: 4px;
          position: relative;
          display: inline-block;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
          text-transform: uppercase;
        }
        .sheet-title::before, .sheet-title::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 30px;
          height: 2px;
          background: #3b82f6;
          opacity: 0.5;
        }
        .sheet-title::before { right: 100%; margin-right: 10px; }
        .sheet-title::after { left: 100%; margin-left: 10px; }
        .student-header {
          display: flex;
          align-items: stretch;
          gap: 20px;
          margin-bottom: 35px;
        }
        .student-photo {
          width: 120px;
          flex-shrink: 0;
          border-radius: 8px;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 12px;
          text-align: center;
        }
        .student-info { 
          flex: 1;
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 15px; 
          font-size: 14px;
          background: #f8fafc;
          padding: 20px 25px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .student-info p { margin-bottom: 8px; color: #64748b; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;}
        .student-info strong { color: #0f172a; font-weight: 800; font-size: 16px; display: block; margin-top: 2px; text-transform: none; letter-spacing: 0;}
        .sheet-table { 
          width: 100%; 
          border-collapse: separate; 
          border-spacing: 0;
          margin-bottom: 35px; 
          border-radius: 8px;
          border: 2px solid #cbd5e1;
          overflow: hidden;
        }
        .sheet-table th, .sheet-table td { 
          border-bottom: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          padding: 12px 14px; 
          text-align: center; 
          font-size: 14px;
          color: #334155;
        }
        .sheet-table th:last-child, .sheet-table td:last-child {
          border-right: none;
        }
        .sheet-table tbody tr:last-child td {
          border-bottom: none;
        }
        .sheet-table tbody tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .sheet-table th { 
          background-color: #1e293b; 
          font-weight: 700; 
          color: white;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1px;
        }
        .sheet-table td.sub-name { 
          text-align: left; 
          font-weight: 700;
          color: #0f172a;
        }
        .sheet-table td strong {
          color: #1d4ed8;
          font-weight: 800;
          font-size: 15px;
        }
        .summary-box { 
          display: flex; 
          justify-content: space-between; 
          border: 2px solid #cbd5e1; 
          padding: 24px; 
          background: #f8fafc;
          border-radius: 8px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .summary-box div {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
          border-right: 1px solid #e2e8f0;
        }
        .summary-box div:last-child {
          border-right: none;
        }
        .summary-box strong {
          font-size: 11px;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .summary-box span {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
        }
        .signature-area { 
          display: flex; 
          justify-content: space-around; 
          margin-top: 70px;
          padding: 0 20px;
        }
        .sig-block {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sig-line { 
          width: 250px; 
          border-bottom: 2px dashed #cbd5e1; 
          margin-bottom: 12px;
        }
        .sig-block p {
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        @media screen and (max-width: 768px) {
          .result-sheet { padding: 30px 20px; }
          .sheet-header h1 { font-size: 18px; text-align: center; }
          .sheet-header p { font-size: 12px; text-align: center; }
          .student-header { flex-direction: column; align-items: center; text-align: center; gap: 15px; }
          .student-info { grid-template-columns: 1fr; border-left: none; border-top: 4px solid #3b82f6; width: 100%; }
          .student-info div { margin-bottom: 10px; }
          .sheet-table { display: block; overflow-x: auto; white-space: nowrap; }
          .summary-box { flex-wrap: wrap; gap: 10px; padding: 15px; }
          .summary-box div { border-right: none; width: 45%; padding: 5px; border-bottom: 1px solid #e2e8f0; }
          .signature-area { flex-direction: column; gap: 40px; margin-top: 40px; }
        }
        
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            background: white; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
          body * { visibility: hidden; }
          #sheets-preview-container, #sheets-preview-container * { visibility: visible; }
          #sheets-preview-container { left: 0; top: 0; width: 100%; position: absolute; }
          .hide-on-print { display: none !important; }
          .result-sheet { 
            width: 100%;
            max-width: 210mm;
            height: 297mm;
            box-sizing: border-box;
            box-shadow: none !important; 
            border-radius: 0 !important; 
            margin: 0 auto !important; 
            page-break-after: always; 
            page-break-inside: avoid;
            border: none !important; 
            padding: 15px !important;
            transform: none !important;
          }
          .result-sheet::after {
            opacity: 0.08 !important; /* Slightly darker watermark for print */
          }
          .result-sheet:last-child { page-break-after: auto; }
        }
      </style>
      
      <div id="sheet-actions-bar" class="hide-on-print" style="margin-bottom: 20px; display: flex; justify-content: flex-end; gap: 12px;">
         <button class="btn" style="background:#0ea5e9; color:white;" onclick="downloadAllPDFs()"><i class="fa-solid fa-download"></i> Download PDF(s)</button>
         <button class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> Print All Sheets</button>
      </div>
    `;

    students.forEach(student => {
      // Get student results
      const studentResults = appData.results.filter(r => r.studentId === student.regNo && r.class === cls);
      
      let totalMarks = 0;
      let tableRows = '';
      
      appData.subjects.forEach(sub => {
        const res = studentResults.find(r => r.subject === sub);
        if(res) {
          totalMarks += res.total;
          tableRows += `
            <tr>
              <td class="sub-name">${sub}</td>
              <td>${res.ca1 || 0}</td>
              <td>${res.ca2 || 0}</td>
              <td>${res.assignment || 0}</td>
              <td>${res.exam || 0}</td>
              <td><strong>${res.total || 0}</strong></td>
              <td>${res.grade || '-'}</td>
              <td>${res.remark || '-'}</td>
            </tr>
          `;
        } else {
          // Empty row for missing subject
          tableRows += `
            <tr>
              <td class="sub-name">${sub}</td>
              <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
            </tr>
          `;
        }
      });
      
      const avg = studentResults.length > 0 ? (totalMarks / studentResults.length).toFixed(2) : 0;
      
      // Get position
      const posData = classAverages.find(c => c.regNo === student.regNo);
      let positionStr = '-';
      if (posData && avg > 0) {
        let pos = posData.rank;
        let suffix = 'th';
        if (pos % 10 === 1 && pos % 100 !== 11) suffix = 'st';
        else if (pos % 10 === 2 && pos % 100 !== 12) suffix = 'nd';
        else if (pos % 10 === 3 && pos % 100 !== 13) suffix = 'rd';
        positionStr = pos + suffix;
      }

      html += `
        <div class="result-sheet">
          <div class="sheet-content-wrapper">
            <div class="sheet-header">
              <img src="./logo.png" alt="School Logo" class="school-logo">
              <h1>Al-Bushira Nursery and Primary School, Takum</h1>
              <p>Off Anguwan Abuja Takum, Taraba State</p>
              <div class="sheet-title">Termly Continuous Assessment Dossier</div>
            </div>
            
            <div class="student-header">
              ${student.photo ? `<img src="${student.photo}" class="student-photo" alt="Passport">` : `<div class="student-photo">No Photo</div>`}
              <div class="student-info">
                <div>
                  <p>Student Name</p><strong>${student.name}</strong>
                  <br>
                  <p>Registration No</p><strong>${student.regNo || 'N/A'}</strong>
                </div>
                <div>
                  <p>Class</p><strong>${student.class}</strong>
                  <br>
                  <p>Gender</p><strong>${student.gender}</strong>
                </div>
              </div>
            </div>
          
            <table class="sheet-table">
              <thead>
                <tr>
                  <th style="text-align:left; width: 32%">Subjects</th>
                  <th>1st CA (15)</th>
                  <th>2nd CA (15)</th>
                  <th>Assignment (10)</th>
                  <th>Exam (60)</th>
                  <th style="background:#0f172a;">Total (100)</th>
                  <th>Grade</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="summary-box">
              <div><strong>Total Marks</strong> <span>${totalMarks}</span></div>
              <div><strong>Average</strong> <span>${avg}%</span></div>
              <div><strong>Subjects</strong> <span>${studentResults.length}</span></div>
              <div><strong>Position</strong> <span style="color:#2563eb;">${positionStr}</span></div>
              <div><strong>No. in Class</strong> <span>${students.length}</span></div>
            </div>
            
            <div class="signature-area">
              <div class="sig-block">
                <div class="sig-line"></div>
                <p>Form Teacher's Signature</p>
              </div>
              <div class="sig-block">
                <div class="sig-line"></div>
                <p>Principal's Signature</p>
              </div>
            </div>
          </div> <!-- End sheet-content-wrapper -->
        </div>
      `;
    });
    
    container.innerHTML = html;
  };
}

// App Data State stub
let appData = {
  students: [],
  classes: [],
  subjects: [],
  results: [],
  users: [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'teacher', password: 'password', role: 'user' }
  ]
};

// Save Data Helper
async function saveAppData() {
  if (window.electronAPI) {
    await window.electronAPI.saveData(appData);
  } else {
    try {
      // Save to localStorage as offline cache
      localStorage.setItem('alBushiraData', JSON.stringify(appData));
      // Sync to Firebase Firestore
      await saveToFirestore(appData);
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }
}

// Initialize app with Data
async function initApp() {
  if (window.electronAPI) {
    try {
      appData = await window.electronAPI.getData();
    } catch(err) {
      console.error('Error loading data from Electron', err);
    }
  } else {
    try {
      // Try Firebase Firestore first
      const cloudData = await loadFromFirestore();
      if (cloudData) {
        appData = { ...appData, ...cloudData };
      } else {
        // Fall back to localStorage cache
        const localData = localStorage.getItem('alBushiraData');
        if (localData) appData = { ...appData, ...JSON.parse(localData) };
      }
    } catch (e) {
      console.warn('Firestore load failed, using localStorage cache.', e);
      const localData = localStorage.getItem('alBushiraData');
      if (localData) appData = { ...appData, ...JSON.parse(localData) };
    }

    // Ensure all arrays exist
    appData.students = appData.students || [];
    appData.classes  = appData.classes  || [];
    appData.subjects = appData.subjects || [];
    appData.results  = appData.results  || [];
    if (!appData.users) {
      appData.users = [
        { username: 'admin',   password: 'password', role: 'admin' },
        { username: 'teacher', password: 'password', role: 'user'  }
      ];
    }
  }
}

// PDF Download Helper
window.downloadAllPDFs = async function() {
  if (typeof html2pdf === 'undefined') {
    return alert('PDF Library is still loading or failed to load. Ensure you have an internet connection.');
  }

  const element = document.getElementById('sheets-preview-container');
  if (!element || document.querySelectorAll('.result-sheet').length === 0) {
    return alert('No sheets to download.');
  }
  
  const actionsBar = document.getElementById('sheet-actions-bar');
  if (actionsBar) actionsBar.style.display = 'none';

  const opt = {
    margin:       0,
    filename:     'Students_Result_Sheets.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: 'css', avoid: 'tr' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (e) {
    console.error('PDF Generation failed', e);
    alert('Failed to generate PDF. Make sure you are online to load the PDF library.');
  }
  
  if (actionsBar) actionsBar.style.display = 'flex';
};

// Track user activity to avoid re-rendering during active operations
let lastUserActivity = Date.now();
let isUserFocusedOnInput = false;

document.addEventListener('mousedown', () => { lastUserActivity = Date.now(); });
document.addEventListener('keydown',   () => { lastUserActivity = Date.now(); });
document.addEventListener('input',     () => { lastUserActivity = Date.now(); });
document.addEventListener('focusin',   (e) => {
  lastUserActivity = Date.now();
  if (e.target.matches('input, textarea, select')) isUserFocusedOnInput = true;
});
document.addEventListener('focusout',  (e) => {
  if (e.target.matches('input, textarea, select')) isUserFocusedOnInput = false;
});

function startBackgroundSync() {
  if (window.electronAPI) return;

  setInterval(async () => {
    if (!currentUser) return;

    // Never re-render if user is typing in a field or was recently active
    const isIdle = !isUserFocusedOnInput && (Date.now() - lastUserActivity) > 15000;

    try {
      const cloudData = await loadFromFirestore();
      if (!cloudData) return;

      const isDifferent = JSON.stringify(appData) !== JSON.stringify(cloudData);
      if (isDifferent) {
        appData = { ...appData, ...cloudData };
        appData.students = appData.students || [];
        appData.classes  = appData.classes  || [];
        appData.subjects = appData.subjects || [];
        appData.results  = appData.results  || [];

        // Only re-render the UI if user is idle and not in a form field
        if (isIdle) {
          const activeItem = document.querySelector('.nav-item.active');
          if (activeItem) {
            const pageId   = activeItem.getAttribute('data-page');
            const pageData = pages[pageId];
            if (pageData && pageContent) {
              const st = pageContent.scrollTop;
              pageContent.innerHTML = pageData.render();
              pageContent.scrollTop = st;
              if (pageId === 'students') attachStudentEvents();
              if (pageId === 'results')  attachResultEvents();
              if (pageId === 'sheets')   attachSheetEvents();
              if (pageId === 'settings' && currentUser.role === 'admin') attachSettingsEvents();
            }
          }
        }
      }
    } catch(e) { /* fail silently */ }
  }, 30000);
}

initApp().then(() => {
  const savedSession = localStorage.getItem('alBushiraSession');
  if (savedSession) {
    try {
      currentUser = JSON.parse(savedSession);
      renderAppLayout();
    } catch (e) {
      renderLoginScreen();
    }
  } else {
    renderLoginScreen();
  }
  startBackgroundSync();
});
