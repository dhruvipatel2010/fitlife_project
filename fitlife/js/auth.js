/* ============================================
   FitLife — Auth JS  (uses Store)
   ============================================ */

// ── Tab switching (Login / Register) ──
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

authTabs.forEach(tab => {
  tab.addEventListener('click', function () {
    authTabs.forEach(t => t.classList.remove('active'));
    authForms.forEach(f => f.classList.remove('active'));
    this.classList.add('active');
    const target = document.getElementById(this.dataset.target);
    if (target) target.classList.add('active');
  });
});

// ── URL param to open register tab ──
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('tab') === 'register') {
  document.querySelector('.auth-tab[data-target="registerForm"]')?.click();
}

function updateAuthGreeting() {
  const authWelcome = document.getElementById('authWelcome');
  if (!authWelcome) return;
  const user = Store.getUser();
  const name = user.name || localStorage.getItem('fitlife-user-name') || '';
  if (name) {
    authWelcome.textContent = `Welcome back, ${Store.getFirstName(name)}! Ready to continue?`;
  } else {
    authWelcome.textContent = 'Sign in with your FitLife account to continue.';
  }
}

updateAuthGreeting();

// ── Password strength indicator ──
const passwordInput = document.getElementById('regPassword');
const strengthBar   = document.getElementById('strengthBar');
const strengthText  = document.getElementById('strengthText');

if (passwordInput && strengthBar) {
  passwordInput.addEventListener('input', function () {
    const val = this.value;
    let score = 0;
    if (val.length >= 8)           score++;
    if (/[A-Z]/.test(val))         score++;
    if (/[0-9]/.test(val))         score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const widths = ['0%', '25%', '50%', '75%', '100%'];

    strengthBar.style.width      = widths[score] || '0%';
    strengthBar.style.background = colors[score] || 'transparent';
    if (strengthText) strengthText.textContent = labels[score] || '';
    if (strengthText) strengthText.style.color = colors[score] || '';
  });
}

// ── Toggle password visibility ──
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', function () {
    const input = this.previousElementSibling;
    if (input && input.type === 'password') {
      input.type = 'text';
      this.textContent = '🙈';
    } else if (input) {
      input.type = 'password';
      this.textContent = '👁';
    }
  });
});

// ── Login form ──
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showAuthError('Please fill in all fields.');
      return;
    }

    const roleRadio = document.querySelector('input[name="role"]:checked');
    const role      = roleRadio ? roleRadio.value : 'user';

    const btn     = this.querySelector('button[type="submit"]');
    const oldText = btn.textContent;
    btn.textContent = 'Signing in...';
    btn.disabled    = true;

    // Derive name from existing store or email prefix
    const existing = Store.getUser();
    const name     = existing.name || email.split('@')[0];

    Store.saveUser({ name, email, role });
    Store.registerUser({ name, email, role });
    showToast(`Welcome back, ${Store.getFirstName(name)}! 👋`, 'success');

    setTimeout(() => {
      window.location.href = role === 'admin' ? 'admin/dashboard.html' : 'user/dashboard.html';
    }, 1200);
  });
}

// ── Register form ──
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('regName').value.trim();
    const email   = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm  = document.getElementById('regConfirm').value;

    if (!name || !email || !password || !confirm) {
      showAuthError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      showAuthError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      showAuthError('Password must be at least 8 characters.');
      return;
    }

    Store.saveUser({ name, email, role: 'user', height: 180, weight: 80.8, dob: '1995-05-15' });
    Store.registerUser({ name, email, role: 'user' });

    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Creating account...';
    btn.disabled    = true;

    showToast(`Account created! Welcome, ${Store.getFirstName(name)}! 🎉`, 'success');

    setTimeout(() => {
      window.location.href = 'user/dashboard.html';
    }, 1400);
  });
}

function showAuthError(msg) {
  let errEl = document.getElementById('authError');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.id = 'authError';
    errEl.style.cssText = `
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
      color: #ef4444; padding: 10px 16px; border-radius: 8px;
      font-size: 0.85rem; font-weight: 500; margin-bottom: 8px;
    `;
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) activeForm.prepend(errEl);
  }
  errEl.textContent = '⚠️ ' + msg;
  setTimeout(() => errEl?.remove(), 4000);
}
