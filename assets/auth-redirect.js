// assets/auth-redirect.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already authenticated
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    
    // If not authenticated and not on the login page, redirect to login
    if (!isAuthenticated && !window.location.href.includes('isr-login-access')) {
        // Store the original intended URL
        sessionStorage.setItem('originalPath', window.location.pathname);
        
        // Redirect to login page
        window.location.href = 'https://gifary10.github.io/isr-login-access/';
    }
});

// This function should be called after successful login from the login page
window.authenticateUser = function() {
    sessionStorage.setItem('isAuthenticated', 'true');
    
    // Redirect back to the original page or index.html
    const originalPath = sessionStorage.getItem('originalPath') || '/index.html';
    window.location.href = originalPath;
};