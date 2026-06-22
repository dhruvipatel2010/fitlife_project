/**
 * Dynamic Breadcrumb Navigation System
 * Automatically generates and updates breadcrumbs based on current page
 */

class Breadcrumb {
  constructor() {
    this.breadcrumbMap = {
      // Landing pages
      'index.html': { label: 'Home', icon: '🏠' },
      'auth.html': { label: 'Login', icon: '🔐' },
      'auth-test.html': { label: 'Auth Test', icon: '🧪' },
      'demo-dashboard.html': { label: 'Demo Dashboard', icon: '📊' },
      
      // User pages
      'user/dashboard.html': { label: 'User Dashboard', icon: '📊', parent: { label: 'Home', icon: '🏠', path: '../index.html' } },
      'user/workouts.html': { label: 'Workouts & AI Coach', icon: '💪', parent: { label: 'Dashboard', icon: '📊', path: 'dashboard.html' } },
      'user/nutrition.html': { label: 'Nutrition Logs', icon: '🍎', parent: { label: 'Dashboard', icon: '📊', path: 'dashboard.html' } },
      'user/progress.html': { label: 'Progress Reports', icon: '📈', parent: { label: 'Dashboard', icon: '📊', path: 'dashboard.html' } },
      'user/goals.html': { label: 'Fitness Goals', icon: '🎯', parent: { label: 'Dashboard', icon: '📊', path: 'dashboard.html' } },
      'user/activity.html': { label: 'Daily Activity', icon: '🏃', parent: { label: 'Dashboard', icon: '📊', path: 'dashboard.html' } },
      'user/achievements.html': { label: 'Achievements', icon: '🏆', parent: { label: 'Dashboard', icon: '📊', path: 'dashboard.html' } },
      'user/profile.html': { label: 'Profile & Settings', icon: '👤', parent: { label: 'Dashboard', icon: '📊', path: 'dashboard.html' } },
      
      // Admin pages
      'admin/dashboard.html': { label: 'Admin Dashboard', icon: '👨‍💼', parent: { label: 'Home', icon: '🏠', path: '../index.html' } },
      'admin/users.html': { label: 'User Management', icon: '👥', parent: { label: 'Admin', icon: '👨‍💼', path: 'dashboard.html' } },
      'admin/feedback.html': { label: 'Feedback', icon: '💬', parent: { label: 'Admin', icon: '👨‍💼', path: 'dashboard.html' } },
      'admin/reports.html': { label: 'Reports', icon: '📋', parent: { label: 'Admin', icon: '👨‍💼', path: 'dashboard.html' } },
      'admin/notifications.html': { label: 'Notifications', icon: '🔔', parent: { label: 'Admin', icon: '👨‍💼', path: 'dashboard.html' } },
    };
  }

  /**
   * Get current page path relative to fitlife folder
   */
  getCurrentPagePath() {
    let path = window.location.pathname;
    
    // Handle file:// URLs
    if (path.includes('fitlife')) {
      // Extract everything after 'fitlife/' including Windows paths
      const fitlifeIndex = path.lastIndexOf('fitlife');
      if (fitlifeIndex !== -1) {
        path = path.substring(fitlifeIndex + 7); // Remove 'fitlife' but keep the rest
        // Remove leading slash or backslash
        path = path.replace(/^[\\\/]/, '');
        // Convert backslashes to forward slashes (for Windows paths)
        path = path.replace(/\\/g, '/');
      }
    } else {
      // For relative URLs
      const fitlifeIndex = path.indexOf('/fitlife/');
      if (fitlifeIndex !== -1) {
        path = path.substring(fitlifeIndex + 9);
      }
    }
    
    return path || 'index.html';
  }

  /**
   * Initialize and render breadcrumbs
   */
  init() {
    const container = document.getElementById('breadcrumb-container');
    if (!container) {
      console.warn('Breadcrumb container not found');
      return;
    }

    const currentPath = this.getCurrentPagePath();
    console.log('Current page path:', currentPath);
    
    const breadcrumbs = this.generateBreadcrumbs(currentPath);
    console.log('Generated breadcrumbs:', breadcrumbs);
    
    this.render(container, breadcrumbs);
  }

  /**
   * Generate breadcrumb array for current page
   */
  generateBreadcrumbs(currentPath) {
    const breadcrumbs = [];
    
    // Always start with Home
    breadcrumbs.push({
      label: 'Home',
      icon: '🏠',
      path: 'index.html',
      isActive: currentPath === 'index.html'
    });

    // Find current page info
    const pageInfo = this.breadcrumbMap[currentPath];
    
    if (pageInfo) {
      // Add parent breadcrumb if exists
      if (pageInfo.parent) {
        breadcrumbs.push({
          label: pageInfo.parent.label,
          icon: pageInfo.parent.icon || '📁',
          path: pageInfo.parent.path,
          isActive: false
        });
      }

      // Add current page (only if not Home)
      if (currentPath !== 'index.html') {
        breadcrumbs.push({
          label: pageInfo.label,
          icon: pageInfo.icon,
          path: currentPath,
          isActive: true
        });
      }
    }

    return breadcrumbs;
  }

  /**
   * Render breadcrumbs to DOM
   */
  render(container, breadcrumbs) {
    const html = breadcrumbs
      .map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return `
          <li class="breadcrumb-item ${crumb.isActive ? 'active' : ''}">
            ${crumb.isActive ? `
              <span class="breadcrumb-link">
                <span class="breadcrumb-icon">${crumb.icon}</span>
                <span class="breadcrumb-label">${crumb.label}</span>
              </span>
            ` : `
              <a href="${crumb.path}" class="breadcrumb-link">
                <span class="breadcrumb-icon">${crumb.icon}</span>
                <span class="breadcrumb-label">${crumb.label}</span>
              </a>
            `}
            ${!isLast ? '<span class="breadcrumb-separator">/</span>' : ''}
          </li>
        `;
      })
      .join('');

    container.innerHTML = `<ul class="breadcrumb-list">${html}</ul>`;
  }
}

// Initialize breadcrumbs when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const breadcrumb = new Breadcrumb();
  breadcrumb.init();
});
