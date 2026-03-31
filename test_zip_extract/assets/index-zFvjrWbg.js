(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))m(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&m(o)}).observe(document,{childList:!0,subtree:!0});function s(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function m(t){if(t.ep)return;t.ep=!0;const r=s(t);fetch(t.href,r)}})();let u=null,$,j,w,S;function B(){document.querySelector("#app").innerHTML=`
    <div class="login-screen">
      <div class="login-card">
        <img src="/logo.png" alt="School Logo" class="school-logo">
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
  `,document.getElementById("login-form").onsubmit=i=>{i.preventDefault();const l=document.getElementById("login-username").value.trim().toLowerCase(),s=document.getElementById("login-password").value,m=document.getElementById("login-error");if(!e.users||e.users.length===0)l==="admin"&&s==="password"&&(u={role:"admin",username:"Administrator (Fallback)"});else{const t=e.users.find(r=>r.username.toLowerCase()===l&&r.password===s);t&&(u={role:t.role,username:t.username,fullName:t.fullName||"",assignedClass:t.assignedClass||""})}u?(m.style.display="none",localStorage.setItem("alBushiraSession",JSON.stringify(u)),L()):m.style.display="block"}}function L(){document.querySelector("#app").innerHTML=`
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div class="brand-text">
          <h1>Al-Bushira</h1>
          <p>Result Compilation</p>
        </div>
      </div>
      
      <div style="padding: 0 16px 16px; margin-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <p style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Logged in as</p>
        <p style="font-weight: 700; color: var(--primary); font-size: 15px;">${u.fullName||u.username}</p>
        <span style="font-size: 11px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #475569; display: inline-block; margin-top: 4px; border: 1px solid #cbd5e1;">${u.role.toUpperCase()}</span>
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
        ${u.role==="admin"?`
        <li class="nav-item" data-page="settings">
          <i class="fa-solid fa-gear"></i>
          <span>Settings</span>
        </li>
        `:""}
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
          <div class="stat-card" style="border-left: 4px solid var(--primary);">
            <div class="stat-info">
              <h3 id="stat-students">${e.students.length}</h3>
              <p>Total Students</p>
            </div>
            <div class="stat-icon blue" style="margin-left: auto;">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>
          <div class="stat-card" style="border-left: 4px solid var(--secondary);">
            <div class="stat-info">
              <h3 id="stat-classes">${e.classes.length}</h3>
              <p>Classes</p>
            </div>
            <div class="stat-icon green" style="margin-left: auto;">
              <i class="fa-solid fa-chalkboard-user"></i>
            </div>
          </div>
          <div class="stat-card" style="border-left: 4px solid var(--accent);">
            <div class="stat-info">
              <h3 id="stat-subjects">${e.subjects.length}</h3>
              <p>Subjects</p>
            </div>
            <div class="stat-icon orange" style="margin-left: auto;">
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
            <button type="button" class="btn" id="cancel-cp-btn" style="background: #f3f4f6; color: var(--text-main);">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  `,M()}function M(){$=document.querySelectorAll(".nav-item:not(#nav-logout)"),j=document.querySelector("#page-header"),w=document.querySelector("#page-content"),S=document.querySelector("#primary-action-btn"),$.forEach(r=>{r.addEventListener("click",()=>{$.forEach(n=>n.classList.remove("active")),r.classList.add("active");const o=r.getAttribute("data-page"),a=k[o];a&&(j.innerHTML=`<h2>${a.title}</h2><p>${a.subtitle}</p>`,a.action?(S.style.display="inline-flex",S.innerHTML=a.action):(S.style.display="none",S.innerHTML=""),w.innerHTML=a.render(),o==="students"&&C(),o==="results"&&T(),o==="sheets"&&P(),o==="settings"&&u.role==="admin"&&D())})});const i=document.getElementById("nav-change-password"),l=document.getElementById("change-password-modal"),s=document.getElementById("change-password-form"),m=document.getElementById("cancel-cp-btn");i&&l&&i.addEventListener("click",()=>{l.style.display="flex",s.reset()}),m&&m.addEventListener("click",()=>{l.style.display="none",s.reset()}),s&&s.addEventListener("submit",async r=>{r.preventDefault();const o=document.getElementById("cp-current").value,a=document.getElementById("cp-new").value,n=document.getElementById("cp-confirm").value,c=e.users.findIndex(p=>p.username.toLowerCase()===u.username.toLowerCase());if(c===-1){alert("Could not locate user account in the database.");return}const d=e.users[c];if(o!==d.password){alert("Current password is incorrect.");return}if(a!==n){alert("New passwords do not match. Please ensure both fields are exactly the same.");return}if(a===o){alert("New password must be different from the current password.");return}e.users[c].password=a;try{await v(),u.password=a,localStorage.setItem("alBushiraSession",JSON.stringify(u)),alert("Password updated successfully!"),l.style.display="none",s.reset()}catch(p){alert("Error saving new password to the cloud. Please try again."),console.error(p)}});const t=document.getElementById("nav-logout");t&&t.addEventListener("click",()=>{confirm("Are you sure you want to log out?")&&(localStorage.removeItem("alBushiraSession"),u=null,B())})}const k={dashboard:{title:"Dashboard",subtitle:"Overview of school performance",action:null,render:()=>{let i=e.students.length;return u.role!=="admin"&&u.assignedClass&&(i=e.students.filter(l=>l.class===u.assignedClass).length),`
        <div class="stats-grid">
          <div class="stat-card" style="border-left: 4px solid var(--primary);">
            <div class="stat-info"><h3 id="stat-students">${i}</h3><p>Total Students</p></div>
            <div class="stat-icon blue" style="margin-left: auto;"><i class="fa-solid fa-users"></i></div>
          </div>
          <div class="stat-card" style="border-left: 4px solid var(--secondary);">
            <div class="stat-info"><h3 id="stat-classes">${e.classes.length}</h3><p>Classes</p></div>
            <div class="stat-icon green" style="margin-left: auto;"><i class="fa-solid fa-chalkboard-user"></i></div>
          </div>
          <div class="stat-card" style="border-left: 4px solid var(--accent);">
            <div class="stat-info"><h3 id="stat-subjects">${e.subjects.length}</h3><p>Subjects</p></div>
            <div class="stat-icon orange" style="margin-left: auto;"><i class="fa-solid fa-book-open"></i></div>
          </div>
        </div>
        <div class="table-container">
          <h3 style="margin-bottom: 20px; font-weight: 600;">Welcome back, ${u.fullName||u.username}!</h3>
          <p style="color: var(--text-muted);">Manage students and records from the left menu.</p>
        </div>
      `}},students:{title:"Student Management",subtitle:"Manage all students registered for the term",action:'<i class="fa-solid fa-plus"></i> Add Student',render:()=>{let i=`
        <div class="table-container" style="margin-bottom: 20px;">
          <div style="display: flex; gap: 16px; align-items: flex-end;">
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Search</label>
              <input type="text" id="search-student-input" class="input-control" placeholder="Search by Name or Reg No...">
            </div>
            ${u.role==="admin"?`
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Filter by Class</label>
              <select id="filter-class-select" class="input-control">
                <option value="">All Classes</option>
                ${e.classes.map(s=>`<option value="${s}">${s}</option>`).join("")}
              </select>
            </div>
            `:""}
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
      `,l=e.students;return u.role!=="admin"&&u.assignedClass&&(l=e.students.filter(s=>s.class===u.assignedClass)),l.length===0?i+='<tr class="no-results-row"><td colspan="5" style="text-align: center; color: var(--text-muted);">No students found.</td></tr>':l.forEach(s=>{const m=e.students.findIndex(t=>t.regNo===s.regNo);i+=`
            <tr class="student-row">
              <td class="stu-col-reg">${s.regNo||"-"}</td>
              <td class="stu-col-name">${s.name}</td>
              <td class="stu-col-class">${s.class}</td>
              <td>${s.gender}</td>
              <td>
                <button class="btn btn-edit-student" data-index="${m}" style="padding: 6px 12px; font-size: 0.8rem; background: #e0f2fe; color: #0284c7; margin-right: 4px;"><i class="fa-solid fa-pen"></i></button>
                ${u.role==="admin"?`<button class="btn btn-delete-student" data-index="${m}" style="padding: 6px 12px; font-size: 0.8rem; background: #fee2e2; color: #ef4444;"><i class="fa-solid fa-trash"></i></button>`:""}
              </td>
            </tr>
          `}),i+=`
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
                    ${e.classes.map(s=>`<option value="${s}">${s}</option>`).join("")}
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
                <button type="button" class="btn" id="cancel-stu-btn" style="background: #f3f4f6; color: var(--text-main);">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      `,i}},results:{title:"Manage Results",subtitle:"Input scores for students across subject combinations",action:null,render:()=>{let i=e.classes.map(s=>`<option value="${s}">${s}</option>`).join(""),l=e.subjects.map(s=>`<option value="${s}">${s}</option>`).join("");return`
        <div class="table-container" style="margin-bottom: 20px;">
          <div style="display: flex; gap: 16px; margin-bottom: 24px;">
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Select Class</label>
              <select class="input-control" id="result-class-select">
                <option value="">-- Choose Class --</option>
                ${u.role!=="admin"&&u.assignedClass?`<option value="${u.assignedClass}" selected>${u.assignedClass}</option>`:i}
              </select>
            </div>
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Select Subject</label>
              <select class="input-control" id="result-subject-select">
                <option value="">-- Choose Subject --</option>
                ${l}
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
      `}},sheets:{title:"Print Result Sheets",subtitle:"Generate printable termly reports",action:null,render:()=>{let i=e.classes.map(l=>`<option value="${l}">${l}</option>`).join("");return`
        <div class="table-container" style="margin-bottom: 20px;">
          <div style="display: flex; gap: 16px; align-items: flex-end;">
            <div class="input-group" style="flex:1; margin-bottom: 0;">
              <label>Select Class to Generate Sheets For</label>
              <select class="input-control" id="sheet-class-select">
                <option value="">-- Choose Class --</option>
                ${u.role!=="admin"&&u.assignedClass?`<option value="${u.assignedClass}" selected>${u.assignedClass}</option>`:i}
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
      `}},settings:{title:"Settings",subtitle:"Configure application behavior",action:null,render:()=>{let i=e.classes.map(t=>`<option value="${t}">${t}</option>`).join(""),l=e.classes.map((t,r)=>`
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
          <span>${t}</span>
          <button class="btn btn-delete-class" data-index="${r}" style="padding:4px 8px; font-size:0.8rem; background:#fee2e2; color:#ef4444;"><i class="fa-solid fa-trash"></i></button>
        </div>
      `).join("");e.classes.length===0&&(l='<p style="color:var(--text-muted);">No classes configured.</p>');let s=e.subjects.map((t,r)=>`
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
          <span>${t}</span>
          <button class="btn btn-delete-subject" data-index="${r}" style="padding:4px 8px; font-size:0.8rem; background:#fee2e2; color:#ef4444;"><i class="fa-solid fa-trash"></i></button>
        </div>
      `).join("");e.subjects.length===0&&(s='<p style="color:var(--text-muted);">No subjects configured.</p>');let m="";return e.users&&e.users.length>0?m=e.users.map((t,r)=>`
          <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border);">
            <div>
               <strong>${t.fullName||t.username}</strong>
               <span style="font-size: 11px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #475569; margin-left:8px;">${t.role.toUpperCase()}</span>
               ${t.role==="user"&&t.assignedClass?`<span style="font-size: 11px; background: #dbf4ff; border: 1px solid #bae6fd; padding: 2px 6px; border-radius: 4px; color: #0369a1; margin-left:4px;"><i class="fa-solid fa-chalkboard-user"></i> ${t.assignedClass}</span>`:""}
            </div>
            ${t.username.toLowerCase()!=="admin"?`
            <div>
               <button class="btn btn-edit-user" data-index="${r}" style="padding:4px 8px; font-size:0.8rem; background:#e0f2fe; color:#0284c7; margin-right:4px;"><i class="fa-solid fa-pen"></i></button>
               <button class="btn btn-delete-user" data-index="${r}" style="padding:4px 8px; font-size:0.8rem; background:#fee2e2; color:#ef4444;"><i class="fa-solid fa-trash"></i></button>
            </div>
            `:""}
          </div>
        `).join(""):m='<p style="color:var(--text-muted);">No additional users configured.</p>',`
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
                ${l}
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
                ${s}
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
                    ${i}
                  </select>
                </div>
                <button type="submit" id="user-submit-btn" class="btn btn-primary" style="height:46px; width: 140px;">Add User</button>
                <button type="button" id="cancel-edit-btn" class="btn" style="display:none; height:46px;">Cancel</button>
              </div>
            </form>
            <div id="user-list-container">
              ${m}
            </div>
          </div>
        </div>
      `}}};function C(){const i=document.getElementById("student-modal"),l=document.getElementById("cancel-stu-btn"),s=document.getElementById("add-student-form"),m=document.getElementById("search-student-input"),t=document.getElementById("filter-class-select"),r=()=>{const o=m?m.value.toLowerCase():"",a=t?t.value:"",n=document.querySelectorAll(".student-row");let c=0;n.forEach(p=>{const g=p.querySelector(".stu-col-reg").innerText.toLowerCase(),y=p.querySelector(".stu-col-name").innerText.toLowerCase(),h=p.querySelector(".stu-col-class").innerText;(g.includes(o)||y.includes(o))&&(a===""||h===a)?(p.style.display="",c++):p.style.display="none"});const d=document.querySelector(".no-results-row");d&&(c===0&&n.length>0?d.style.display="":c>0&&(d.style.display="none"))};m&&m.addEventListener("input",r),t&&t.addEventListener("change",r),S&&j.innerText.includes("Student")&&(S.onclick=()=>{s.removeAttribute("data-edit-index"),document.querySelector("#student-modal h3").innerText="Add New Student",document.querySelector('#add-student-form button[type="submit"]').innerText="Save Student";const o=document.getElementById("stu-class");u.role!=="admin"&&u.assignedClass?(o.value=u.assignedClass,o.setAttribute("disabled","true")):o.removeAttribute("disabled"),i.style.display="flex"}),l&&(l.onclick=()=>{i.style.display="none",s.reset(),s.removeAttribute("data-edit-index")}),s&&(s.onsubmit=async o=>{o.preventDefault();const a=document.getElementById("stu-photo");let n=null;a.files&&a.files[0]&&(n=await new Promise(f=>{const b=new FileReader;b.onload=x=>f(x.target.result),b.readAsDataURL(a.files[0])}));const c=document.getElementById("stu-reg").value.trim(),d=s.getAttribute("data-edit-index"),p=e.students.findIndex(f=>f.regNo.toLowerCase()===c.toLowerCase());if(p>-1&&p.toString()!==d){alert("A student with this Registration Number already exists. Please use a unique number.");return}!n&&d!==null&&(n=e.students[d].photo);const g=document.getElementById("stu-class"),y=(g.disabled,g.value),h={regNo:c,name:document.getElementById("stu-name").value,class:y,gender:document.getElementById("stu-gender").value,photo:n};if(d!==null){const f=e.students[d].regNo;e.students[d]=h,f.toLowerCase()!==h.regNo.toLowerCase()&&e.results.forEach(b=>{b.studentId===f&&(b.studentId=h.regNo)})}else e.students.push(h);await v(),i.style.display="none",s.reset(),s.removeAttribute("data-edit-index"),w.innerHTML=k.students.render(),C()}),document.querySelectorAll(".btn-edit-student").forEach(o=>{o.onclick=a=>{const n=parseInt(a.currentTarget.getAttribute("data-index")),c=e.students[n];document.getElementById("stu-reg").value=c.regNo,document.getElementById("stu-name").value=c.name;const d=document.getElementById("stu-class");d.value=c.class,u.role!=="admin"&&u.assignedClass?d.setAttribute("disabled","true"):d.removeAttribute("disabled"),document.getElementById("stu-gender").value=c.gender,s.setAttribute("data-edit-index",n),document.querySelector("#student-modal h3").innerText="Edit Student",document.querySelector('#add-student-form button[type="submit"]').innerText="Update Student",i.style.display="flex"}}),document.querySelectorAll(".btn-delete-student").forEach(o=>{o.onclick=async a=>{const n=parseInt(a.currentTarget.getAttribute("data-index"));confirm("Are you sure you want to delete this student?")&&(e.students.splice(n,1),await v(),w.innerHTML=k.students.render(),C())}})}function T(){const i=document.getElementById("result-class-select"),l=document.getElementById("result-subject-select"),s=document.getElementById("result-entry-container");if(!i||!l||!s)return;const m=()=>{const r=i.value,o=l.value;if(!r||!o){s.innerHTML='<p style="color:var(--text-muted); text-align:center;">Select class and subject to begin entry.</p>';return}const a=e.students.filter(d=>d.class===r);if(a.length===0){s.innerHTML='<p style="color:var(--text-muted); text-align:center;">No students found in this class.</p>';return}let n=`
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
    `;a.forEach(d=>{const p=e.results.find(g=>g.studentId===d.regNo&&g.subject===o&&g.class===r)||{};n+=`
        <tr class="result-entry-row">
          <td><strong class="re-student-name">${d.name}</strong><br><small class="re-student-reg" style="color:var(--text-muted);">${d.regNo}</small></td>
          <td><input type="number" max="15" min="0" class="input-control ca1-input" data-reg="${d.regNo}" value="${p.ca1!==void 0?p.ca1:""}" style="width: 70px;" required></td>
          <td><input type="number" max="15" min="0" class="input-control ca2-input" data-reg="${d.regNo}" value="${p.ca2!==void 0?p.ca2:""}" style="width: 70px;" required></td>
          <td><input type="number" max="10" min="0" class="input-control assignment-input" data-reg="${d.regNo}" value="${p.assignment!==void 0?p.assignment:""}" style="width: 70px;" required></td>
          <td><input type="number" max="60" min="0" class="input-control exam-input" data-reg="${d.regNo}" value="${p.exam!==void 0?p.exam:""}" style="width: 80px;" required></td>
          <td><span class="total-display" id="total-${d.regNo}">${p.total||0}</span></td>
        </tr>
      `}),n+=`
          </tbody>
        </table>
        <div style="margin-top: 24px; text-align: right;">
          <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> Save Results</button>
        </div>
      </form>
    `,s.innerHTML=n;const c=document.getElementById("save-results-form");document.querySelectorAll('.input-control[type="number"]').forEach(d=>{d.addEventListener("input",p=>{const g=p.target.closest("tr"),y=parseInt(g.querySelector(".ca1-input").value)||0,h=parseInt(g.querySelector(".ca2-input").value)||0,f=parseInt(g.querySelector(".assignment-input").value)||0,b=parseInt(g.querySelector(".exam-input").value)||0;g.querySelector(".total-display").innerText=y+h+f+b})}),c.onsubmit=async d=>{d.preventDefault(),a.forEach(p=>{const g=document.querySelector(`input[data-reg="${p.regNo}"]`).closest("tr"),y=parseInt(g.querySelector(".ca1-input").value)||0,h=parseInt(g.querySelector(".ca2-input").value)||0,f=parseInt(g.querySelector(".assignment-input").value)||0,b=parseInt(g.querySelector(".exam-input").value)||0,x=y+h+f+b;let I="F",E="Fail";x>=70?(I="A",E="Excellent"):x>=60?(I="B",E="Very Good"):x>=50?(I="C",E="Good"):x>=40&&(I="D",E="Pass");const N=e.results.findIndex(A=>A.studentId===p.regNo&&A.subject===o&&A.class===r),q={studentId:p.regNo,class:r,subject:o,ca1:y,ca2:h,assignment:f,exam:b,total:x,grade:I,remark:E};N>-1?e.results[N]=q:e.results.push(q)}),await v(),alert("Results saved successfully!")}};i.addEventListener("change",m),l.addEventListener("change",m);const t=document.getElementById("result-search-input");t&&t.addEventListener("input",()=>{const r=t.value.toLowerCase();document.querySelectorAll(".result-entry-row").forEach(a=>{const n=a.querySelector(".re-student-name").innerText.toLowerCase(),c=a.querySelector(".re-student-reg").innerText.toLowerCase();n.includes(r)||c.includes(r)?a.style.display="":a.style.display="none"})})}function D(){const i=document.getElementById("add-class-form"),l=document.getElementById("add-subject-form"),s=document.getElementById("add-user-form");i&&(i.onsubmit=async o=>{o.preventDefault();const a=document.getElementById("new-class-input").value.trim();a&&!e.classes.includes(a)?(e.classes.push(a),await v(),document.querySelector('[data-page="settings"]').click()):e.classes.includes(a)&&alert("Class already exists!")}),l&&(l.onsubmit=async o=>{o.preventDefault();const a=document.getElementById("new-subject-input").value.trim();a&&!e.subjects.includes(a)?(e.subjects.push(a),await v(),document.querySelector('[data-page="settings"]').click()):e.subjects.includes(a)&&alert("Subject already exists!")}),document.querySelectorAll(".btn-delete-class").forEach(o=>{o.onclick=async a=>{const n=a.currentTarget.getAttribute("data-index");confirm("Are you sure you want to remove this class?")&&(e.classes.splice(n,1),await v(),document.querySelector('[data-page="settings"]').click())}}),document.querySelectorAll(".btn-delete-subject").forEach(o=>{o.onclick=async a=>{const n=a.currentTarget.getAttribute("data-index");confirm("Are you sure you want to remove this subject?")&&(e.subjects.splice(n,1),await v(),document.querySelector('[data-page="settings"]').click())}}),document.querySelectorAll(".btn-edit-user").forEach(o=>{o.onclick=a=>{const n=a.currentTarget.getAttribute("data-index"),c=e.users[n];document.getElementById("new-user-fullname").value=c.fullName||"",document.getElementById("new-user-username").value=c.username,document.getElementById("new-user-username").setAttribute("readonly","true"),document.getElementById("new-user-username").style.backgroundColor="#f1f5f9",document.getElementById("new-user-password").value=c.password,document.getElementById("new-user-role").value=c.role,document.getElementById("new-user-assigned-class").value=c.assignedClass||"";const d=document.getElementById("user-submit-btn");d.innerHTML="Update User",d.style.backgroundColor="#0ea5e9",document.getElementById("cancel-edit-btn").style.display="inline-block",document.getElementById("add-user-form").scrollIntoView({behavior:"smooth"})}});const m=document.getElementById("cancel-edit-btn");m&&(m.onclick=()=>{document.querySelector('[data-page="settings"]').click()}),s&&(s.onsubmit=async o=>{o.preventDefault();const a=document.getElementById("new-user-username").value.trim(),n=document.getElementById("new-user-password").value,c=document.getElementById("new-user-role").value,d=document.getElementById("new-user-fullname").value.trim(),p=document.getElementById("new-user-assigned-class").value;if(c==="user"&&!p){alert("You must assign a class when creating a Teacher (User) account.");return}e.users||(e.users=[]);const g=document.getElementById("new-user-username").hasAttribute("readonly"),y=e.users.findIndex(h=>h.username.toLowerCase()===a.toLowerCase());if(!g&&y>-1){alert("A user with that username already exists.");return}g&&y>-1?e.users[y]={username:a,password:n,role:c,fullName:d,assignedClass:p}:e.users.push({username:a,password:n,role:c,fullName:d,assignedClass:p}),await v(),document.querySelector('[data-page="settings"]').click()});const t=document.getElementById("new-user-role"),r=document.getElementById("new-user-assigned-class");t&&r&&(t.addEventListener("change",o=>{o.target.value==="user"?r.setAttribute("required","true"):r.removeAttribute("required")}),t.value==="user"&&r.setAttribute("required","true")),document.querySelectorAll(".btn-delete-user").forEach(o=>{o.onclick=async a=>{const n=a.currentTarget.getAttribute("data-index");confirm("Are you sure you want to remove this user? They will no longer be able to log in.")&&(e.users.splice(n,1),await v(),document.querySelector('[data-page="settings"]').click())}})}function P(){const i=document.getElementById("btn-generate-sheets"),l=document.getElementById("sheet-class-select"),s=document.getElementById("sheets-preview-container");!i||!l||!s||(i.onclick=()=>{const m=l.value;if(!m){alert("Please select a class first.");return}const t=e.students.filter(n=>n.class===m);if(t.length===0){s.innerHTML='<div class="table-container"><p style="text-align:center;">No students in this class.</p></div>';return}let r="";const o=[];t.forEach(n=>{const c=e.results.filter(g=>g.studentId===n.regNo&&g.class===m);let d=0;c.forEach(g=>d+=g.total);const p=c.length>0?d/c.length:0;o.push({regNo:n.regNo,avg:p})}),o.sort((n,c)=>c.avg-n.avg);let a=1;for(let n=0;n<o.length;n++)n>0&&o[n].avg<o[n-1].avg&&(a=n+1),o[n].rank=a;r+=`
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
          background-image: url('/logo.png');
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
    `,t.forEach(n=>{const c=e.results.filter(f=>f.studentId===n.regNo&&f.class===m);let d=0,p="";e.subjects.forEach(f=>{const b=c.find(x=>x.subject===f);b?(d+=b.total,p+=`
            <tr>
              <td class="sub-name">${f}</td>
              <td>${b.ca1||0}</td>
              <td>${b.ca2||0}</td>
              <td>${b.assignment||0}</td>
              <td>${b.exam||0}</td>
              <td><strong>${b.total||0}</strong></td>
              <td>${b.grade||"-"}</td>
              <td>${b.remark||"-"}</td>
            </tr>
          `):p+=`
            <tr>
              <td class="sub-name">${f}</td>
              <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
            </tr>
          `});const g=c.length>0?(d/c.length).toFixed(2):0,y=o.find(f=>f.regNo===n.regNo);let h="-";if(y&&g>0){let f=y.rank,b="th";f%10===1&&f%100!==11?b="st":f%10===2&&f%100!==12?b="nd":f%10===3&&f%100!==13&&(b="rd"),h=f+b}r+=`
        <div class="result-sheet">
          <div class="sheet-content-wrapper">
            <div class="sheet-header">
              <img src="/logo.png" alt="School Logo" class="school-logo">
              <h1>Al-Bushira Nursery and Primary School, Takum</h1>
              <p>Off Anguwan Abuja Takum, Taraba State</p>
              <div class="sheet-title">Termly Continuous Assessment Dossier</div>
            </div>
            
            <div class="student-header">
              ${n.photo?`<img src="${n.photo}" class="student-photo" alt="Passport">`:'<div class="student-photo">No Photo</div>'}
              <div class="student-info">
                <div>
                  <p>Student Name</p><strong>${n.name}</strong>
                  <br>
                  <p>Registration No</p><strong>${n.regNo||"N/A"}</strong>
                </div>
                <div>
                  <p>Class</p><strong>${n.class}</strong>
                  <br>
                  <p>Gender</p><strong>${n.gender}</strong>
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
                ${p}
              </tbody>
            </table>
            
            <div class="summary-box">
              <div><strong>Total Marks</strong> <span>${d}</span></div>
              <div><strong>Average</strong> <span>${g}%</span></div>
              <div><strong>Subjects</strong> <span>${c.length}</span></div>
              <div><strong>Position</strong> <span style="color:#2563eb;">${h}</span></div>
              <div><strong>No. in Class</strong> <span>${t.length}</span></div>
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
      `}),s.innerHTML=r})}let e={students:[],classes:[],subjects:[],results:[],users:[{username:"admin",password:"password",role:"admin"},{username:"teacher",password:"password",role:"user"}]};async function v(){if(window.electronAPI)await window.electronAPI.saveData(e);else try{localStorage.setItem("alBushiraData",JSON.stringify(e)),fetch("https://al-bushira.frappe.cloud/api/resource/Al%20Bushira%20Data/3dbf69ao4d",{method:"PUT",headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"token 25472a0b63167c1:0b5cf06b3f8a8e5"},body:JSON.stringify({data_json:JSON.stringify(e)})}).catch(i=>console.error("Silent Cloud DB Sync Error:",i))}catch(i){console.error("Failed to save to localStorage:",i)}}async function z(){if(window.electronAPI)try{e=await window.electronAPI.getData(),console.log("Data loaded from DB",e)}catch(i){console.error("Error loading data",i)}else{console.log("Fetching live school data from active Zero-Config Cloud Database...");try{const i=new AbortController,l=setTimeout(()=>i.abort(),6e3),s=await fetch("https://al-bushira.frappe.cloud/api/resource/Al%20Bushira%20Data/3dbf69ao4d",{headers:{Accept:"application/json",Authorization:"token 25472a0b63167c1:0b5cf06b3f8a8e5"},signal:i.signal});if(clearTimeout(l),s.ok){const m=await s.json();let t={};try{t=JSON.parse(m.data.data_json)}catch{}e={...e,...t},e.students=e.students||[],e.classes=e.classes||[],e.subjects=e.subjects||[],e.results=e.results||[],e.users||(e.users=[{username:"admin",password:"password",role:"admin"},{username:"teacher",password:"password",role:"user"}]),console.log("Successfully synced with Zero-Config Cloud Database.")}else throw new Error("Cloud Server Rejected Read Request")}catch(i){console.warn("Cloud Sync failed, reverting to Offline Local Storage.",i);const l=localStorage.getItem("alBushiraData");l&&(e={...e,...JSON.parse(l)},e.students=e.students||[],e.classes=e.classes||[],e.subjects=e.subjects||[],e.results=e.results||[],e.users||(e.users=[{username:"admin",password:"password",role:"admin"},{username:"teacher",password:"password",role:"user"}]))}}}window.downloadAllPDFs=async function(){if(typeof html2pdf>"u")return alert("PDF Library is still loading or failed to load. Ensure you have an internet connection.");const i=document.getElementById("sheets-preview-container");if(!i||document.querySelectorAll(".result-sheet").length===0)return alert("No sheets to download.");const l=document.getElementById("sheet-actions-bar");l&&(l.style.display="none");const s={margin:0,filename:"Students_Result_Sheets.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},pagebreak:{mode:"css",avoid:"tr"}};try{await html2pdf().set(s).from(i).save()}catch(m){console.error("PDF Generation failed",m),alert("Failed to generate PDF. Make sure you are online to load the PDF library.")}l&&(l.style.display="flex")};function R(){window.electronAPI||setInterval(async()=>{try{if(!u)return;const i=new AbortController,l=setTimeout(()=>i.abort(),6e3),s=await fetch("https://al-bushira.frappe.cloud/api/resource/Al%20Bushira%20Data/3dbf69ao4d",{headers:{Accept:"application/json",Authorization:"token 25472a0b63167c1:0b5cf06b3f8a8e5"},signal:i.signal});if(clearTimeout(l),s.ok){const m=await s.json();let t={};try{t=JSON.parse(m.data.data_json)}catch{}if(JSON.stringify(e)!==JSON.stringify(t)){e={...e,...t},e.students=e.students||[],e.classes=e.classes||[],e.subjects=e.subjects||[],e.results=e.results||[];const o=document.querySelector(".nav-item.active");if(o){const a=o.getAttribute("data-page"),n=k[a];if(n&&w){const c=w.scrollTop;w.innerHTML=n.render(),w.scrollTop=c,a==="students"&&C(),a==="results"&&T(),a==="sheets"&&P(),a==="settings"&&u.role==="admin"&&D()}}}}}catch{}},1e4)}z().then(()=>{const i=localStorage.getItem("alBushiraSession");if(i)try{u=JSON.parse(i),L()}catch{B()}else B();R()});
