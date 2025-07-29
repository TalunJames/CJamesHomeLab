// Global state management
let currentUser = null;
let currentPage = 'landing';
let users = [];
let accessCodes = [];

// Sample data for demonstration
const sampleUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        accessCode: 'MOVIES2024',
        permissions: ['plex', 'immich', 'mealie'],
        joinDate: '2024-01-15',
        billing: 'active'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        accessCode: 'PHOTOS2024',
        permissions: ['immich', 'mealie'],
        joinDate: '2024-01-20',
        billing: 'active'
    }
];

const adminCode = 'ADMIN2024';

// Local Storage Keys
const STORAGE_KEYS = {
    users: 'homelabHub_users',
    accessCodes: 'homelabHub_accessCodes',
    dataVersion: 'homelabHub_dataVersion'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    setupEventListeners();
});

function loadSampleData() {
    // Check if we have saved data in localStorage
    const savedUsers = localStorage.getItem(STORAGE_KEYS.users);
    const savedAccessCodes = localStorage.getItem(STORAGE_KEYS.accessCodes);
    
    if (savedUsers && savedAccessCodes) {
        // Load from localStorage
        try {
            users = JSON.parse(savedUsers);
            accessCodes = JSON.parse(savedAccessCodes);
            console.log('Loaded data from localStorage:', { userCount: users.length, codeCount: accessCodes.length });
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            // Fall back to sample data
            loadDefaultSampleData();
        }
    } else {
        // First time - load sample data and save to localStorage
        loadDefaultSampleData();
        saveDataToStorage();
    }
}

function loadDefaultSampleData() {
    users = [...sampleUsers];
    accessCodes = users.map(user => ({
        code: user.accessCode,
        userId: user.id,
        permissions: user.permissions
    }));
}

// Save data to localStorage
function saveDataToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
        localStorage.setItem(STORAGE_KEYS.accessCodes, JSON.stringify(accessCodes));
        localStorage.setItem(STORAGE_KEYS.dataVersion, '1.0');
        console.log('Data saved to localStorage successfully');
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        // Show user-friendly error
        showErrorMessage('Unable to save data. Your changes may not persist.');
    }
}

// Clear all saved data (for reset functionality)
function clearSavedData() {
    localStorage.removeItem(STORAGE_KEYS.users);
    localStorage.removeItem(STORAGE_KEYS.accessCodes);
    localStorage.removeItem(STORAGE_KEYS.dataVersion);
    console.log('Saved data cleared from localStorage');
}

