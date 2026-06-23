/* ============================================================
   FitLife — store.js  |  Central localStorage Data Layer
   All pages read/write through this module.
   ============================================================ */

const Store = (() => {

  /* ── Keys ── */
  const KEYS = {
    user:     'fitlife-user',
    meals:    'fitlife-meals',
    workouts: 'fitlife-workouts',
    goals:    'fitlife-goals',
    water:    'fitlife-water',
    activity: 'fitlife-activity',
    theme:    'fitlife-theme',
    users:    'fitlife-all-users',
  };

  /* ── Helpers ── */
  const today = () => new Date().toISOString().split('T')[0];
  const parse  = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
  const save   = (key, val)     => localStorage.setItem(key, JSON.stringify(val));

  /* ────────────────────────────────────────────────
     USER / PROFILE
  ──────────────────────────────────────────────── */
  function getUser() {
    return parse(KEYS.user, {
      name:   '',
      email:  '',
      role:   'user',
      height: 180,
      weight: 80.8,
      dob:    '1995-05-15',
    });
  }

  function saveUser(data) {
    const existing = getUser();
    save(KEYS.user, { ...existing, ...data });
    // Keep legacy keys for auth-protection.js compatibility
    if (data.name)  localStorage.setItem('fitlife-user-name',  data.name);
    if (data.email) localStorage.setItem('fitlife-user-email', data.email);
    if (data.role)  localStorage.setItem('fitlife-user-role',  data.role);
  }

  function getInitials(fullName) {
    const parts = (fullName || '').trim().split(' ').filter(Boolean);
    if (!parts.length) return '??';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getFirstName(fullName) {
    return (fullName || '').trim().split(' ')[0] || 'User';
  }

  /* ────────────────────────────────────────────────
     MEALS  (keyed by date so logs are per-day)
  ──────────────────────────────────────────────── */
  function getMeals(date) {
    const d = date || today();
    const all = parse(KEYS.meals, {});
    return all[d] || [];
  }

  function saveMeals(meals, date) {
    const d = date || today();
    const all = parse(KEYS.meals, {});
    all[d] = meals;
    save(KEYS.meals, all);
  }

  function addMeal(meal) {
    const meals = getMeals();
    meal.id = Date.now();
    meal.date = today();
    meals.push(meal);
    saveMeals(meals);
    return meal;
  }

  function deleteMeal(id) {
    const meals = getMeals().filter(m => m.id !== id);
    saveMeals(meals);
  }

  function getTodayCalories() {
    return getMeals().reduce((s, m) => s + (m.cal || 0), 0);
  }
  function getTodayProtein() { return getMeals().reduce((s, m) => s + (m.prot || 0), 0); }
  function getTodayCarbs()   { return getMeals().reduce((s, m) => s + (m.carb || 0), 0); }
  function getTodayFat()     { return getMeals().reduce((s, m) => s + (m.fat  || 0), 0); }

  /* ────────────────────────────────────────────────
     WORKOUTS  (keyed by date)
  ──────────────────────────────────────────────── */
  function getWorkouts(date) {
    const d = date || today();
    const all = parse(KEYS.workouts, {});
    return all[d] || [];
  }

  function saveWorkouts(workouts, date) {
    const d = date || today();
    const all = parse(KEYS.workouts, {});
    all[d] = workouts;
    save(KEYS.workouts, all);
  }

  function addWorkout(workout) {
    const list = getWorkouts();
    workout.id = Date.now();
    workout.date = today();
    list.push(workout);
    saveWorkouts(list);
    return workout;
  }

  function deleteWorkout(id) {
    const list = getWorkouts().filter(w => w.id !== id);
    saveWorkouts(list);
  }

  function getTodayCaloriesBurned() {
    return getWorkouts().reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  }

  function getTodayActiveMinutes() {
    return getWorkouts().reduce((s, w) => s + (w.duration || 0), 0);
  }

  /* ────────────────────────────────────────────────
     WATER  (cups per day)
  ──────────────────────────────────────────────── */
  function getWater() {
    const all = parse(KEYS.water, {});
    return all[today()] ?? 0;
  }

  function setWater(n) {
    const all = parse(KEYS.water, {});
    all[today()] = Math.max(0, Math.min(8, n));
    save(KEYS.water, all);
  }

  /* ────────────────────────────────────────────────
     GOALS
  ──────────────────────────────────────────────── */
  function getGoals() {
    return parse(KEYS.goals, [
      { id: 1, title: 'Lose Weight (Target: 80.0 kg)',       type: 'weight', target: 80.0, current: 80.8, isDec: true,  unit: 'kg',    step: -0.2, color: '' },
      { id: 2, title: 'Daily Steps Target (Target: 10,000)', type: 'steps',  target: 10000, current: 7200, isDec: false, unit: 'steps', step: 500,  color: 'blue' },
      { id: 3, title: 'Water Cups Hydration (Target: 8)',    type: 'water',  target: 8,    current: 4,    isDec: false, unit: 'cups',  step: 1,    color: 'orange' },
    ]);
  }

  function saveGoals(goals) {
    save(KEYS.goals, goals);
  }

  function addGoal(goal) {
    const goals = getGoals();
    goal.id = Date.now();
    goals.push(goal);
    saveGoals(goals);
    return goal;
  }

  function updateGoal(id, fields) {
    const goals = getGoals().map(g => g.id === id ? { ...g, ...fields } : g);
    saveGoals(goals);
  }

  /* ────────────────────────────────────────────────
     ACTIVITY LOG  (steps/water/sleep/active per day)
  ──────────────────────────────────────────────── */
  function getActivity(date) {
    const d = date || today();
    const all = parse(KEYS.activity, {});
    return all[d] || { steps: 7200, water: 4, sleep: 6.0, active: 78 };
  }

  function saveActivity(data, date) {
    const d = date || today();
    const all = parse(KEYS.activity, {});
    all[d] = { ...getActivity(d), ...data };
    save(KEYS.activity, all);
  }

  /* ────────────────────────────────────────────────
     USER DATABASE (All Registered Users)
  ──────────────────────────────────────────────── */
  function getUsers() {
    return parse(KEYS.users, [
      { name: 'Alex Kumar', email: 'alex.kumar@example.com', registeredDate: 'Jan 12, 2026', role: 'user', tier: 'Premium Gold', status: 'Active' },
      { name: 'Sarah Jenkins', email: 'sarah.j@example.com', registeredDate: 'Feb 20, 2026', role: 'user', tier: 'Free Tier', status: 'Active' },
      { name: 'Michael Rose', email: 'm.rose@example.com', registeredDate: 'Mar 05, 2026', role: 'user', tier: 'Free Tier', status: 'Suspended' },
      { name: 'Admin User', email: 'admin@fitlife.com', registeredDate: 'Jan 01, 2026', role: 'admin', tier: 'Administrator', status: 'Active' },
    ]);
  }

  function saveUsers(users) {
    save(KEYS.users, users);
  }

  function registerUser(newUser) {
    const list = getUsers();
    if (!list.some(u => u.email === newUser.email)) {
      list.push({
        name: newUser.name,
        email: newUser.email,
        registeredDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
        role: newUser.role || 'user',
        tier: newUser.role === 'admin' ? 'Administrator' : 'Free Tier',
        status: 'Active'
      });
      saveUsers(list);
    }
  }

  // Fallback registration check for initial login/default setup
  if (getUsers().length === 4) {
    // If only defaults exist, make sure we run checks to persist if needed
    saveUsers(getUsers());
  }

  function deleteUser(email) {
    const list = getUsers().filter(u => u.email !== email);
    saveUsers(list);
  }

  function updateUserStatus(email, status) {
    const list = getUsers().map(u => u.email === email ? { ...u, status } : u);
    saveUsers(list);
  }

  /* ────────────────────────────────────────────────
     SESSION / LOGOUT
  ──────────────────────────────────────────────── */
  function isLoggedIn() {
    const u = getUser();
    return !!u.email || !!localStorage.getItem('fitlife-user-email');
  }

  function clearSession() {
    [KEYS.user, 'fitlife-user-name', 'fitlife-user-email', 'fitlife-user-role'].forEach(k => localStorage.removeItem(k));
  }

  /* ────────────────────────────────────────────────
     UI HYDRATION HELPERS
  ──────────────────────────────────────────────── */
  function hydrateAll() {
    const user = getUser();
    const name = user.name || localStorage.getItem('fitlife-user-name') || '';
    if (!name) return;

    const initials = getInitials(name);
    const firstName = getFirstName(name);

    // Sidebar / topbar names
    document.querySelectorAll('.user-mini-name').forEach(el => el.textContent = name);
    document.querySelectorAll('.user-avatar, .topbar-avatar').forEach(el => el.textContent = initials);
    document.querySelectorAll('.profile-large-avatar').forEach(el => el.textContent = initials);

    // Greeting
    document.querySelectorAll('.topbar-title').forEach(el => {
      if (el.textContent.toLowerCase().includes('welcome')) {
        el.textContent = `Welcome Back, ${firstName}! 👋`;
      }
    });

    // Profile card
    const profileCardName = document.getElementById('profileCardName');
    if (profileCardName) profileCardName.textContent = name;

    const profileCardEmail = document.getElementById('profileCardEmail');
    if (profileCardEmail) profileCardEmail.textContent = user.email || '';

    const profileCardHeight = document.getElementById('profileCardHeight');
    if (profileCardHeight) profileCardHeight.textContent = (user.height || 180) + ' cm';

    const profileCardWeight = document.getElementById('profileCardWeight');
    if (profileCardWeight) profileCardWeight.textContent = (user.weight || 80.8) + ' kg';

    // Profile form inputs
    const profName   = document.getElementById('profName');
    const profEmail  = document.getElementById('profEmail');
    const profHeight = document.getElementById('profHeight');
    const profWeight = document.getElementById('profWeight');
    const profDob    = document.getElementById('profDob');
    if (profName)   profName.value   = name;
    if (profEmail)  profEmail.value  = user.email || '';
    if (profHeight) profHeight.value = user.height || 180;
    if (profWeight) profWeight.value = user.weight || 80.8;
    if (profDob)    profDob.value    = user.dob    || '1995-05-15';

    // BMI pre-fill
    const bmiHeight = document.getElementById('bmiHeight');
    const bmiWeight = document.getElementById('bmiWeight');
    if (bmiHeight) bmiHeight.value = user.height || 180;
    if (bmiWeight) bmiWeight.value = user.weight || 80.8;
  }

  /* ── Expose public API ── */
  return {
    today,
    getUser, saveUser, getInitials, getFirstName,
    getMeals, saveMeals, addMeal, deleteMeal,
    getTodayCalories, getTodayProtein, getTodayCarbs, getTodayFat,
    getWorkouts, saveWorkouts, addWorkout, deleteWorkout,
    getTodayCaloriesBurned, getTodayActiveMinutes,
    getWater, setWater,
    getGoals, saveGoals, addGoal, updateGoal,
    getActivity, saveActivity,
    getUsers, saveUsers, registerUser, deleteUser, updateUserStatus,
    isLoggedIn, clearSession,
    hydrateAll,
  };
})();

/* ── Run hydration immediately on every page ── */
document.addEventListener('DOMContentLoaded', () => Store.hydrateAll());
