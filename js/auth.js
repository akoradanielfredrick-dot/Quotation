/**
 * auth.js - Authentication and Route Protection
 * MRANGA TOURS & SAFARIS LTD
 */

// Default Credentials
const DEFAULT_USER = {
    username: 'admin',
    password: 'mranga123'
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // Route Protection
    checkAuth();

    // Login logic
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value;
            const passwordInputValue = passwordInput.value;

            if (usernameInput === DEFAULT_USER.username && passwordInputValue === DEFAULT_USER.password) {
                // Success
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', usernameInput);
                window.location.href = 'dashboard.html';
            } else {
                // Fail
                if (errorMessage) {
                    errorMessage.classList.remove('hidden');
                }
            }
        });
    }

    // Logout logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        });
    }

    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            const showIcon = togglePasswordBtn.querySelector('.icon-show');
            const hideIcon = togglePasswordBtn.querySelector('.icon-hide');
            
            if (isPassword) {
                showIcon.classList.add('hidden');
                hideIcon.classList.remove('hidden');
            } else {
                showIcon.classList.remove('hidden');
                hideIcon.classList.add('hidden');
            }
        });
    }

    // Display username if logged in
    const userDisplay = document.getElementById('user-display');
    const storedUser = localStorage.getItem('username');
    if (userDisplay && storedUser) {
        userDisplay.textContent = `Welcome, ${storedUser}`;
    }
});

/**
 * Check if the user is authenticated and redirect if necessary
 */
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPath = window.location.pathname;
    const isDashboard = currentPath.includes('dashboard.html');
    const isLogin = currentPath.includes('index.html') || currentPath.endsWith('/');

    if (isDashboard && !isLoggedIn) {
        // Trying to access dashboard without login
        window.location.href = 'index.html';
    } else if (isLogin && isLoggedIn) {
        // Trying to access login page while already logged in
        window.location.href = 'dashboard.html';
    }
}
