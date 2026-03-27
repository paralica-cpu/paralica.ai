// ============================================================
// data.js — All dummy data for the Health Dashboard
// ============================================================

const DATA = {

  profile: {
    name: "George B.",
    handle: "@georgeberar",
    bio: "Triathlete | Ironman Finisher | Biohacker",
    location: "Santa Barbara, CA",
    avatar: "GB",
    avatarColor: "#6c63ff",
    followers: 1842,
    following: 394,
    activities: 847,
    memberSince: "2021",
    badges: ["🏆 Ironman", "⚡ Top 10%", "💜 Longevity Pro"],
  },

  scores: {
    longevity: {
      value: 87,
      change: +2,
      color: "#a855f7",
      label: "Longevity",
      factors: [
        { name: "HRV Trend", value: 91, icon: "💜", weight: 0.25 },
        { name: "Resting HR", value: 94, icon: "❤️", weight: 0.20 },
        { name: "Glucose Variability", value: 88, icon: "🟠", weight: 0.20 },
        { name: "Inflammation (CRP)", value: 95, icon: "🔬", weight: 0.15 },
        { name: "Lipid Panel", value: 82, icon: "🧪", weight: 0.10 },
        { name: "Sleep Consistency", value: 79, icon: "😴", weight: 0.10 },
      ]
    },
    health: {
      value: 91,
      change: +3,
      color: "#22c55e",
      label: "Health",
      factors: [
        { name: "Sleep Quality", value: 92, icon: "😴", weight: 0.25 },
        { name: "Whoop Recovery", value: 89, icon: "💚", weight: 0.20 },
        { name: "Glucose TIR", value: 94, icon: "🟠", weight: 0.20 },
        { name: "Recent Bloodwork", value: 93, icon: "🩸", weight: 0.20 },
        { name: "Body Composition", value: 88, icon: "⚖️", weight: 0.15 },
      ]
    },
    performance: {
      value: 83,
      change: -1,
      color: "#3b82f6",
      label: "Performance",
      factors: [
        { name: "VO2 Max", value: 85, icon: "🫁", weight: 0.25 },
        { name: "Training Load", value: 78, icon: "⚡", weight: 0.20 },
        { name: "Race Results", value: 90, icon: "🏆", weight: 0.20 },
        { name: "Strain/Recovery Balance", value: 82, icon: "⚖️", weight: 0.20 },
        { name: "Recent PRs", value: 80, icon: "🎯", weight: 0.15 },
      ]
    }
  },

  vitals: {
    hrv: 68,
    restingHR: 52,
    vo2max: 52,
    sleepScore: 92,
    glucoseAvg: 95,
    glucoseTIR: 94,
    whoopRecovery: 89,
    whoopStrain: 18.4,
    steps: 11240,
    activeCalories: 847,
    bodyTemp: 98.1,
    ouraReadiness: 88,
  },

  // 30-day trend data
  trends: {
    hrv: [54, 58, 61, 55, 62, 65, 63, 68, 64, 70, 67, 65, 72, 68, 74, 71, 68, 75, 70, 73, 69, 72, 71, 68, 74, 70, 72, 68, 71, 68],
    restingHR: [56, 55, 57, 54, 55, 53, 54, 52, 53, 51, 52, 53, 51, 52, 50, 51, 52, 50, 51, 52, 53, 51, 52, 53, 52, 51, 52, 53, 52, 52],
    sleepScore: [78, 82, 75, 88, 91, 84, 79, 85, 90, 87, 83, 88, 92, 85, 80, 86, 90, 88, 84, 87, 91, 89, 85, 88, 92, 86, 83, 89, 91, 92],
    vo2max: [49, 49, 50, 50, 50, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    trainingLoad: [280, 310, 290, 340, 380, 350, 320, 360, 410, 390, 370, 400, 430, 400, 380, 420, 450, 420, 400, 440, 460, 440, 420, 450, 470, 450, 430, 460, 480, 460],
    fitness: [42, 43, 44, 45, 46, 47, 47, 48, 49, 50, 50, 51, 52, 52, 52, 53, 54, 54, 54, 55, 56, 56, 56, 57, 57, 58, 58, 58, 58, 58],
    fatigue: [45, 48, 46, 52, 58, 55, 50, 54, 61, 59, 55, 60, 65, 61, 57, 63, 67, 63, 59, 65, 70, 67, 63, 68, 71, 68, 64, 69, 72, 70],
  },

  // 24h glucose curve (5-min intervals, 288 points simplified to 48)
  glucose24h: (() => {
    const base = [92, 90, 89, 88, 88, 87, 88, 89, 91,  // 0-4am (sleep)
      110, 125, 130, 118, 105, 98, 95, 93,              // breakfast spike ~7am
      95, 96, 97, 96, 95,                               // mid morning stable
      130, 145, 138, 120, 105, 98, 95,                  // lunch spike ~12pm
      94, 93, 95, 96, 97, 96,                           // afternoon
      128, 142, 135, 120, 108, 98, 95,                  // dinner spike ~7pm
      94, 92, 91, 90, 89];                              // evening/sleep
    return base;
  })(),

  // Weekly glucose pattern (7 days overlay)
  glucoseWeekly: {
    labels: Array.from({length: 48}, (_, i) => {
      const h = Math.floor(i * 30 / 60);
      const m = (i * 30) % 60;
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    }),
    datasets: [
      { day: 'Mon', avg: 94, tir: 95 },
      { day: 'Tue', avg: 97, tir: 93 },
      { day: 'Wed', avg: 92, tir: 96 },
      { day: 'Thu', avg: 96, tir: 94 },
      { day: 'Fri', avg: 98, tir: 92 },
      { day: 'Sat', avg: 103, tir: 89 },
      { day: 'Sun', avg: 95, tir: 94 },
    ]
  },

  bloodwork: {
    lastUpdated: "March 15, 2026",
    uploadCount: 12,
    biomarkers: [
      {
        name: "Testosterone",
        value: 742,
        unit: "ng/dL",
        optimal: [600, 900],
        normal: [300, 1000],
        status: "optimal",
        change: +15,
        history: [520, 545, 580, 612, 645, 680, 710, 742],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "⚡"
      },
      {
        name: "Cortisol (AM)",
        value: 14.2,
        unit: "μg/dL",
        optimal: [10, 18],
        normal: [6, 23],
        status: "optimal",
        change: -8,
        history: [18.4, 17.1, 16.8, 15.9, 15.2, 14.8, 14.5, 14.2],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "🔬"
      },
      {
        name: "CRP (hs)",
        value: 0.42,
        unit: "mg/L",
        optimal: [0, 1.0],
        normal: [0, 3.0],
        status: "optimal",
        change: -22,
        history: [1.8, 1.4, 1.1, 0.9, 0.75, 0.62, 0.51, 0.42],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "🛡️"
      },
      {
        name: "Vitamin D",
        value: 68,
        unit: "ng/mL",
        optimal: [50, 80],
        normal: [30, 100],
        status: "optimal",
        change: +12,
        history: [42, 48, 52, 57, 61, 65, 67, 68],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "☀️"
      },
      {
        name: "LDL Cholesterol",
        value: 98,
        unit: "mg/dL",
        optimal: [0, 100],
        normal: [0, 130],
        status: "optimal",
        change: -5,
        history: [118, 114, 110, 108, 105, 103, 100, 98],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "🫀"
      },
      {
        name: "HDL Cholesterol",
        value: 72,
        unit: "mg/dL",
        optimal: [60, 100],
        normal: [40, 100],
        status: "optimal",
        change: +8,
        history: [58, 61, 64, 66, 68, 69, 71, 72],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "💚"
      },
      {
        name: "Fasting Glucose",
        value: 84,
        unit: "mg/dL",
        optimal: [70, 90],
        normal: [70, 100],
        status: "optimal",
        change: -3,
        history: [91, 90, 89, 88, 87, 86, 85, 84],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "🍬"
      },
      {
        name: "HbA1c",
        value: 4.9,
        unit: "%",
        optimal: [4.5, 5.3],
        normal: [4.5, 5.6],
        status: "optimal",
        change: -2,
        history: [5.2, 5.1, 5.1, 5.0, 5.0, 4.9, 4.9, 4.9],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "🧬"
      },
      {
        name: "IGF-1",
        value: 218,
        unit: "ng/mL",
        optimal: [175, 250],
        normal: [115, 307],
        status: "optimal",
        change: +6,
        history: [188, 192, 198, 204, 210, 212, 215, 218],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "🔭"
      },
      {
        name: "Triglycerides",
        value: 68,
        unit: "mg/dL",
        optimal: [0, 80],
        normal: [0, 150],
        status: "optimal",
        change: -14,
        history: [98, 92, 86, 82, 78, 74, 71, 68],
        historyDates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Feb", "Mar"],
        icon: "🧪"
      },
    ]
  },

  activities: [
    {
      id: 1,
      type: "run",
      title: "Morning Run",
      date: "Today, 6:42 AM",
      distance: "8.2 mi",
      pace: "7:12/mi",
      duration: "59:08",
      elevation: "428 ft",
      calories: 724,
      avgHR: 148,
      maxHR: 172,
      hrZones: [5, 12, 28, 38, 17], // z1-z5 %
      device: "Garmin",
      deviceIcon: "⌚",
      mapEmoji: "🗺️",
      splits: [
        { mile: 1, pace: "7:24" }, { mile: 2, pace: "7:18" }, { mile: 3, pace: "7:15" },
        { mile: 4, pace: "7:08" }, { mile: 5, pace: "7:09" }, { mile: 6, pace: "7:06" },
        { mile: 7, pace: "7:02" }, { mile: 8, pace: "6:58" },
      ],
      likes: 47,
      comments: [
        { user: "Sarah M.", avatar: "SM", text: "Beast mode! 🔥 Sub-7 miles are coming!", time: "2h ago" },
        { user: "Coach Dave", avatar: "CD", text: "Great tempo work George. HR zones look perfect for this phase.", time: "1h ago" },
        { user: "Mike T.", avatar: "MT", text: "Those splits though 👀 getting faster every week", time: "45m ago" },
      ],
    },
    {
      id: 2,
      type: "sleep",
      title: "Sleep Score: 92 🔥",
      date: "Today",
      subtitle: "Best sleep in 30 days",
      sleepScore: 92,
      duration: "7h 52m",
      deepSleep: "1h 48m",
      remSleep: "2h 12m",
      efficiency: 97,
      hrv: 68,
      bodyTemp: "+0.1°F",
      device: "Oura",
      deviceIcon: "💍",
      likes: 31,
      comments: [
        { user: "Sarah M.", avatar: "SM", text: "Sleep queen 👑 I need to fix my sleep schedule", time: "3h ago" },
        { user: "Dr. Chen", avatar: "DC", text: "Excellent recovery! HRV at 68 is impressive.", time: "2h ago" },
      ],
    },
    {
      id: 3,
      type: "glucose",
      title: "Glucose Summary",
      date: "Yesterday",
      subtitle: "94% Time In Range · Avg 95 mg/dL",
      avg: 95,
      tir: 94,
      low: 0,
      high: 6,
      peak: 142,
      device: "Dexcom G7",
      deviceIcon: "📡",
      likes: 24,
      comments: [
        { user: "Coach Dave", avatar: "CD", text: "Metabolic flexibility showing! Minimal spikes despite the training load.", time: "5h ago" },
      ],
    },
    {
      id: 4,
      type: "race",
      title: "IRONMAN California 🏆",
      date: "Oct 26, 2025",
      subtitle: "Official Finish · 11:42:33",
      totalTime: "11:42:33",
      swim: "1:12:18",
      t1: "4:42",
      bike: "5:45:11",
      t2: "3:28",
      run: "4:36:54",
      placement: "287 / 1,842",
      ageGroup: "12 / 94 (M35-39)",
      distance: "140.6 mi",
      device: "Garmin",
      deviceIcon: "⌚",
      hrZones: [2, 8, 35, 42, 13],
      likes: 218,
      comments: [
        { user: "Sarah M.", avatar: "SM", text: "INCREDIBLE!! You crushed it!! 🏆🔥💪", time: "Oct 26" },
        { user: "Coach Dave", avatar: "CD", text: "Perfect execution. Pacing was spot on for your fitness level. Sub-11 is next.", time: "Oct 27" },
        { user: "Mike T.", avatar: "MT", text: "Top 15% AG?! That's elite man. Congrats!", time: "Oct 27" },
        { user: "Emma R.", avatar: "ER", text: "You're an inspiration George! 😭🙌", time: "Oct 27" },
        { user: "Dr. Chen", avatar: "DC", text: "Remarkable that your glucose stayed in range throughout! Great metabolic control.", time: "Oct 28" },
      ],
    },
    {
      id: 5,
      type: "bloodwork",
      title: "New Labs Uploaded 🩸",
      date: "Mar 15, 2026",
      subtitle: "March 2026 Panel · 10 biomarkers · All markers optimal",
      highlights: [
        { name: "Testosterone", value: "742 ng/dL", change: "+15%", status: "up" },
        { name: "CRP", value: "0.42 mg/L", change: "-22%", status: "down-good" },
        { name: "Vitamin D", value: "68 ng/mL", change: "+12%", status: "up" },
        { name: "HbA1c", value: "4.9%", change: "-2%", status: "down-good" },
      ],
      device: "Quest Diagnostics",
      deviceIcon: "🔬",
      likes: 89,
      comments: [
        { user: "Dr. Chen", avatar: "DC", text: "Outstanding results! CRP under 0.5 and testosterone in optimal range. Keep doing what you're doing.", time: "Mar 15" },
        { user: "Sarah M.", avatar: "SM", text: "Biohacker mode ACTIVATED 🧬", time: "Mar 15" },
        { user: "Coach Dave", avatar: "CD", text: "Those hormones are primed for a great race season!", time: "Mar 16" },
      ],
    },
    {
      id: 6,
      type: "bike",
      title: "Long Ride — Zone 2",
      date: "Mar 24, 2026",
      distance: "62.4 mi",
      pace: "19.8 mph",
      duration: "3:09:42",
      elevation: "2,840 ft",
      calories: 2180,
      avgHR: 134,
      maxHR: 158,
      hrZones: [8, 45, 35, 10, 2],
      device: "Garmin",
      deviceIcon: "⌚",
      likes: 63,
      comments: [
        { user: "Mike T.", avatar: "MT", text: "Z2 king. What's your target watts for Ironman?", time: "Mar 24" },
        { user: "Coach Dave", avatar: "CD", text: "Perfect aerobic base work. 3+ hours at 134 bpm — fat adaptation is real.", time: "Mar 24" },
        { user: "Emma R.", avatar: "ER", text: "62 miles before breakfast? 😅", time: "Mar 25" },
      ],
    },
    {
      id: 7,
      type: "swim",
      title: "Masters Swim — Speed Work",
      date: "Mar 23, 2026",
      distance: "3,200 m",
      pace: "1:42/100m",
      duration: "54:38",
      calories: 512,
      avgHR: 142,
      maxHR: 168,
      hrZones: [3, 10, 22, 48, 17],
      device: "Garmin",
      deviceIcon: "⌚",
      likes: 41,
      comments: [
        { user: "Sarah M.", avatar: "SM", text: "1:42 pace?! I can't even do that for 100m 😂", time: "Mar 23" },
        { user: "Coach Dave", avatar: "CD", text: "Threshold intervals paying off. You should see 1:35/100 by summer.", time: "Mar 23" },
      ],
    },
  ],

  stories: [
    { label: "HRV", value: "68ms", icon: "💜", color: "#a855f7", change: "+4%" },
    { label: "Sleep", value: "92", icon: "😴", color: "#22c55e", change: "+3pts" },
    { label: "Glucose", value: "95", icon: "🟠", color: "#f97316", change: "94% TIR" },
    { label: "Steps", value: "11.2k", icon: "👟", color: "#3b82f6", change: "+8%" },
    { label: "Recovery", value: "89%", icon: "⚡", color: "#22c55e", change: "↑ High" },
    { label: "Strain", value: "18.4", icon: "🔥", color: "#ef4444", change: "↑ Heavy" },
  ],

  integrations: [
    { name: "Garmin", icon: "⌚", color: "#00a1e0", connected: true, lastSync: "2m ago" },
    { name: "Oura", icon: "💍", color: "#b08a6e", connected: true, lastSync: "12m ago" },
    { name: "Whoop", icon: "⚡", color: "#f97316", connected: true, lastSync: "5m ago" },
    { name: "Apple Health", icon: "🍎", color: "#ff3b30", connected: true, lastSync: "1m ago" },
    { name: "Dexcom G7", icon: "📡", color: "#00c7b1", connected: true, lastSync: "4m ago" },
    { name: "Quest Dx", icon: "🔬", color: "#9333ea", connected: true, lastSync: "Mar 15" },
  ],
};
