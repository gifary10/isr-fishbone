// assets/auth-redirect.js
(function() {
    // Skip auth check for login page itself
    if (window.location.href.includes('isr-login-access')) {
        return;
    }

    // Check for successful login callback
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth_token');
    
    if (authToken) {
        // Validate token (in a real app, you would verify this server-side)
        if (isValidToken(authToken)) {
            // Store authentication state
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('auth_time', new Date().getTime());
            
            // Clean URL parameters
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            return;
        }
    }

    // Check existing authentication
    const storedToken = localStorage.getItem('auth_token');
    const authTime = localStorage.getItem('auth_time');
    
    if (!storedToken || !authTime || isSessionExpired(authTime)) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `https://gifary10.github.io/isr-login-access/?redirect_uri=${returnUrl}`;
    }

    function isValidToken(token) {
        // Basic validation - in production verify with your backend
        return token && token.length > 20;
    }

    function isSessionExpired(authTime) {
        // 8 hour session duration
        const SESSION_DURATION = 8 * 60 * 60 * 1000; 
        return (new Date().getTime() - parseInt(authTime)) > SESSION_DURATION;
    }
})();
