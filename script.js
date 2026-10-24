let currentMode = 'login';
    let currentUser = null;

    // Sample Document Store
    let documents = [
      {
        id: 'doc-101',
        title: 'Master_Service_Agreement_v3.pdf',
        category: 'Legal Contract',
        size: '2.4 MB',
        date: '2026-10-20',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        access: 'Restricted'
      },
      {
        id: 'doc-102',
        title: 'Q3_Financial_Statement_Audit.xlsx',
        category: 'Financial',
        size: '1.8 MB',
        date: '2026-10-22',
        hash: '8f4e3c2a10d9f8e7b6a5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3',
        access: 'Shared Team'
      },
      {
        id: 'doc-103',
        title: 'Cybersecurity_Architecture_Blueprint.pdf',
        category: 'Confidential',
        size: '5.1 MB',
        date: '2026-10-24',
        hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        access: 'Owner Only'
      }
    ];

    let auditLogs = [
      { time: 'Just now', text: 'System initialized TrustVault Zero-Trust ledger.', user: 'System' },
      { time: '10 mins ago', text: 'Document SHA-256 hash verified for doc-101.', user: 'Audit Engine' },
      { time: '1 hour ago', text: 'User admin_user logged in via OAuth2.', user: 'Security Bot' }
    ];

    // Toggle tab between "Log in" and "Create account"
    function switchTab(mode) {
      currentMode = mode;
      const tabLogin = document.getElementById('tabLogin');
      const tabRegister = document.getElementById('tabRegister');
      const authHeading = document.getElementById('authHeading');
      const authSubheading = document.getElementById('authSubheading');
      const submitBtn = document.getElementById('submitBtn');
      const fullNameGroup = document.getElementById('fullNameGroup');
      const alertBox = document.getElementById('authAlert');

      alertBox.classList.add('hidden');

      if (mode === 'login') {
        tabLogin.className = 'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm bg-brand-500 text-white';
        tabRegister.className = 'flex-1 py-2.5 text-sm font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition-all';
        authHeading.innerText = 'Welcome to TrustVault.';
        authSubheading.innerText = 'Manage your documents and control who can access them.';
        submitBtn.innerText = 'Log in';
        fullNameGroup.classList.add('hidden');
      } else {
        tabRegister.className = 'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm bg-brand-500 text-white';
        tabLogin.className = 'flex-1 py-2.5 text-sm font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition-all';
        authHeading.innerText = 'Create your account';
        authSubheading.innerText = 'Start securing and managing your private document vault.';
        submitBtn.innerText = 'Create account';
        fullNameGroup.classList.remove('hidden');
      }
    }

    // Fill sample demo details
    function fillDemo(username, name) {
      document.getElementById('usernameInput').value = username;
      document.getElementById('fullNameInput').value = name;
      document.getElementById('passwordInput').value = 'password123';
    }

    // Handle Authentication Submit
    function handleAuth(e) {
      e.preventDefault();
      const username = document.getElementById('usernameInput').value.trim();
      const alertBox = document.getElementById('authAlert');

      if (!username) {
        showAlert('Please enter a valid username.', 'bg-red-50 text-red-600 border border-red-200');
        return;
      }

      currentUser = { username: username, name: username.split('_')[0] || 'User' };

      // Log activity
      addAuditLog(`User '${username}' logged in successfully.`, username);

      // Transition UI to Dashboard
      document.getElementById('authView').classList.add('hidden');
      document.getElementById('dashboardView').classList.remove('hidden');
      document.getElementById('headerUserNav').classList.remove('hidden');
      document.getElementById('headerUserNav').classList.add('flex');
      document.getElementById('usernameDisplay').innerText = `@${username}`;

      renderDocuments();
      renderAuditLogs();
    }

    function logout() {
      currentUser = null;
      document.getElementById('authView').classList.remove('hidden');
      document.getElementById('dashboardView').classList.add('hidden');
      document.getElementById('headerUserNav').classList.add('hidden');
      document.getElementById('headerUserNav').classList.remove('flex');
    }

    function showAlert(msg, classes) {
      const alertBox = document.getElementById('authAlert');
      alertBox.className = `p-3 rounded-xl text-xs font-medium ${classes}`;
      alertBox.innerText = msg;
      alertBox.classList.remove('hidden');
    }

    // Render Vault Documents
    function renderDocuments() {
      const list = document.getElementById('documentList');
      document.getElementById('docCount').innerText = `${documents.length} Files`;
      
      list.innerHTML = documents.map(doc => `
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg shrink-0">
              <i class="fa-solid fa-file-shield"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm leading-tight">${doc.title}</h4>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span class="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">${doc.category}</span>
                <span class="text-[11px] text-slate-400">• ${doc.size}</span>
                <span class="text-[11px] text-slate-400">• Created ${doc.date}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-0 pt-2 sm:pt-0 border-slate-100">
            <button onclick="verifyHash('${doc.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
              <i class="fa-solid fa-fingerprint"></i> Verify Hash
            </button>
            <button onclick="deleteDoc('${doc.id}')" class="p-2 text-slate-400 hover:text-red-500 rounded-xl transition">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `).join('');
    }

    function verifyHash(id) {
      const doc = documents.find(d => d.id === id);
      if (doc) {
        alert(`SHA-256 Ledger Verification:\n\nDocument: ${doc.title}\nHash: ${doc.hash}\nStatus: VERIFIED SAFE & UNTAMPERED`);
        addAuditLog(`Cryptographic audit passed for ${doc.title}`, currentUser ? currentUser.username : 'System');
        renderAuditLogs();
      }
    }

    function deleteDoc(id) {
      const doc = documents.find(d => d.id === id);
      documents = documents.filter(d => d.id !== id);
      if (doc) {
        addAuditLog(`Removed document: ${doc.title}`, currentUser ? currentUser.username : 'User');
      }
      renderDocuments();
      renderAuditLogs();
    }

    // Modal controls
    function openUploadModal() {
      document.getElementById('uploadModal').classList.remove('hidden');
      document.getElementById('uploadModal').classList.add('flex');
    }

    function closeUploadModal() {
      document.getElementById('uploadModal').classList.add('hidden');
      document.getElementById('uploadModal').classList.remove('flex');
    }

    function handleUpload(e) {
      e.preventDefault();
      const title = document.getElementById('docTitle').value.trim();
      const category = document.getElementById('docCategory').value;
      const access = document.getElementById('docAccess').value;

      if (!title) return;

      const newDoc = {
        id: 'doc-' + Date.now().toString().slice(-4),
        title: title,
        category: category,
        size: (Math.random() * 4 + 0.5).toFixed(1) + ' MB',
        date: new Date().toISOString().split('T')[0],
        hash: Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        access: access
      };

      documents.unshift(newDoc);
      addAuditLog(`Uploaded new vault document '${title}' [${category}]`, currentUser ? currentUser.username : 'User');
      
      closeUploadModal();
      document.getElementById('docTitle').value = '';
      renderDocuments();
      renderAuditLogs();
    }

    function addAuditLog(text, user) {
      auditLogs.unshift({
        time: 'Just now',
        text: text,
        user: user || 'System'
      });
    }

    function renderAuditLogs() {
      const container = document.getElementById('auditLog');
      container.innerHTML = auditLogs.map(log => `
        <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start">
          <div>
            <p class="font-medium text-slate-800 leading-snug">${log.text}</p>
            <span class="text-[10px] text-slate-400 font-semibold">User: @${log.user}</span>
          </div>
          <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">${log.time}</span>
        </div>
      `).join('');
    }
