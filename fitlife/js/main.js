/* ============================================
   FitLife — main.js (Theme Toggle + Global Utils)
   ============================================ */

// ══════════════════════════════════════
// THEME MANAGER — Dark / Light Mode
// ══════════════════════════════════════
const ThemeManager = {
  key: 'fitlife-theme',
  default: 'dark',

  get() {
    return localStorage.getItem(this.key) || this.default;
  },

  set(theme) {
    localStorage.setItem(this.key, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.updateToggles(theme);
    this.updateCharts(theme);
  },

  toggle() {
    const current = this.get();
    this.set(current === 'dark' ? 'light' : 'dark');
  },

  init() {
    const theme = this.get();
    document.documentElement.setAttribute('data-theme', theme);
    this.updateToggles(theme);
  },

  updateToggles(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  },

  updateCharts(theme) {
    if (typeof Chart === 'undefined') return;
    const textColor = theme === 'light' ? '#64748b' : '#6b7280';
    const gridColor = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;
    Object.values(Chart.instances || {}).forEach(chart => {
      if (chart.options?.scales) {
        Object.values(chart.options.scales).forEach(scale => {
          if (scale.grid)  scale.grid.color  = gridColor;
          if (scale.ticks) scale.ticks.color = textColor;
        });
      }
      chart.update('none');
    });
  }
};

// Init theme on every page load FIRST
ThemeManager.init();

// ══════════════════════════════════════
// USER HYDRATION  (uses Store if available)
// ══════════════════════════════════════
function hydrateStoredUser() {
  // Store.hydrateAll() is already called by store.js on DOMContentLoaded.
  // This is a lightweight fallback for scripts that load before DOMContentLoaded.
  if (typeof Store !== 'undefined') return; // store.js will handle it

  const name = localStorage.getItem('fitlife-user-name');
  if (!name) return;

  const parts = name.trim().split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  document.querySelectorAll('.user-mini-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.user-avatar, .topbar-avatar').forEach(el => el.textContent = initials);

  document.querySelectorAll('.topbar-title').forEach(el => {
    if (el.textContent.toLowerCase().includes('welcome')) {
      el.textContent = `Welcome Back, ${parts[0]}! 👋`;
    }
  });

  const profileCard = document.getElementById('profileCardName');
  if (profileCard) profileCard.textContent = name;
}

hydrateStoredUser();

// Bind all theme toggles
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });

  // ── Logout buttons ──
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof Store !== 'undefined') Store.clearSession();
      else {
        ['fitlife-user','fitlife-user-name','fitlife-user-email','fitlife-user-role'].forEach(k => localStorage.removeItem(k));
      }
      showToast('You have been logged out. See you soon! 👋', 'info');
      setTimeout(() => { window.location.href = window.location.pathname.includes('/user/') || window.location.pathname.includes('/admin/') ? '../auth.html' : 'auth.html'; }, 1200);
    });
  });
});

// ══════════════════════════════════════
// NAVBAR — Scroll Effect & Mobile Menu
// ══════════════════════════════════════
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// ══════════════════════════════════════
// COUNTER ANIMATION
// ══════════════════════════════════════
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix   || '';
  const prefix   = el.dataset.prefix   || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1800;
  const start    = performance.now();
  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + (eased * target).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = parseFloat(entry.target.dataset.target);
        if (!isNaN(target)) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => obs.observe(c));
}

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    revObs.observe(el);
  });
}

// ══════════════════════════════════════
// PROGRESS BARS
// ══════════════════════════════════════
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 400);
  });
});

// ══════════════════════════════════════
// MODAL HELPERS
// ══════════════════════════════════════
window.openModal  = id => document.getElementById(id)?.classList.add('active');
window.closeModal = id => document.getElementById(id)?.classList.remove('active');

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});
document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});

// ══════════════════════════════════════
// TOAST NOTIFICATION
// ══════════════════════════════════════
window.showToast = function(message, type = 'success') {
  const existing = document.querySelector('.fitlife-toast');
  if (existing) existing.remove();

  const colors = { success: 'var(--accent)', error: 'var(--accent-red)', info: 'var(--accent-blue)' };
  const icons  = { success: '✅', error: '❌', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = 'fitlife-toast';
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background: var(--bg-card); border: 1px solid var(--border);
    border-left: 3px solid ${colors[type]};
    color: var(--text-primary); padding: 14px 20px;
    border-radius: 12px; display:flex; align-items:center; gap:10px;
    font-size: 0.875rem; font-weight:500; box-shadow: var(--shadow);
    animation: fadeUp 0.3s ease; max-width: 360px; font-family: Inter, sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity    = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// ══════════════════════════════════════
// RIPPLE ON BUTTONS
// ══════════════════════════════════════
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      background:rgba(255,255,255,0.25); width:60px; height:60px;
      left:${e.clientX - rect.left - 30}px; top:${e.clientY - rect.top - 30}px;
      animation: rippleAnim 0.5s ease forwards;
    `;
    if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Inject keyframes
const s = document.createElement('style');
s.textContent = `
  @keyframes rippleAnim { to { transform:scale(4); opacity:0; } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
`;
document.head.appendChild(s);

// ══════════════════════════════════════
// SIDEBAR TOGGLE (Dashboard pages)
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar       = document.getElementById('sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
});

// ══════════════════════════════════════
// ACTIVE NAV HIGHLIGHT
// ══════════════════════════════════════
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-item[data-page], .navbar-links a').forEach(link => {
  const href = link.getAttribute('href') || link.dataset.page || '';
  if (href && href.includes(currentPage)) link.classList.add('active');
});