// Reset all data to sample data
function resetAllData() {
    if (confirm('Are you sure you want to reset ALL data? This will delete all created users and access codes and return to the sample data only. This action cannot be undone.')) {
        // Clear localStorage
        clearSavedData();
        
        // Reload sample data
        loadDefaultSampleData();
        
        // Save the sample data to localStorage
        saveDataToStorage();
        
        // Refresh the admin panel
        showAdminPanel();
        
        // Show success message
        showSuccessMessage('All data has been reset to sample data');
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Modal click outside to close
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Modal functions
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
    closeModal('signupModal');
}

function showSignup() {
    document.getElementById('signupModal').style.display = 'block';
    closeModal('loginModal');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Authentication functions
function handleLogin(event) {
    event.preventDefault();
    const accessCode = document.getElementById('accessCode').value;
    
    if (accessCode === adminCode) {
        currentUser = { type: 'admin', name: 'Administrator' };
        showAdminPanel();
    } else {
        const userAccess = accessCodes.find(ac => ac.code === accessCode);
        if (userAccess) {
            const user = users.find(u => u.id === userAccess.userId);
            currentUser = { ...user, type: 'user' };
            showUserDashboard();
        } else {
            alert('Invalid access code. Please try again.');
            return;
        }
    }
    
    closeModal('loginModal');
}

function handleSignup(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        reason: document.getElementById('reason').value
    };
    
    // In a real app, this would send data to a server
    alert(`Thank you ${formData.name}! Your access request has been submitted. You'll receive an email when approved.`);
    closeModal('signupModal');
    
    // Reset form
    document.getElementById('signupForm').reset();
}

// Dashboard functions
function showUserDashboard() {
    document.body.innerHTML = createUserDashboard();
    currentPage = 'dashboard';
    updateMemory(currentUser, 'user');
}

function showAdminPanel() {
    document.body.innerHTML = createAdminPanel();
    currentPage = 'admin';
    setupAdminEventListeners();
    updateMemory(currentUser, 'admin');
}

function createUserDashboard() {
    const user = currentUser;
    const services = getAvailableServices(user.permissions);
    
    return `
        <div class="dashboard active">
            <div class="dashboard-header">
                <div class="container">
                    <div class="dashboard-nav">
                        <div class="dashboard-title">
                            <i class="fas fa-tachometer-alt"></i>
                            Welcome, ${user.name}
                        </div>
                        <button class="logout-btn" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                    <p>Access Code: <strong>${user.accessCode}</strong> • Member since ${formatDate(user.joinDate)}</p>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="container">
                    <div class="dashboard-grid">
                        ${services.map(service => createServiceCard(service)).join('')}
                    </div>
                    
                    <div class="dashboard-card">
                        <h3><i class="fas fa-headset"></i> Support & Requests</h3>
                        <div class="quick-actions">
                            <button class="action-btn" onclick="showRequestModal('movie')">
                                <i class="fas fa-film"></i>
                                <div>
                                    <strong>Request Movie/TV Show</strong>
                                    <small>Add content to Plex library</small>
                                </div>
                            </button>
                            <button class="action-btn" onclick="showIssueModal('plex')">
                                <i class="fas fa-exclamation-triangle"></i>
                                <div>
                                    <strong>Report Plex Issue</strong>
                                    <small>Streaming or playback problems</small>
                                </div>
                            </button>
                            ${user.permissions.includes('immich') ? `
                            <button class="action-btn" onclick="showIssueModal('immich')">
                                <i class="fas fa-camera"></i>
                                <div>
                                    <strong>Report Immich Issue</strong>
                                    <small>Photo backup or sync problems</small>
                                </div>
                            </button>` : ''}
                            ${user.permissions.includes('mealie') ? `
                            <button class="action-btn" onclick="showIssueModal('mealie')">
                                <i class="fas fa-utensils"></i>
                                <div>
                                    <strong>Report Mealie Issue</strong>
                                    <small>Recipe or meal planning problems</small>
                                </div>
                            </button>` : ''}
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <h3><i class="fas fa-credit-card"></i> Billing Information</h3>
                        <p>Your subscription: <strong>$15/month</strong></p>
                        <p>Status: <span style="color: #27ae60; font-weight: bold;">Active</span></p>
                        <p>Next billing: ${getNextBillingDate()}</p>
                        <p style="margin-top: 1rem; font-size: 0.9rem; color: #7f8c8d;">
                            This replaces Netflix ($17), HBO Max ($16), Google Photos ($10), and more - 
                            saving you over $40/month while giving you complete privacy and control!
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        ${createRequestModal()}
        ${createIssueModal()}
    `;
}

function createAdminPanel() {
    return `
        <div class="admin-panel active">
            <div class="admin-header">
                <div class="container">
                    <div class="dashboard-nav">
                        <div class="dashboard-title">
                            <i class="fas fa-shield-alt"></i>
                            Admin Panel
                        </div>
                        <button class="logout-btn" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                    <p>Manage users, access codes, and system settings</p>
                </div>
            </div>
            
            <div class="admin-content">
                <div class="container">
                    <div class="admin-tabs">
                        <button class="admin-tab active" onclick="showAdminTab('users')">Users</button>
                        <button class="admin-tab" onclick="showAdminTab('codes')">Access Codes</button>
                        <button class="admin-tab" onclick="showAdminTab('tailscale')">Tailscale</button>
                        <button class="admin-tab" onclick="showAdminTab('billing')">Billing</button>
                    </div>
                    
                    <div id="users-section" class="admin-section active">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                            <h2>User Management</h2>
                            <button class="btn btn-primary" onclick="showCreateUserModal()">
                                <i class="fas fa-plus"></i> Add User
                            </button>
                        </div>
                        <div class="user-list">
                            ${users.map(user => createUserItem(user)).join('')}
                        </div>
                    </div>
                    
                    <div id="codes-section" class="admin-section">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                            <h2>Access Codes</h2>
                            <button class="btn btn-primary" onclick="generateAccessCode()">
                                <i class="fas fa-key"></i> Generate Code
                            </button>
                        </div>
                        <div class="user-list">
                            ${accessCodes.map(code => createCodeItem(code)).join('')}
                        </div>
                    </div>
                    
                    <div id="tailscale-section" class="admin-section">
                        <h2>Tailscale Onboarding</h2>
                        <div class="dashboard-card">
                            <h3><i class="fas fa-network-wired"></i> Generate Onboarding Package</h3>
                            <p>Create a personalized setup package for new users</p>
                            <div style="margin: 1rem 0;">
                                <select id="tailscaleUser" style="padding: 0.5rem; margin-right: 1rem; border-radius: 4px; border: 1px solid #ddd;">
                                    <option value="">Select User</option>
                                    ${users.map(user => `<option value="${user.id}">${user.name}</option>`).join('')}
                                </select>
                                <button class="btn btn-primary" onclick="generateTailscalePackage()">
                                    <i class="fas fa-download"></i> Generate Package
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="billing-section" class="admin-section">
                        <h2>Billing Overview</h2>
                        <div class="dashboard-grid">
                            <div class="dashboard-card">
                                <h3><i class="fas fa-dollar-sign"></i> Revenue</h3>
                                <p style="font-size: 2rem; color: #27ae60; font-weight: bold;">$${users.length * 15}/month</p>
                                <p>${users.length} active subscribers</p>
                            </div>
                            <div class="dashboard-card">
                                <h3><i class="fas fa-chart-line"></i> Growth</h3>
                                <p>Replacement value: <strong>$${users.length * 54}/month</strong></p>
                                <p>Customer savings: <strong>$${users.length * 39}/month</strong></p>
                            </div>
                            <div class="dashboard-card">
                                <h3><i class="fas fa-database"></i> Data Management</h3>
                                <p>All user data is automatically saved to your browser's local storage.</p>
                                <button class="btn btn-danger" onclick="resetAllData()" style="margin-top: 1rem;">
                                    <i class="fas fa-trash"></i> Reset All Data
                                </button>
                                <p style="font-size: 0.9rem; color: #7f8c8d; margin-top: 0.5rem;">
                                    This will delete all users and access codes, returning to sample data only.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        ${createUserModal()}
    `;
}

// Helper functions
function getAvailableServices(permissions) {
    const allServices = [
        {
            id: 'plex',
            name: 'Plex Media Server',
            icon: 'fas fa-play-circle',
            description: 'Stream movies and TV shows',
            url: '#'
        },
        {
            id: 'immich',
            name: 'Immich Photos',
            icon: 'fas fa-camera',
            description: 'Backup and organize photos',
            url: '#'
        },
        {
            id: 'mealie',
            name: 'Mealie Recipes',
            icon: 'fas fa-utensils',
            description: 'Manage recipes and meal plans',
            url: '#'
        }
    ];
    
    return allServices.filter(service => permissions.includes(service.id));
}

function createServiceCard(service) {
    return `
        <div class="dashboard-card">
            <h3><i class="${service.icon}"></i> ${service.name}</h3>
            <p>${service.description}</p>
            <a href="${service.url}" class="btn btn-primary" style="margin-top: 1rem;">
                <i class="fas fa-external-link-alt"></i> Open Service
            </a>
        </div>
    `;
}

function createUserItem(user) {
    return `
        <div class="user-item">
            <div class="user-info">
                <h4>${user.name}</h4>
                <p>${user.email} • Access: ${user.accessCode} • Permissions: ${user.permissions.join(', ')}</p>
            </div>
            <div class="user-actions">
                <button class="btn btn-small btn-primary" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-small btn-success" onclick="generateUserPage(${user.id})">Generate Page</button>
                <button class="btn btn-small btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        </div>
    `;
}

function createCodeItem(code) {
    const user = users.find(u => u.id === code.userId);
    return `
        <div class="user-item">
            <div class="user-info">
                <h4>${code.code}</h4>
                <p>User: ${user ? user.name : 'Unassigned'} • Permissions: ${code.permissions.join(', ')}</p>
            </div>
            <div class="user-actions">
                <button class="btn btn-small btn-danger" onclick="revokeCode('${code.code}')">Revoke</button>
            </div>
        </div>
    `;
}

function createRequestModal() {
    return `
        <div id="requestModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('requestModal')">&times;</span>
                <h2>Request Content</h2>
                <form id="requestForm">
                    <div class="form-group">
                        <label for="contentType">Content Type</label>
                        <select id="contentType" required>
                            <option value="movie">Movie</option>
                            <option value="tv">TV Show</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contentTitle">Title</label>
                        <input type="text" id="contentTitle" required placeholder="Enter movie or TV show title">
                    </div>
                    <div class="form-group">
                        <label for="contentYear">Year (optional)</label>
                        <input type="number" id="contentYear" placeholder="Release year">
                    </div>
                    <div class="form-group">
                        <label for="contentNotes">Additional Notes</label>
                        <textarea id="contentNotes" rows="3" placeholder="Any specific requests or information..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Submit Request</button>
                </form>
            </div>
        </div>
    `;
}

function createIssueModal() {
    return `
        <div id="issueModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('issueModal')">&times;</span>
                <h2>Report Issue</h2>
                <form id="issueForm">
                    <div class="form-group">
                        <label for="issueService">Service</label>
                        <select id="issueService" required>
                            <option value="plex">Plex</option>
                            <option value="immich">Immich</option>
                            <option value="mealie">Mealie</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="issueTitle">Issue Title</label>
                        <input type="text" id="issueTitle" required placeholder="Brief description of the issue">
                    </div>
                    <div class="form-group">
                        <label for="issueDescription">Description</label>
                        <textarea id="issueDescription" rows="4" required placeholder="Detailed description of the problem..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="issuePriority">Priority</label>
                        <select id="issuePriority" required>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Submit Issue</button>
                </form>
            </div>
        </div>
    `;
}

function createUserModal() {
    return `
        <div id="userModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('userModal')">&times;</span>
                <h2 id="userModalTitle">Create User</h2>
                <form id="userForm">
                    <div class="form-group">
                        <label for="userName">Full Name</label>
                        <input type="text" id="userName" required>
                    </div>
                    <div class="form-group">
                        <label for="userEmail">Email</label>
                        <input type="email" id="userEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="userPermissions">Permissions</label>
                        <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="checkbox" id="permPlex" value="plex" checked> Plex
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="checkbox" id="permImmich" value="immich"> Immich
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="checkbox" id="permMealie" value="mealie"> Mealie
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Save User</button>
                </form>
            </div>
        </div>
    `;
}

// Admin functions
function showAdminTab(tabName) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding section
    event.target.classList.add('active');
    document.getElementById(`${tabName}-section`).classList.add('active');
}

