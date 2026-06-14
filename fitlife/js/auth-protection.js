/* ============================================
   FitLife — Auth Protection
   Check if user is logged in before accessing internal features
   ============================================ */

const AuthProtection = {
  // Check if user is logged in
  isLoggedIn() {
    const userName = localStorage.getItem('fitlife-user-name');
    const userEmail = localStorage.getItem('fitlife-user-email');
    const isLogged = !!(userName && userEmail);
    console.log('[AuthProtection] Checking login status:', { userName, userEmail, isLogged });
    return isLogged;
  },

  // Get logged-in user info
  getUser() {
    return {
      name: localStorage.getItem('fitlife-user-name'),
      email: localStorage.getItem('fitlife-user-email'),
      role: localStorage.getItem('fitlife-user-role') || 'user'
    };
  },

  // Require login - redirect if not authenticated
  requireLogin() {
    console.log('[AuthProtection.requireLogin] Checking access...');
    if (!this.isLoggedIn()) {
      console.log('[AuthProtection] User NOT logged in. Redirecting to login...');
      // Store the page they tried to access
      const currentPage = window.location.pathname;
      sessionStorage.setItem('fitlife-redirect-after-login', currentPage);
      
      // Hide content before redirect
      document.body.style.display = 'none';
      
      // Force redirect to login page
      setTimeout(() => {
        window.location.replace('../auth.html');
      }, 100);
      return false;
    }
    console.log('[AuthProtection] User IS logged in. Access granted.');
    return true;
  },

  // Require admin role
  requireAdmin() {
    console.log('[AuthProtection.requireAdmin] Checking admin access...');
    if (!this.isLoggedIn()) {
      console.log('[AuthProtection] User NOT logged in. Redirecting to login...');
      sessionStorage.setItem('fitlife-redirect-after-login', window.location.pathname);
      document.body.style.display = 'none';
      setTimeout(() => {
        window.location.replace('../auth.html');
      }, 100);
      return false;
    }
    
    const user = this.getUser();
    if (user.role !== 'admin') {
      console.log('[AuthProtection] User is NOT admin. Redirecting to home...');
      document.body.style.display = 'none';
      setTimeout(() => {
        window.location.replace('../index.html');
      }, 100);
      return false;
    }
    console.log('[AuthProtection] User IS admin. Access granted.');
    return true;
  },

  // Logout user
  logout() {
    console.log('[AuthProtection.logout] Logging out user...');
    localStorage.removeItem('fitlife-user-name');
    localStorage.removeItem('fitlife-user-email');
    localStorage.removeItem('fitlife-user-role');
    sessionStorage.removeItem('fitlife-redirect-after-login');
    
    // Hide content and redirect
    document.body.style.display = 'none';
    setTimeout(() => {
      window.location.replace('../index.html');
    }, 100);
  },

  // Initialize - add logout buttons
  init() {
    // Add logout functionality to all logout buttons
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
          this.logout();
        }
      });
    });
  }
};

// Auto-initialize auth protection
document.addEventListener('DOMContentLoaded', () => {
  AuthProtection.init();
});
