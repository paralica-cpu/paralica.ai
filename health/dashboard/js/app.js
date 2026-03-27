// ============================================================
// app.js — Main app logic
// ============================================================

const APP = {
  currentTab: 'feed',
  chartsInitialized: { feed: false, stats: false, labs: false },

  init() {
    CHARTS.defaults();
    this.renderProfile();
    this.renderScores();
    this.renderStories();
    this.renderIntegrations();
    this.renderFeed();
    this.renderStats();
    this.renderLabs();
    this.setupNavigation();
    this.animateScoreRings();

    // Init feed charts after render
    setTimeout(() => {
      CHARTS.initFeedCharts();
      this.chartsInitialized.feed = true;
    }, 300);
  },

  // ---- Profile ----
  renderProfile() {
    const p = DATA.profile;
    document.getElementById('profile-section').innerHTML = `
      <div class="profile-top">
        <div class="avatar" style="background:${p.avatarColor}">${p.avatar}</div>
        <div class="profile-info">
          <h1>${p.name}</h1>
          <div class="handle">${p.handle}</div>
          <div class="bio">${p.bio}</div>
          <div class="location">📍 ${p.location}</div>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat"><div class="num">${p.activities.toLocaleString()}</div><div class="label">Activities</div></div>
        <div class="stat"><div class="num">${p.followers.toLocaleString()}</div><div class="label">Followers</div></div>
        <div class="stat"><div class="num">${p.following.toLocaleString()}</div><div class="label">Following</div></div>
      </div>
      <div class="badges">${p.badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>
      <button class="edit-profile-btn">Edit Profile</button>
    `;
  },

  // ---- Score Rings ----
  renderScores() {
    const scores = DATA.scores;
    const container = document.getElementById('scores-row');
    container.innerHTML = Object.entries(scores).map(([key, s]) => `
      <div class="score-card" data-score="${key}" onclick="APP.toggleScoreFactors('${key}')">
        <div class="score-ring-wrap">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke="${s.color}" stroke-width="6"
              stroke-dasharray="${2 * Math.PI * 34}" stroke-dashoffset="${2 * Math.PI * 34}"
              stroke-linecap="round" class="score-ring-progress" data-target="${s.value}"/>
          </svg>
          <div class="score-value" style="color:${s.color}">0</div>
        </div>
        <div class="score-label">${s.label}</div>
        <div class="score-change ${s.change >= 0 ? 'up' : 'down'}">${s.change >= 0 ? '↑' : '↓'} ${Math.abs(s.change)} pts</div>
      </div>
    `).join('');

    // Factor panels
    const factorsContainer = document.getElementById('score-factors-container');
    factorsContainer.innerHTML = Object.entries(scores).map(([key, s]) => `
      <div class="score-factors" id="factors-${key}">
        <div class="factor-card">
          <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;color:${s.color}">${s.label} Score Breakdown</h3>
          ${s.factors.map(f => `
            <div class="factor-row">
              <div class="factor-left">
                <span class="factor-icon">${f.icon}</span>
                <span class="factor-name">${f.name}</span>
              </div>
              <span class="factor-value" style="color:${f.value >= 85 ? '#22c55e' : f.value >= 70 ? '#eab308' : '#ef4444'}">${f.value}</span>
            </div>
            <div class="factor-bar">
              <div class="factor-bar-fill" style="width:${f.value}%;background:${s.color}"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  animateScoreRings() {
    setTimeout(() => {
      document.querySelectorAll('.score-ring-progress').forEach(ring => {
        const target = parseInt(ring.dataset.target);
        const circumference = 2 * Math.PI * 34;
        const offset = circumference * (1 - target / 100);
        ring.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        ring.style.strokeDashoffset = offset;
      });

      // Animate numbers
      document.querySelectorAll('.score-card').forEach(card => {
        const key = card.dataset.score;
        const target = DATA.scores[key].value;
        const valueEl = card.querySelector('.score-value');
        let current = 0;
        const duration = 1500;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          current = Math.round(eased * target);
          valueEl.textContent = current;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, 200);
  },

  toggleScoreFactors(key) {
    const panel = document.getElementById(`factors-${key}`);
    const isOpen = panel.classList.contains('open');
    document.querySelectorAll('.score-factors').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.score-card').forEach(c => c.classList.remove('expanded'));
    if (!isOpen) {
      panel.classList.add('open');
      document.querySelector(`.score-card[data-score="${key}"]`).classList.add('expanded');
    }
  },

  // ---- Stories ----
  renderStories() {
    const container = document.getElementById('stories-row');
    container.innerHTML = DATA.stories.map(s => `
      <div class="story-bubble">
        <div class="story-ring" style="background:linear-gradient(135deg, ${s.color}, ${s.color}80)">
          <div class="story-inner">
            <span class="story-icon">${s.icon}</span>
            <span class="story-value">${s.value}</span>
          </div>
        </div>
        <span class="story-label">${s.label}</span>
        <span class="story-change" style="color:${s.color}">${s.change}</span>
      </div>
    `).join('');
  },

  // ---- Integrations ----
  renderIntegrations() {
    const container = document.getElementById('integrations-bar');
    container.innerHTML = DATA.integrations.map(i => `
      <div class="integration-chip">
        <span class="integration-dot"></span>
        <span>${i.icon} ${i.name}</span>
        <span class="integration-sync">${i.lastSync}</span>
      </div>
    `).join('');
  },

  // ---- Feed ----
  renderFeed() {
    const container = document.getElementById('feed-content');
    container.innerHTML = DATA.activities.map((a, idx) => this.renderActivityCard(a, idx)).join('');
  },

  renderActivityCard(a, idx) {
    const p = DATA.profile;
    let bodyContent = '';

    switch (a.type) {
      case 'run':
      case 'bike':
      case 'swim':
        bodyContent = `
          <div class="feed-card-title">${a.title}</div>
          <div class="metrics-grid">
            <div class="metric-box"><div class="metric-val">${a.distance}</div><div class="metric-label">Distance</div></div>
            <div class="metric-box"><div class="metric-val">${a.duration}</div><div class="metric-label">Duration</div></div>
            <div class="metric-box"><div class="metric-val">${a.pace}</div><div class="metric-label">${a.type === 'bike' ? 'Speed' : 'Pace'}</div></div>
            ${a.elevation ? `<div class="metric-box"><div class="metric-val">${a.elevation}</div><div class="metric-label">Elevation</div></div>` : ''}
            <div class="metric-box"><div class="metric-val">${a.avgHR}<span style="font-size:11px;color:var(--text-muted)"> bpm</span></div><div class="metric-label">Avg HR</div></div>
            <div class="metric-box"><div class="metric-val">${a.calories.toLocaleString()}</div><div class="metric-label">Calories</div></div>
          </div>
          ${this.renderHRZones(a.hrZones)}
          ${a.splits ? this.renderSplits(a.splits) : ''}
        `;
        break;

      case 'sleep':
        bodyContent = `
          <div class="feed-card-title">${a.title}</div>
          <div class="feed-card-subtitle">${a.subtitle}</div>
          <div class="sleep-breakdown">
            <div class="sleep-stage"><div class="stage-val">${a.duration}</div><div class="stage-label">Total</div></div>
            <div class="sleep-stage" style="border-left:2px solid var(--purple)"><div class="stage-val">${a.deepSleep}</div><div class="stage-label">Deep</div></div>
            <div class="sleep-stage" style="border-left:2px solid var(--cyan)"><div class="stage-val">${a.remSleep}</div><div class="stage-label">REM</div></div>
          </div>
          <div class="metrics-grid">
            <div class="metric-box"><div class="metric-val">${a.efficiency}%</div><div class="metric-label">Efficiency</div></div>
            <div class="metric-box"><div class="metric-val">${a.hrv}<span style="font-size:11px;color:var(--text-muted)">ms</span></div><div class="metric-label">HRV</div></div>
            <div class="metric-box"><div class="metric-val">${a.bodyTemp}</div><div class="metric-label">Temp</div></div>
          </div>
        `;
        break;

      case 'glucose':
        bodyContent = `
          <div class="feed-card-title">${a.title}</div>
          <div class="feed-card-subtitle">${a.subtitle}</div>
          <div class="glucose-highlights">
            <div class="glucose-stat"><div class="g-val" style="color:var(--orange)">${a.avg}</div><div class="g-label">Avg mg/dL</div></div>
            <div class="glucose-stat"><div class="g-val" style="color:var(--green)">${a.tir}%</div><div class="g-label">In Range</div></div>
            <div class="glucose-stat"><div class="g-val">${a.peak}</div><div class="g-label">Peak</div></div>
            <div class="glucose-stat"><div class="g-val" style="color:${a.low > 2 ? 'var(--red)' : 'var(--green)'}">${a.low}%</div><div class="g-label">Low</div></div>
          </div>
          <div class="glucose-chart-wrap"><canvas id="chart-glucose-feed"></canvas></div>
        `;
        break;

      case 'race':
        bodyContent = `
          <div class="feed-card-title">${a.title}</div>
          <div class="feed-card-subtitle">${a.subtitle} · ${a.distance}</div>
          <div class="race-splits">
            <div class="split-box"><div class="split-val">🏊 ${a.swim}</div><div class="split-label">Swim</div></div>
            <div class="split-box"><div class="split-val">${a.t1}</div><div class="split-label">T1</div></div>
            <div class="split-box"><div class="split-val">🚴 ${a.bike}</div><div class="split-label">Bike</div></div>
            <div class="split-box"><div class="split-val">${a.t2}</div><div class="split-label">T2</div></div>
            <div class="split-box"><div class="split-val">🏃 ${a.run}</div><div class="split-label">Run</div></div>
          </div>
          <div class="metrics-grid">
            <div class="metric-box"><div class="metric-val" style="color:var(--green)">${a.placement}</div><div class="metric-label">Overall</div></div>
            <div class="metric-box"><div class="metric-val" style="color:var(--blue)">${a.ageGroup}</div><div class="metric-label">Age Group</div></div>
            <div class="metric-box"><div class="metric-val" style="color:var(--purple)">${a.totalTime}</div><div class="metric-label">Finish</div></div>
          </div>
          ${this.renderHRZones(a.hrZones)}
        `;
        break;

      case 'bloodwork':
        bodyContent = `
          <div class="feed-card-title">${a.title}</div>
          <div class="feed-card-subtitle">${a.subtitle}</div>
          <div class="bloodwork-highlights">
            ${a.highlights.map(h => `
              <div class="bw-highlight">
                <div><div class="bw-name">${h.name}</div><div class="bw-val">${h.value}</div></div>
                <span class="bw-change ${h.status}">${h.change}</span>
              </div>
            `).join('')}
          </div>
        `;
        break;
    }

    return `
      <div class="feed-card fade-in stagger-${(idx % 6) + 1}">
        <div class="feed-card-header">
          <div class="feed-avatar" style="background:${p.avatarColor}">${p.avatar}</div>
          <div>
            <div class="name">${p.name}</div>
            <div class="meta">
              <span>${a.date}</span>
              ${a.device ? `<span class="device-tag">${a.deviceIcon} ${a.device}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="feed-card-body">${bodyContent}</div>
        <div class="feed-card-footer">
          <div class="feed-actions">
            <button class="feed-action liked" onclick="this.classList.toggle('liked')"><span class="action-icon">❤️</span> ${a.likes}</button>
            <button class="feed-action"><span class="action-icon">💬</span> ${a.comments.length}</button>
            <button class="feed-action"><span class="action-icon">↗️</span> Share</button>
          </div>
          <div class="feed-likes">${a.likes} likes</div>
          <div class="feed-comments">
            ${a.comments.slice(0, 2).map(c => `
              <div class="feed-comment">
                <span class="comment-user">${c.user}</span> ${c.text}
                <span class="comment-time">${c.time}</span>
              </div>
            `).join('')}
            ${a.comments.length > 2 ? `<div style="font-size:12px;color:var(--text-muted);cursor:pointer">View all ${a.comments.length} comments</div>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  renderHRZones(zones) {
    if (!zones) return '';
    const colors = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444'];
    const labels = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'];
    return `
      <div class="hr-zones-bar">
        ${zones.map((z, i) => `<div class="hr-zone-segment" style="width:${z}%;background:${colors[i]}"></div>`).join('')}
      </div>
      <div class="hr-zones-legend">
        ${zones.map((z, i) => `<span style="color:${colors[i]}">${labels[i]} ${z}%</span>`).join('')}
      </div>
    `;
  },

  renderSplits(splits) {
    return `
      <div class="splits-list">
        ${splits.map(s => `
          <div class="split-item">
            <span class="split-mile">Mi ${s.mile}</span>
            <span class="split-pace">${s.pace}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ---- Stats ----
  renderStats() {
    const v = DATA.vitals;
    document.getElementById('stats-content').innerHTML = `
      <div class="stats-section">
        <div class="stats-section-title">💜 Heart Rate Variability</div>
        <div class="stats-chart-card">
          <div class="stats-chart-header">
            <div>
              <div class="stats-chart-title">HRV (30 day)</div>
              <div class="stats-chart-subtitle">RMSSD average</div>
            </div>
            <div>
              <div class="stats-chart-value" style="color:var(--purple)">${v.hrv}ms</div>
              <div style="font-size:11px;color:var(--green);text-align:right">↑ +4ms</div>
            </div>
          </div>
          <div class="chart-area"><canvas id="chart-hrv"></canvas></div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title">❤️ Resting Heart Rate</div>
        <div class="stats-chart-card">
          <div class="stats-chart-header">
            <div>
              <div class="stats-chart-title">RHR (30 day)</div>
              <div class="stats-chart-subtitle">Morning average</div>
            </div>
            <div>
              <div class="stats-chart-value" style="color:var(--red)">${v.restingHR} bpm</div>
              <div style="font-size:11px;color:var(--green);text-align:right">↓ -4 bpm</div>
            </div>
          </div>
          <div class="chart-area"><canvas id="chart-rhr"></canvas></div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title">😴 Sleep Score</div>
        <div class="stats-chart-card">
          <div class="stats-chart-header">
            <div>
              <div class="stats-chart-title">Sleep (30 day)</div>
              <div class="stats-chart-subtitle">Oura composite</div>
            </div>
            <div>
              <div class="stats-chart-value" style="color:var(--green)">${v.sleepScore}</div>
              <div style="font-size:11px;color:var(--green);text-align:right">↑ Best: 92</div>
            </div>
          </div>
          <div class="chart-area"><canvas id="chart-sleep"></canvas></div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title">🫁 VO2 Max</div>
        <div class="stats-chart-card">
          <div class="stats-chart-header">
            <div>
              <div class="stats-chart-title">VO2 Max (30 day)</div>
              <div class="stats-chart-subtitle">Garmin estimate</div>
            </div>
            <div>
              <div class="stats-chart-value" style="color:var(--cyan)">${v.vo2max}</div>
              <div style="font-size:11px;color:var(--green);text-align:right">↑ +3 (6mo)</div>
            </div>
          </div>
          <div class="chart-area"><canvas id="chart-vo2"></canvas></div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title">⚡ Training Load</div>
        <div class="stats-chart-card">
          <div class="stats-chart-header">
            <div>
              <div class="stats-chart-title">Fitness vs Fatigue</div>
              <div class="stats-chart-subtitle">CTL / ATL balance</div>
            </div>
            <div class="time-toggle">
              <button class="active">30D</button>
              <button>90D</button>
              <button>1Y</button>
            </div>
          </div>
          <div class="chart-area"><canvas id="chart-fitness"></canvas></div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title">🟠 Glucose Overview</div>
        <div class="stats-chart-card">
          <div class="stats-chart-header">
            <div>
              <div class="stats-chart-title">Weekly Average</div>
              <div class="stats-chart-subtitle">Dexcom G7 · 7 days</div>
            </div>
            <div>
              <div class="stats-chart-value" style="color:var(--orange)">${v.glucoseAvg} <span style="font-size:12px;font-weight:400">mg/dL</span></div>
              <div style="font-size:11px;color:var(--green);text-align:right">${v.glucoseTIR}% TIR</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${DATA.glucoseWeekly.datasets.map(d => `
              <div style="flex:1;min-width:40px;text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:6px">
                <div style="font-size:10px;color:var(--text-muted)">${d.day}</div>
                <div style="font-size:14px;font-weight:700;color:var(--orange)">${d.avg}</div>
                <div style="font-size:9px;color:${d.tir >= 93 ? 'var(--green)' : 'var(--yellow)'}">${d.tir}%</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // ---- Labs ----
  renderLabs() {
    const bw = DATA.bloodwork;
    document.getElementById('labs-content').innerHTML = `
      <div class="labs-header">
        <div>
          <div class="labs-title">🩸 Bloodwork</div>
          <div class="labs-meta">${bw.uploadCount} uploads · Last: ${bw.lastUpdated}</div>
        </div>
        <button class="edit-profile-btn" style="width:auto;padding:8px 16px">Upload Labs</button>
      </div>
      ${bw.biomarkers.map((b, i) => this.renderBiomarkerCard(b, i)).join('')}
    `;
  },

  renderBiomarkerCard(b, idx) {
    const rangeWidth = b.normal[1] - b.normal[0];
    const optStart = ((b.optimal[0] - b.normal[0]) / rangeWidth) * 100;
    const optWidth = ((b.optimal[1] - b.optimal[0]) / rangeWidth) * 100;
    const markerPos = ((b.value - b.normal[0]) / rangeWidth) * 100;
    const changeDir = b.change > 0 ? '+' : '';

    return `
      <div class="biomarker-card fade-in">
        <div class="biomarker-top">
          <div class="biomarker-name">${b.icon} ${b.name}</div>
          <div>
            <span class="biomarker-value">${b.value} <span class="biomarker-unit">${b.unit}</span></span>
            <span class="biomarker-change ${b.change > 0 ? 'positive' : 'negative'}">${changeDir}${b.change}%</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span class="biomarker-status ${b.status}">${b.status}</span>
          <span style="font-size:11px;color:var(--text-muted)">Range: ${b.optimal[0]}–${b.optimal[1]} ${b.unit}</span>
        </div>
        <div class="biomarker-range">
          <div class="biomarker-range-optimal" style="left:${optStart}%;width:${optWidth}%"></div>
          <div class="biomarker-range-marker" style="left:${Math.min(Math.max(markerPos, 5), 95)}%"></div>
        </div>
        <div class="biomarker-chart"><canvas id="sparkline-${idx}"></canvas></div>
      </div>
    `;
  },

  // ---- Navigation ----
  setupNavigation() {
    // Bottom nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Tab bar
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });
  },

  switchTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `${tab}-content`));

    // Lazy-init charts
    if (tab === 'stats' && !this.chartsInitialized.stats) {
      setTimeout(() => {
        CHARTS.initStatsCharts();
        this.chartsInitialized.stats = true;
      }, 100);
    }
    if (tab === 'labs' && !this.chartsInitialized.labs) {
      setTimeout(() => {
        CHARTS.initLabCharts();
        this.chartsInitialized.labs = true;
      }, 100);
    }
  },
};

// Boot
document.addEventListener('DOMContentLoaded', () => APP.init());
