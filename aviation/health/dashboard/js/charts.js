// ============================================================
// charts.js — Chart rendering with Chart.js
// ============================================================

const CHARTS = {
  instances: {},

  colors: {
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    orange: '#f97316',
    red: '#ef4444',
    cyan: '#06b6d4',
    pink: '#ec4899',
    yellow: '#eab308',
  },

  defaults() {
    Chart.defaults.color = '#6b7280';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10,10,15,0.9)';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.titleFont = { weight: '600' };
    Chart.defaults.elements.point.radius = 0;
    Chart.defaults.elements.point.hoverRadius = 4;
    Chart.defaults.elements.line.tension = 0.4;
    Chart.defaults.scale.grid = { color: 'rgba(255,255,255,0.04)', drawBorder: false };
  },

  gradient(ctx, color, height = 140) {
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, color + '40');
    g.addColorStop(1, color + '00');
    return g;
  },

  // --- Feed card charts ---

  renderHRChart(canvasId, zones) {
    // Already handled by CSS hr-zones-bar
  },

  renderGlucoseChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const data = DATA.glucose24h;
    const labels = data.map((_, i) => {
      const h = Math.floor(i * 0.5);
      return `${h}:00`;
    });

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: this.colors.orange,
          backgroundColor: this.gradient(ctx.getContext('2d'), this.colors.orange, 100),
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => `${c.raw} mg/dL`
            }
          },
          annotation: {
            annotations: {
              range: {
                type: 'box',
                yMin: 70,
                yMax: 140,
                backgroundColor: 'rgba(34,197,94,0.05)',
                borderWidth: 0,
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            ticks: { maxTicksLimit: 6 },
            grid: { display: false },
          },
          y: {
            display: true,
            min: 60,
            max: 160,
            ticks: { maxTicksLimit: 4 },
          }
        }
      }
    });
  },

  // --- Stats tab charts ---

  renderTrendChart(canvasId, data, color, label, unit = '') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const labels = data.map((_, i) => `Day ${i + 1}`);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: color,
          backgroundColor: this.gradient(ctx.getContext('2d'), color),
          fill: true,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => `${c.raw}${unit}`
            }
          }
        },
        scales: {
          x: { display: false },
          y: {
            display: true,
            ticks: { maxTicksLimit: 4 },
          }
        }
      }
    });
  },

  renderFitnessFatigueChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const labels = DATA.trends.fitness.map((_, i) => `Day ${i + 1}`);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Fitness (CTL)',
            data: DATA.trends.fitness,
            borderColor: this.colors.blue,
            backgroundColor: 'transparent',
            borderWidth: 2,
          },
          {
            label: 'Fatigue (ATL)',
            data: DATA.trends.fatigue,
            borderColor: this.colors.red,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          x: { display: false },
          y: { display: true, ticks: { maxTicksLimit: 4 } }
        }
      }
    });
  },

  renderBiomarkerSparkline(canvasId, data, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color || this.colors.green,
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  },

  // Initialize all stats charts
  initStatsCharts() {
    this.renderTrendChart('chart-hrv', DATA.trends.hrv, this.colors.purple, 'HRV', 'ms');
    this.renderTrendChart('chart-rhr', DATA.trends.restingHR, this.colors.red, 'Resting HR', ' bpm');
    this.renderTrendChart('chart-sleep', DATA.trends.sleepScore, this.colors.green, 'Sleep Score');
    this.renderTrendChart('chart-vo2', DATA.trends.vo2max, this.colors.cyan, 'VO2 Max');
    this.renderFitnessFatigueChart('chart-fitness');
  },

  // Initialize glucose chart in feed
  initFeedCharts() {
    this.renderGlucoseChart('chart-glucose-feed');
  },

  // Initialize biomarker sparklines
  initLabCharts() {
    DATA.bloodwork.biomarkers.forEach((b, i) => {
      const id = `sparkline-${i}`;
      const statusColor = b.status === 'optimal' ? this.colors.green :
                          b.status === 'normal' ? this.colors.yellow : this.colors.red;
      this.renderBiomarkerSparkline(id, b.history, statusColor);
    });
  },

  destroyAll() {
    Object.values(this.instances).forEach(c => c && c.destroy());
    this.instances = {};
  }
};
