/* ============================================
   FitLife — Dashboard JS (Charts + Interactions)
   ============================================ */

// ── Chart.js defaults ──
Chart.defaults.color = '#6b7280';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = 'Inter';

// ── Calorie Overview Bar Chart ──
const calorieCtx = document.getElementById('calorieChart');
if (calorieCtx) {
  const calorieChart = new Chart(calorieCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Calories Burned',
          data: [520, 680, 450, 790, 610, 870, 540],
          backgroundColor: 'rgba(34,197,94,0.8)',
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Calories Consumed',
          data: [1850, 2100, 1760, 2200, 1950, 2400, 1800],
          backgroundColor: 'rgba(59,130,246,0.5)',
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 10, borderRadius: 4, padding: 16, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          titleFont: { weight: '700' },
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.raw} kcal`
          }
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
}

// ── Macronutrients Doughnut Chart ──
const macroCtx = document.getElementById('macroChart');
if (macroCtx) {
  new Chart(macroCtx, {
    type: 'doughnut',
    data: {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [{
        data: [35, 47, 18],
        backgroundColor: ['#22c55e', '#3b82f6', '#f97316'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, padding: 14, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` }
        }
      }
    }
  });
}

// ── Weekly Activity Line Chart (Progress Page) ──
const weeklyCtx = document.getElementById('weeklyChart');
if (weeklyCtx) {
  new Chart(weeklyCtx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
      datasets: [
        {
          label: 'Weight (kg)',
          data: [85, 84.2, 83.8, 82.9, 82.1, 81.5, 80.8, 80.1],
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.08)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          label: 'Goal (kg)',
          data: [85, 84.5, 84, 83.5, 83, 82.5, 82, 81.5],
          borderColor: 'rgba(59,130,246,0.6)',
          borderDash: [6, 4],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 10, padding: 16, font: { size: 11 } } },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
        }
      },
      scales: {
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

// ── Steps Bar Chart (Daily Activity) ──
const stepsCtx = document.getElementById('stepsChart');
if (stepsCtx) {
  new Chart(stepsCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Steps',
        data: [7200, 9800, 6400, 11200, 8600, 12400, 5800],
        backgroundColor: (ctx) => {
          const v = ctx.raw;
          return v >= 10000 ? 'rgba(34,197,94,0.85)' : v >= 7500 ? 'rgba(251,191,36,0.7)' : 'rgba(239,68,68,0.6)';
        },
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: { label: ctx => ` Steps: ${ctx.raw.toLocaleString()}` }
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { font: { size: 11 }, callback: v => v >= 1000 ? v / 1000 + 'k' : v }
        },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

// ── Monthly Calories Chart (Nutrition) ──
const nutritionCtx = document.getElementById('nutritionChart');
if (nutritionCtx) {
  new Chart(nutritionCtx, {
    type: 'line',
    data: {
      labels: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14'],
      datasets: [
        {
          label: 'Intake',
          data: [2100, 1950, 2200, 1800, 2050, 2300, 1900, 2150, 1850, 2000, 2400, 1750, 2100, 1950],
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.06)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
        },
        {
          label: 'Target (2000 kcal)',
          data: Array(14).fill(2000),
          borderColor: 'rgba(239,68,68,0.5)',
          borderDash: [6, 4],
          fill: false,
          tension: 0,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 10, padding: 16, font: { size: 11 } } },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
        }
      },
      scales: {
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

// ── Sidebar toggle (mobile) ──
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ── KPI counter animation ──
document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1500;
  const start = performance.now();
  function run(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + (eased * target).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(run);
  }
  requestAnimationFrame(run);
});

// ── Water intake tracker ──
const waterBtns = document.querySelectorAll('.water-btn');
let waterCount = 4;
const waterDisplay = document.getElementById('waterDisplay');
const waterCups = document.getElementById('waterCups');

function updateWater() {
  if (waterDisplay) waterDisplay.textContent = waterCount;
  if (waterCups) {
    const cups = waterCups.querySelectorAll('.water-cup');
    cups.forEach((cup, i) => {
      cup.classList.toggle('filled', i < waterCount);
    });
  }
}

waterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.action === 'add' && waterCount < 8) {
      waterCount++;
      showToast('Water intake updated! 💧');
    } else if (btn.dataset.action === 'remove' && waterCount > 0) {
      waterCount--;
    }
    updateWater();
  });
});

// ── Chart tab switch ──
const chartTabBtns = document.querySelectorAll('.chart-tab');
chartTabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const parent = this.closest('.chart-card');
    parent.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// Expose toast globally
window.showToast = function(msg, type) {
  const toast = document.createElement('div');
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background: #111827; border: 1px solid rgba(255,255,255,0.08);
    color: #f9fafb; padding: 12px 20px;
    border-radius: 12px; display:flex; align-items:center; gap:10px;
    font-size: 0.875rem; font-weight:500; box-shadow:0 4px 24px rgba(0,0,0,0.4);
    animation: fadeUp 0.3s ease; font-family: Inter, sans-serif;
    border-left: 3px solid #22c55e;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
};