function setupAdminEventListeners() {
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }
}

function showCreateUserModal() {
    document.getElementById('userModalTitle').textContent = 'Create User';
    document.getElementById('userForm').reset();
    window.editingUserId = null; // Clear editing state
    document.getElementById('userModal').style.display = 'block';
}

function handleUserSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        permissions: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
    };
    
    if (window.editingUserId) {
        // Edit existing user
        const userIndex = users.findIndex(u => u.id === window.editingUserId);
        if (userIndex !== -1) {
            const oldUser = users[userIndex];
            users[userIndex] = {
                ...oldUser,
                ...formData
            };
            
            // Update access code permissions
            const codeIndex = accessCodes.findIndex(ac => ac.userId === window.editingUserId);
            if (codeIndex !== -1) {
                accessCodes[codeIndex].permissions = formData.permissions;
            }
            
            closeModal('userModal');
            
            // Save to localStorage
            saveDataToStorage();
            
            // Update both users and codes sections
            refreshUsersSection();
            refreshCodesSection();
            
            // Show success message
            showSuccessMessage(`User ${formData.name} updated successfully!`);
        }
        
        // Clear editing state
        window.editingUserId = null;
    } else {
        // Create new user
        const accessCode = generateRandomCode();
        const newUser = {
            id: users.length + 1,
            ...formData,
            accessCode,
            joinDate: new Date().toISOString().split('T')[0],
            billing: 'active'
        };
        
        users.push(newUser);
        accessCodes.push({
            code: accessCode,
            userId: newUser.id,
            permissions: formData.permissions
        });
        
        // Save to localStorage
        saveDataToStorage();
        
        closeModal('userModal');
        
        // Update both users and codes sections instead of refreshing entire panel
        refreshUsersSection();
        refreshCodesSection();
        
        // Show success message with the new access code
        showSuccessMessage(`User ${newUser.name} created successfully! Access code: ${accessCode}`);
    }
}

function generateAccessCode() {
    const code = generateRandomCode();
    accessCodes.push({
        code,
        userId: null,
        permissions: ['plex']
    });
    
    // Save to localStorage
    saveDataToStorage();
    
    // Update codes section instead of refreshing entire panel
    refreshCodesSection();
    
    // Show success message
    showSuccessMessage(`New access code generated: ${code}`);
}

function generateRandomCode() {
    return 'HL' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function generateUserPage(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Create custom user page
    const pageContent = createCustomUserPage(user);
    const blob = new Blob([pageContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in new tab
    window.open(url, '_blank');
}

function createCustomUserPage(user) {
    const services = getAvailableServices(user.permissions);
    
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${user.name}'s HomeLab Access</title>
            <link rel="stylesheet" href="styles.css">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        </head>
        <body>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 2rem;">
                <div style="max-width: 800px; margin: 0 auto; text-align: center; color: white;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">Welcome ${user.name}!</h1>
                    <p style="font-size: 1.2rem; margin-bottom: 3rem;">Your personal HomeLab services</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                        ${services.map(service => `
                            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 15px; border: 1px solid rgba(255,255,255,0.2);">
                                <i class="${service.icon}" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                                <h3 style="margin-bottom: 1rem;">${service.name}</h3>
                                <p style="margin-bottom: 1.5rem; opacity: 0.9;">${service.description}</p>
                                <button style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500;">
                                    Access Service
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="margin-top: 3rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 15px; border: 1px solid rgba(255,255,255,0.2);">
                        <h3>Your Access Details</h3>
                        <p>Access Code: <strong>${user.accessCode}</strong></p>
                        <p>Services: ${user.permissions.join(', ')}</p>
                        <p>Member since: ${formatDate(user.joinDate)}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

function generateTailscalePackage() {
    const userId = document.getElementById('tailscaleUser').value;
    if (!userId) {
        alert('Please select a user first');
        return;
    }
    
    const user = users.find(u => u.id == userId);
    const tailscaleKey = 'tskey-auth-' + Math.random().toString(36).substr(2, 20);
    
    const instructions = `
# Tailscale Setup Instructions for ${user.name}

## What is Tailscale?
Tailscale creates a secure, private network that lets you access your HomeLab services from anywhere in the world, as if you were at home.

## Installation Steps:

### For Windows:
1. Download Tailscale from: https://tailscale.com/download/windows
2. Install and run the application
3. Click "Sign in" and use this auth key: ${tailscaleKey}

### For Mac:
1. Download Tailscale from: https://tailscale.com/download/mac
2. Install and run the application
3. Click "Sign in" and use this auth key: ${tailscaleKey}

### For iOS:
1. Download "Tailscale" from the App Store
2. Open the app and sign in
3. Use auth key: ${tailscaleKey}

### For Android:
1. Download "Tailscale" from Google Play Store
2. Open the app and sign in
3. Use auth key: ${tailscaleKey}

## Your Service URLs (after connecting to Tailscale):
${user.permissions.includes('plex') ? '- Plex: http://100.64.0.1:32400' : ''}
${user.permissions.includes('immich') ? '- Immich: http://100.64.0.1:2283' : ''}
${user.permissions.includes('mealie') ? '- Mealie: http://100.64.0.1:9925' : ''}

## Support:
If you need help, contact the admin through the HomeLab Hub support system.

## Security Note:
Your auth key is personal and should not be shared. It expires in 90 days.
    `.trim();
    
    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name}_Tailscale_Setup.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Modal handlers
function showRequestModal(type) {
    document.getElementById('requestModal').style.display = 'block';
    document.getElementById('requestForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Request submitted! We\'ll add the content soon.');
        closeModal('requestModal');
    });
}

function showIssueModal(service) {
    document.getElementById('issueModal').style.display = 'block';
    document.getElementById('issueService').value = service;
    document.getElementById('issueForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Issue reported! We\'ll investigate and fix it promptly.');
        closeModal('issueModal');
    });
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getNextBillingDate() {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return formatDate(nextMonth.toISOString().split('T')[0]);
}

function logout() {
    currentUser = null;
    location.reload();
}

// Memory function for demo
function updateMemory(user, type) {
    console.log(`User ${user.name} logged in as ${type}`);
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Store the user ID being edited
    window.editingUserId = userId;
    
    // Populate form with user data
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    
    // Set permissions
    document.getElementById('permPlex').checked = user.permissions.includes('plex');
    document.getElementById('permImmich').checked = user.permissions.includes('immich');
    document.getElementById('permMealie').checked = user.permissions.includes('mealie');
    
    document.getElementById('userModal').style.display = 'block';
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const user = users.find(u => u.id === userId);
        users = users.filter(u => u.id !== userId);
        accessCodes = accessCodes.filter(ac => ac.userId !== userId);
        
        // Save to localStorage
        saveDataToStorage();
        
        // Update both sections instead of refreshing entire panel
        refreshUsersSection();
        refreshCodesSection();
        
        // Show success message
        showSuccessMessage(`User ${user ? user.name : ''} deleted successfully`);
    }
}

function revokeCode(code) {
    if (confirm('Are you sure you want to revoke this access code?')) {
        accessCodes = accessCodes.filter(ac => ac.code !== code);
        
        // Save to localStorage
        saveDataToStorage();
        
        // Update codes section instead of refreshing entire panel
        refreshCodesSection();
        
        // Show success message
        showSuccessMessage(`Access code ${code} revoked successfully`);
    }
} 

// New function to refresh just the users section
function refreshUsersSection() {
    const usersSection = document.querySelector('#users-section .user-list');
    if (usersSection) {
        usersSection.innerHTML = users.map(user => createUserItem(user)).join('');
    }
}

// New function to refresh just the codes section  
function refreshCodesSection() {
    const codesSection = document.querySelector('#codes-section .user-list');
    if (codesSection) {
        codesSection.innerHTML = accessCodes.map(code => createCodeItem(code)).join('');
    }
}

// New function to show success messages
function showSuccessMessage(message) {
    showNotification(message, '#27ae60');
}

// New function to show error messages
function showErrorMessage(message) {
    showNotification(message, '#e74c3c');
}

// Generic notification function
function showNotification(message, backgroundColor) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#successAnimations')) {
        const style = document.createElement('style');
        style.id = 'successAnimations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
} 