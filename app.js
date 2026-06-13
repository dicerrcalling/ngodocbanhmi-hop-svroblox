// ==========================================
// CẤU HÌNH & THÔNG TIN TRÒ CHƠI MẶC ĐỊNH
// ==========================================
const GAME_PRESETS = {
  "98664161516921": { name: "Catch a Monster", maxPlayers: 12 },
  "2753915549": { name: "Blox Fruits", maxPlayers: 12 },
  "920587237": { name: "Adopt Me!", maxPlayers: 48 },
  "1377239462": { name: "Brookhaven RP", maxPlayers: 15 },
  "155615604": { name: "Prison Life", maxPlayers: 30 }
};

// ==========================================
// THÔNG TIN BẢNG GIÁ DỊCH VỤ THEO GAME
// ==========================================
const GAME_SERVICES = {
  "98664161516921": {
    gameName: "Catch a Monster",
    title: "BẢNG GIÁ KÉO DUNGEON & SĂN BOSS",
    desc: "Cam kết cày tay an toàn 100%, bảo mật tuyệt đối. Hỗ trợ bao cắm acc chạy rảnh tay trọn gói.",
    verifications: [
      "✔ BAO CẮM ACC CHẠY",
      "✔ AN TOÀN 100% (KHÔNG HACK)",
      "✔ BẢO MẬT THÔNG TIN ACC",
      "✔ HOÀN THÀNH NHANH TRONG NGÀY"
    ],
    headers: ["DỊCH VỤ / GÓI CÀY", "GIÁ DÙNG KEY CỦA BẠN", "GIÁ DÙNG KEY CỦA SHOP", "CAM KẾT & GHI CHÚ"],
    rows: [
      {
        name: "Dungeon Thường",
        badge: "Normal",
        badgeClass: "normal",
        price1: "1.000đ",
        price1Suffix: "/ lượt",
        price2: "2.000đ",
        price2Suffix: "/ lượt (+1k)",
        note: "shop cắm acc chạy"
      },
      {
        name: "Dungeon Khó",
        badge: "Hard",
        badgeClass: "hard",
        price1: "2.000đ",
        price1Suffix: "/ lượt",
        price2: "3.000đ",
        price2Suffix: "/ lượt (+1k)",
        note: "shop cắm acc chạy"
      },
      {
        name: "Dungeon Ác Mộng",
        badge: "Nightmare",
        badgeClass: "nightmare",
        price1: "3.000đ",
        price1Suffix: "/ lượt",
        price2: "4.000đ",
        price2Suffix: "/ lượt (+1k)",
        note: "shop cắm acc chạy, cày tay an toàn"
      },
      {
        name: "Cày Token Dungeon",
        badge: "Tokens",
        badgeClass: "tokens",
        price1: "1.000đ",
        price1Suffix: "/ 1.000 Token",
        price2: "2.000đ",
        price2Suffix: "/ 1.000 Token (+1k)",
        note: "Cày token dungeon số lượng lớn, hỗ trợ thêm key nếu cần"
      },
      {
        name: "Săn Mảnh Boss Map",
        badge: "Fragments",
        badgeClass: "fragments",
        price1: "50.000đ",
        price1Suffix: "/ 160 mảnh",
        price2: "—",
        price2Suffix: "(Không cần chìa khóa)",
        note: "Săn mảnh boss map nhanh, an toàn"
      }
    ]
  }
};

// ==========================================
// TRẠNG THÁI HỆ THỐNG (SYSTEM STATE)
// ==========================================
let state = {
  placeId: "98664161516921",
  gameName: "Catch a Monster",
  maxPlayers: 12,
  
  // Lọc & Sắp xếp
  activeFilter: localStorage.getItem('hophub_active_filter') || "all", 
  activeSort: "asc",   
  viewMode: localStorage.getItem('hophub_view_mode') || 'GRID',
  theme: localStorage.getItem('hophub_theme') || 'dark',
  activeTab: 'servers',
  
  // Dữ liệu Server
  allServers: [],
  filteredServers: [],
  visibleCount: 12,
  openedServers: new Set(JSON.parse(localStorage.getItem('hophub_opened_servers') || '[]')),
  
  // Auto-Refresh
  autoRefreshEnabled: localStorage.getItem('hophub_auto_refresh_enabled') === 'true',
  autoRefreshTimer: 30,
  autoRefreshLoop: null,
  
  // Auto-Hop
  autoHopEnabled: localStorage.getItem('hophub_auto_hop_enabled') === 'true',
  autoHopTimer: parseInt(localStorage.getItem('hophub_auto_hop_timer_val') || '60'),
  autoHopLoop: null,
  hopsCount: parseInt(localStorage.getItem('hophub_hops_today') || '0'),
  lastHopReset: localStorage.getItem('hophub_hops_last_reset') || ''
};

// ==========================================
// KHỞI CHẠY KHI TRANG TẢI XONG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupThemeColorCustomizer();
  setupViewMode();
  setupTabs();
  setupHopsLimit();
  setupFAQ();
  setupEventListeners();
  
  // Tải game mặc định (Catch a Monster)
  loadGame(state.placeId, state.gameName);
  
  // Khởi chạy đếm ngược Boss Rift & Timers
  startClockAndTimers();
});

// ==========================================
// CÀI ĐẶT GIAO DIỆN SÁNG / TỐI (THEME)
// ==========================================
function setupTheme() {
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;
  
  const sunIco = toggleBtn.querySelector('.sun-icon');
  const moonIco = toggleBtn.querySelector('.moon-icon');
  
  if (state.theme === 'light') {
    body.classList.add('light-theme');
    if (sunIco) sunIco.style.display = 'none';
    if (moonIco) moonIco.style.display = 'block';
  } else {
    body.classList.remove('light-theme');
    if (sunIco) sunIco.style.display = 'block';
    if (moonIco) moonIco.style.display = 'none';
  }
  
  toggleBtn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-theme');
    state.theme = isLight ? 'light' : 'dark';
    localStorage.setItem('hophub_theme', state.theme);
    
    if (isLight) {
      if (sunIco) sunIco.style.display = 'none';
      if (moonIco) moonIco.style.display = 'block';
      showToast('success', 'Đã chuyển sang giao diện Sáng!');
    } else {
      if (sunIco) sunIco.style.display = 'block';
      if (moonIco) moonIco.style.display = 'none';
      showToast('success', 'Đã chuyển sang giao diện Tối!');
    }
  });
}

// ==========================================
// CÀI ĐẶT CHẾ ĐỘ HIỂN THỊ (GRID / LIST)
// ==========================================
function setupViewMode() {
  const grid = document.getElementById('servers-grid');
  const toggle = document.getElementById('view-mode-toggle');
  if (!toggle) return;
  
  const buttons = toggle.querySelectorAll('.segment-btn');
  buttons.forEach(btn => {
    if (btn.dataset.value === state.viewMode) {
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-checked', 'false');
    }
    
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      
      state.viewMode = btn.dataset.value;
      localStorage.setItem('hophub_view_mode', state.viewMode);
      
      if (grid) {
        if (state.viewMode === 'LIST') {
          grid.classList.add('view-list-active');
        } else {
          grid.classList.remove('view-list-active');
        }
      }
      renderGrid();
    });
  });
  
  // Áp dụng class ban đầu
  if (state.viewMode === 'LIST' && grid) {
    grid.classList.add('view-list-active');
  }
}

// ==========================================
// CÀI ĐẶT CHUYỂN TABS (SERVERS / GUIDE)
// ==========================================
function setupTabs() {
  // 1. Chuyển chế độ xem chính trên Navbar (Server Hop Tool / Dịch vụ Dungeon)
  const navBtnServers = document.getElementById('nav-btn-servers');
  const navBtnServices = document.getElementById('nav-btn-services');
  const dashboardView = document.getElementById('dashboard-view');
  const dungeonView = document.getElementById('dungeon-view');

  if (navBtnServers && navBtnServices && dashboardView && dungeonView) {
    navBtnServers.addEventListener('click', (e) => {
      e.preventDefault();
      navBtnServices.classList.remove('active');
      navBtnServers.classList.add('active');
      dungeonView.style.display = 'none';
      dashboardView.style.display = 'grid'; // Reverts to desktop split display
      state.activeTab = 'servers';
    });

    navBtnServices.addEventListener('click', (e) => {
      e.preventDefault();
      navBtnServers.classList.remove('active');
      navBtnServices.classList.add('active');
      dashboardView.style.display = 'none';
      dungeonView.style.display = 'grid'; // Show split-screen grid layout
      state.activeTab = 'services';
      renderServices(state.placeId, state.gameName);
    });
  }

  // 2. Chuyển tab nội dung bên phải (Danh sách Server / Hướng dẫn chi tiết)
  const btnServers = document.getElementById('tab-btn-servers');
  const btnGuide = document.getElementById('tab-btn-guide');
  const paneServers = document.getElementById('tab-content-servers');
  const paneGuide = document.getElementById('tab-content-guide');

  const innerTabs = [
    { btn: btnServers, pane: paneServers },
    { btn: btnGuide, pane: paneGuide }
  ];

  innerTabs.forEach(tab => {
    if (tab.btn && tab.pane) {
      tab.btn.addEventListener('click', () => {
        innerTabs.forEach(t => {
          if (t.btn) t.btn.classList.remove('active');
          if (t.pane) t.pane.style.display = 'none';
        });
        tab.btn.classList.add('active');
        tab.pane.style.display = 'block';
      });
    }
  });
  
  // Click copy mã script Lua
  const btnCopyLua = document.getElementById('btn-copy-lua');
  if (btnCopyLua) {
    btnCopyLua.addEventListener('click', () => {
      const textarea = btnCopyLua.previousElementSibling;
      if (textarea) {
        navigator.clipboard.writeText(textarea.value)
          .then(() => showToast('success', 'Đã sao chép mã script Lua thành công!'))
          .catch(() => showToast('error', 'Lỗi sao chép mã script.'));
      }
    });
  }
}

// ==========================================
// KHỞI TẠO LƯỢT HOPS TRONG NGÀY
// ==========================================
function setupHopsLimit() {
  const today = new Date().toDateString();
  if (state.lastHopReset !== today) {
    state.hopsCount = 0;
    state.lastHopReset = today;
    localStorage.setItem('hophub_hops_today', '0');
    localStorage.setItem('hophub_hops_last_reset', today);
  }
  
  const val = document.getElementById('hops-today-value');
  if (val) val.textContent = state.hopsCount;
}

function recordHop(jobId) {
  state.openedServers.add(jobId);
  localStorage.setItem('hophub_opened_servers', JSON.stringify([...state.openedServers]));
  
  state.hopsCount++;
  localStorage.setItem('hophub_hops_today', state.hopsCount);
  
  const val = document.getElementById('hops-today-value');
  if (val) val.textContent = state.hopsCount;
}

// ==========================================
// COLLAPSIBLE FAQ ACCORDION
// ==========================================
function setupFAQ() {
  const toggle = document.getElementById('faq-toggle');
  const content = document.getElementById('faq-content');
  const chevron = document.querySelector('.faq-chevron');
  
  if (toggle && content && chevron) {
    toggle.addEventListener('click', () => {
      const isHidden = content.classList.toggle('hidden');
      chevron.classList.toggle('active', !isHidden);
    });
  }
}

// ==========================================
// TÍNH TOÁN BOSS COUNTDOWN & ĐỒNG HỒ
// ==========================================
function startClockAndTimers() {
  // Đồng hồ chạy liên tục
  setInterval(() => {
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('vi-VN', { hour12: true });
    }
  }, 1000);

  // Đếm ngược Sự kiện / Boss theo từng Game linh hoạt
  setInterval(() => {
    const countdownEl = document.getElementById('boss-countdown');
    if (countdownEl) {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      
      let remSecs = 0;
      const game = state.gameName.toLowerCase();
      
      if (game.includes('monster')) {
        // Catch a Monster: Boss Rift chu kỳ 15 phút (:00, :15, :30, :45)
        const totalSecs = (mins * 60) + secs;
        const cycleSecs = 15 * 60; // 900 giây
        remSecs = cycleSecs - (totalSecs % cycleSecs);
      } else if (game.includes('fruits')) {
        // Blox Fruits: Factory Raid mở mỗi 2 giờ chẵn hệ thống (0h, 2h, 4h, 6h, 8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h)
        let nextHour = hours;
        if (hours % 2 === 0) {
          nextHour = hours + 2;
        } else {
          nextHour = hours + 1;
        }
        
        const targetTime = new Date(now);
        targetTime.setHours(nextHour, 0, 0, 0);
        remSecs = Math.max(0, Math.floor((targetTime - now) / 1000));
      } else if (game.includes('adopt')) {
        // Adopt Me!: Rotations chu kỳ 30 phút (:00, :30)
        const totalSecs = (mins * 60) + secs;
        const cycleSecs = 30 * 60; // 1800 giây
        remSecs = cycleSecs - (totalSecs % cycleSecs);
      } else if (game.includes('brookhaven')) {
        // Brookhaven RP: Bank robbery reset chu kỳ 20 phút (:00, :20, :40)
        const totalSecs = (mins * 60) + secs;
        const cycleSecs = 20 * 60; // 1200 giây
        remSecs = cycleSecs - (totalSecs % cycleSecs);
      } else if (game.includes('prison')) {
        // Prison Life: Prison escape/airdrop chu kỳ 10 phút (:00, :10, :20, :30, :40, :50)
        const totalSecs = (mins * 60) + secs;
        const cycleSecs = 10 * 60; // 600 giây
        remSecs = cycleSecs - (totalSecs % cycleSecs);
      } else {
        // Game khác: Chu kỳ Reset hourly 60 phút
        const totalSecs = (mins * 60) + secs;
        const cycleSecs = 60 * 60; // 3600 giây
        remSecs = cycleSecs - (totalSecs % cycleSecs);
      }
      
      let displayMins = Math.floor(remSecs / 60);
      let displaySecs = remSecs % 60;
      
      if (displayMins >= 60) {
        let displayHours = Math.floor(displayMins / 60);
        displayMins = displayMins % 60;
        countdownEl.textContent = `${displayHours.toString().padStart(2, '0')}:${displayMins.toString().padStart(2, '0')}:${displaySecs.toString().padStart(2, '0')}`;
      } else {
        countdownEl.textContent = `${displayMins.toString().padStart(2, '0')}:${displaySecs.toString().padStart(2, '0')}`;
      }
    }
    
    // Ticking loops cho auto-refresh & auto-hop
    tickAutoRefresh();
    tickAutoHop();
  }, 1000);
}

// ==========================================
// HÀNG LOẠT EVENTS LIÊN KẾT GIAO DIỆN
// ==========================================
function setupEventListeners() {
  // 1. Dán Link / Place ID (Hop Server tab)
  const btnLoad = document.getElementById('btn-load-game');
  const inputUrl = document.getElementById('roblox-game-url');
  
  const triggerLoad = () => {
    const val = inputUrl.value.trim();
    if (!val) return;
    
    const parsed = parseRobloxInput(val);
    if (parsed) {
      loadGame(parsed.placeId, parsed.name);
    } else {
      showToast('error', 'Đường dẫn hoặc Place ID Roblox không hợp lệ!');
    }
  };
  
  if (btnLoad) btnLoad.addEventListener('click', triggerLoad);
  if (inputUrl) {
    inputUrl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') triggerLoad();
    });
  }

  // 1b. Dán Link / Place ID (Services tab)
  const btnLoadServices = document.getElementById('btn-load-game-services');
  const inputUrlServices = document.getElementById('roblox-game-url-services');
  
  const triggerLoadServices = () => {
    const val = inputUrlServices.value.trim();
    if (!val) return;
    
    const parsed = parseRobloxInput(val);
    if (parsed) {
      loadGame(parsed.placeId, parsed.name);
    } else {
      showToast('error', 'Đường dẫn hoặc Place ID Roblox không hợp lệ!');
    }
  };
  
  if (btnLoadServices) btnLoadServices.addEventListener('click', triggerLoadServices);
  if (inputUrlServices) {
    inputUrlServices.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') triggerLoadServices();
    });
  }
  
  // 2. Presets gợi ý (Both tabs via unified event handler)
  document.querySelectorAll('.cyber-preset-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const placeId = this.dataset.placeid;
      const name = this.dataset.name;
      loadGame(placeId, name);
    });
  });
  
  // 3. Bộ lọc số lượng người chơi (Segmented control)
  const filterChips = document.querySelectorAll('#filter-players .segment-btn');
  filterChips.forEach(chip => {
    // Đồng bộ trạng thái active ban đầu từ state
    if (chip.dataset.value === state.activeFilter) {
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
    } else {
      chip.classList.remove('active');
      chip.setAttribute('aria-checked', 'false');
    }

    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
      
      state.activeFilter = chip.dataset.value;
      localStorage.setItem('hophub_active_filter', state.activeFilter);
      state.visibleCount = 12; // reset phân trang
      processAndRenderServers();
    });
  });
  
  // 4. Chọn sắp xếp
  const sortSelect = document.getElementById('server-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.activeSort = sortSelect.value;
      processAndRenderServers();
    });
  }
  
  // 5. Đồng bộ / Refresh tay
  const refreshBtn = document.getElementById('manual-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadGame(state.placeId, state.gameName);
    });
  }
  
  // 6. Auto-Refresh checkbox listener
  const autoRefreshCheck = document.getElementById('server-hop-auto-refresh');
  if (autoRefreshCheck) {
    autoRefreshCheck.checked = state.autoRefreshEnabled;
    document.getElementById('auto-refresh-timer').textContent = `${state.autoRefreshTimer}s`;

    autoRefreshCheck.addEventListener('change', (e) => {
      state.autoRefreshEnabled = e.target.checked;
      localStorage.setItem('hophub_auto_refresh_enabled', state.autoRefreshEnabled);
      state.autoRefreshTimer = 30;
      document.getElementById('auto-refresh-timer').textContent = `30s`;
      
      if (state.autoRefreshEnabled) {
        showToast('info', 'Đã kích hoạt tự động quét danh sách sau mỗi 30 giây.');
      }
    });
  }
  
  // 7. Auto-Hop checkbox listener
  const autoHopCheck = document.getElementById('server-hop-auto-random');
  const timerSelect = document.getElementById('server-hop-timer-select');
  const countdownSpan = document.getElementById('auto-hop-countdown-span');
  
  if (autoHopCheck && timerSelect) {
    autoHopCheck.checked = state.autoHopEnabled;
    timerSelect.value = localStorage.getItem('hophub_auto_hop_timer_val') || '60';
    if (state.autoHopEnabled && countdownSpan) {
      countdownSpan.textContent = ` (${state.autoHopTimer}s)`;
    }

    autoHopCheck.addEventListener('change', (e) => {
      state.autoHopEnabled = e.target.checked;
      localStorage.setItem('hophub_auto_hop_enabled', state.autoHopEnabled);
      if (state.autoHopEnabled) {
        state.autoHopTimer = parseInt(timerSelect.value);
        if (countdownSpan) countdownSpan.textContent = ` (${state.autoHopTimer}s)`;
        showToast('info', `Tự động nhảy phòng đã kích hoạt. Quá trình bắt đầu sau ${state.autoHopTimer} giây.`);
      } else {
        if (countdownSpan) countdownSpan.textContent = '';
      }
    });
    
    timerSelect.addEventListener('change', () => {
      localStorage.setItem('hophub_auto_hop_timer_val', timerSelect.value);
      if (state.autoHopEnabled) {
        state.autoHopTimer = parseInt(timerSelect.value);
        if (countdownSpan) countdownSpan.textContent = ` (${state.autoHopTimer}s)`;
        showToast('info', `Đã đổi thời gian tự động nhảy sang ${state.autoHopTimer} giây.`);
      }
    });
  }
  
  // 8. Auto Hop Nhanh button click
  const quickJoinBtn = document.getElementById('quick-join-btn');
  if (quickJoinBtn) {
    quickJoinBtn.addEventListener('click', () => {
      performQuickJoin();
    });
  }
  
  // 9. Phân trang xem thêm
  const showMoreBtn = document.getElementById('show-more-btn');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      state.visibleCount += 12;
      renderGrid();
    });
  }
}

// ==========================================
// PHÂN TÍCH LINK & ID ROBLOX
// ==========================================
function parseRobloxInput(input) {
  input = input.trim();
  if (!input) return null;

  // Nếu chỉ nhập Place ID số trực tiếp
  if (/^\d+$/.test(input)) {
    return {
      placeId: input,
      name: GAME_PRESETS[input] ? GAME_PRESETS[input].name : `Game #${input}`
    };
  }

  // Phân tích regex
  const match = input.match(/roblox\.com\/games\/(\d+)(?:\/([a-zA-Z0-9-]+))?/i);
  if (match) {
    const parsedId = match[1];
    let gameTitle = "";
    
    if (GAME_PRESETS[parsedId]) {
      gameTitle = GAME_PRESETS[parsedId].name;
    } else if (match[2]) {
      gameTitle = match[2].replace(/-/g, ' ');
      gameTitle = gameTitle.replace(/\b\w/g, c => c.toUpperCase());
    } else {
      gameTitle = `Game #${parsedId}`;
    }

    return {
      placeId: parsedId,
      name: gameTitle
    };
  }

  return null;
}

// ==========================================
// ĐỒNG BỘ GIAO DIỆN CHỌN GAME TRÊN CẢ 2 TAB
// ==========================================
function syncGameSelectorUI(placeId, name) {
  const inputUrl = document.getElementById('roblox-game-url');
  const inputUrlServices = document.getElementById('roblox-game-url-services');
  
  let gameUrl = `https://www.roblox.com/games/${placeId}/${name.replace(/\s+/g, '-')}`;
  if (!GAME_PRESETS[placeId]) {
    // Nếu là Place ID tự nhập thủ công thì hiển thị Place ID hoặc link gốc
    gameUrl = placeId;
  }
  
  if (inputUrl) inputUrl.value = gameUrl;
  if (inputUrlServices) inputUrlServices.value = gameUrl;

  document.querySelectorAll('.cyber-preset-btn').forEach(btn => {
    if (btn.dataset.placeid === placeId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// ==========================================
// TẢI VÀ GIẢ LẬP SERVER CHO MỘT GAME (LOAD)
// ==========================================
async function loadGame(placeId, name) {
  const loader = document.getElementById('loading-overlay');
  const grid = document.getElementById('servers-grid');
  
  if (grid) grid.innerHTML = '';
  if (loader) loader.classList.remove('hidden');
  
  // Cập nhật trạng thái cấu hình
  state.placeId = placeId;
  state.gameName = name;
  const preset = GAME_PRESETS[placeId] || { maxPlayers: 12 };
  state.maxPlayers = preset.maxPlayers;
  
  // Đồng bộ UI Selector cho cả 2 tab
  syncGameSelectorUI(placeId, name);
  
  // Cập nhật thông số Boss Rift theo game
  updateBossAlertInfo(name);

  // Cập nhật bảng giá dịch vụ theo game
  renderServices(placeId, name);

  try {
    await fetchRealServers(placeId);
    processAndRenderServers();
    showToast('success', `HopHub: Tải thành công ${state.allServers.length} server của ${name}!`);
  } catch (error) {
    console.error(error);
    showToast('error', `Lỗi tải server từ Roblox: ${error.message}. Đang dùng server giả lập làm dự phòng.`);
    generateMockServers();
    processAndRenderServers();
  } finally {
    if (loader) loader.classList.add('hidden');
  }
}

// Cập nhật thông báo sự kiện / Boss theo game
function updateBossAlertInfo(gameName) {
  const title = document.getElementById('boss-announcer-title');
  const desc = document.getElementById('boss-announcer-desc');
  const banner = document.getElementById('boss-alert-banner');
  const guideBoss = document.getElementById('dynamic-guide-boss');
  if (!title || !desc || !banner) return;
  
  if (gameName.toLowerCase().includes('monster')) {
    title.textContent = "Boss Rift · Xuất hiện tại phút :15, :30, :45, :00";
    desc.innerHTML = `Đầu mỗi giờ (ví dụ 10:00, 11:00) sẽ là <span class="gold-text">Boss Giờ cực hiếm</span>.`;
    banner.style.borderColor = 'rgba(255, 59, 48, 0.2)';
    banner.style.background = 'rgba(255, 59, 48, 0.06)';
    
    if (guideBoss) {
      guideBoss.innerHTML = `
        <h4 style="font-size: 14px; font-weight: 800; color: var(--text-white); margin-bottom: 6px; text-transform: uppercase;">2. CƠ CHẾ SĂN BOSS RIFT (CHO GAME CATCH A MONSTER)</h4>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 6px;">
          Trong tựa game Catch a Monster, Boss Rift sẽ xuất hiện tuần hoàn theo mốc thời gian UTC thực tế:
        </p>
        <ul style="padding-left: 20px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
          <li>🔥 Xuất hiện chính xác tại các phút: <strong style="color: var(--danger-red);">:00, :15, :30, :45</strong>.</li>
          <li>🌟 Đặc biệt: Đầu mỗi giờ (ví dụ 10:00, 11:00) sẽ spawn <strong style="color: var(--warning-amber);">Boss Giờ Cực Hiếm</strong> có giá trị phần thưởng siêu cao.</li>
          <li>⏱️ Theo dõi bảng **ĐẾM NGƯỢC BOSS RIFT** phía trên để nhảy server trước 1-2 phút.</li>
        </ul>
      `;
    }
  } else if (gameName.toLowerCase().includes('fruits')) {
    title.textContent = "Nhà máy Factory · Sự kiện Đột Kích tiếp theo";
    desc.innerHTML = `Nhà máy mở cửa mỗi <span class="gold-text">2 giờ chơi</span>. Có tỷ lệ rớt Trái Ác Quỷ huyền thoại.`;
    banner.style.borderColor = 'rgba(139, 92, 246, 0.25)';
    banner.style.background = 'rgba(139, 92, 246, 0.06)';
    
    if (guideBoss) {
      guideBoss.innerHTML = `
        <h4 style="font-size: 14px; font-weight: 800; color: var(--text-white); margin-bottom: 6px; text-transform: uppercase;">2. CƠ CHẾ KHỞI ĐỘNG NHÀ MÁY FACTORY (CHO GAME BLOX FRUITS)</h4>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 6px;">
          Trong Blox Fruits, sự kiện đột kích Nhà Máy (Factory Raid) diễn ra theo chu kỳ thời gian hệ thống chẵn:
        </p>
        <ul style="padding-left: 20px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
          <li>🏭 Xuất hiện chính xác mỗi **2 giờ chẵn** (0h, 2h, 4h, 6h, 8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h).</li>
          <li>⚔️ Nhiệm vụ: Tấn công lõi nhà máy trong 5 phút. Người gây nhiều sát thương nhất nhận ngay **Trái Ác Quỷ ngẫu nhiên** cực ngon.</li>
          <li>⏱️ Nhảy sang các server vắng để tránh người chơi khác KS lượng sát thương lõi nhà máy.</li>
        </ul>
      `;
    }
  } else if (gameName.toLowerCase().includes('adopt')) {
    title.textContent = "Mini-Game Đảo Thú · Sự kiện Nhân Đôi XP";
    desc.innerHTML = `Sự kiện cày cuốc đang diễn ra! Hãy tham gia các server vắng để cày trọn vẹn điểm thưởng.`;
    banner.style.borderColor = 'rgba(0, 240, 255, 0.2)';
    banner.style.background = 'rgba(0, 240, 255, 0.06)';
    
    if (guideBoss) {
      guideBoss.innerHTML = `
        <h4 style="font-size: 14px; font-weight: 800; color: var(--text-white); margin-bottom: 6px; text-transform: uppercase;">2. SỰ KIỆN MINIGAME ĐẢO THÚ (CHO GAME ADOPT ME!)</h4>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 6px;">
          Tận dụng server vắng người để hoàn thành nhiệm vụ nuôi thú nhanh chóng mà không bị cản trở:
        </p>
        <ul style="padding-left: 20px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
          <li>🥚 Chu kỳ xoay vòng nhiệm vụ: Mỗi **30 phút** sẽ cập nhật một đợt nhiệm vụ chung của máy chủ.</li>
          <li>🐾 Cày tiền và nhân đôi XP cực kỳ dễ dàng khi không bị gián đoạn hay lag do lượng người chơi đông.</li>
          <li>⏱️ Nhảy nhanh qua các server trống (0-1 người) để một mình ôm trọn tài nguyên của toàn bản đồ.</li>
        </ul>
      `;
    }
  } else if (gameName.toLowerCase().includes('brookhaven')) {
    title.textContent = "Sự kiện Ngân Hàng · Chu kỳ 30 phút";
    desc.innerHTML = `Cơ hội cướp két sắt ngân hàng mở mỗi <span class="gold-text">30 phút</span>. Thích hợp cho cày RP.`;
    banner.style.borderColor = 'rgba(245, 158, 11, 0.2)';
    banner.style.background = 'rgba(245, 158, 11, 0.06)';
    
    if (guideBoss) {
      guideBoss.innerHTML = `
        <h4 style="font-size: 14px; font-weight: 800; color: var(--text-white); margin-bottom: 6px; text-transform: uppercase;">2. CHU KỲ KHỞI ĐỘNG KÉT SẮT NGÂN HÀNG (CHO GAME BROOKHAVEN)</h4>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 6px;">
          Trong Brookhaven RP, hệ thống két sắt an ninh ngân hàng tự động mở khóa và reset theo mốc thời gian:
        </p>
        <ul style="padding-left: 20px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
          <li>🏦 Reset an ninh ngân hàng diễn ra đều đặn mỗi **20 phút** (tại phút thứ :00, :20, :40).</li>
          <li>💰 Phù hợp cho hoạt động cày tiền ảo, thực hiện các pha phi vụ nhập vai (RP) mà không bị cảnh sát cản trở.</li>
          <li>⏱️ Chọn server vắng người để có trải nghiệm nhập vai riêng tư tuyệt đối cùng bạn bè.</li>
        </ul>
      `;
    }
  } else if (gameName.toLowerCase().includes('prison')) {
    title.textContent = "Sân Nhà Tù · Sự kiện Thả Airdrop Tiếp Tế";
    desc.innerHTML = `Thùng thính vũ khí đặc chủng thả mỗi <span class="gold-text">10 phút</span>. Phù hợp cho cướp/lính lập team.`;
    banner.style.borderColor = 'rgba(16, 185, 129, 0.25)';
    banner.style.background = 'rgba(16, 185, 129, 0.06)';
    
    if (guideBoss) {
      guideBoss.innerHTML = `
        <h4 style="font-size: 14px; font-weight: 800; color: var(--text-white); margin-bottom: 6px; text-transform: uppercase;">2. ĐỢT THẢ THÙNG THẮP SÁNG/AIRDROP (CHO GAME PRISON LIFE)</h4>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 6px;">
          Trong Prison Life, sự kiện thả hòm tiếp tế Airdrop diễn ra liên tục tại sân nhà tù:
        </p>
        <ul style="padding-left: 20px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
          <li>📦 Thả tiếp tế súng ống hạng nặng diễn ra mỗi **10 phút** chẵn (tại các phút :00, :10, :20, :30, :40, :50).</li>
          <li>🔫 Server vắng là thiên đường để bạn loot vũ khí đặc biệt ở sân bóng mà không sợ bị lính gác hay tội phạm bắn hạ.</li>
          <li>⏱️ Nhảy nhanh sang server vắng để lập team giải cứu tù nhân quy mô lớn.</li>
        </ul>
      `;
    }
  } else {
    title.textContent = "Sự kiện Hầm Ngục Dungeon · Sắp ra mắt";
    desc.innerHTML = `Các thử thách sinh tồn độc đáo mở xoay vòng theo chu kỳ thời gian thực tế.`;
    banner.style.borderColor = 'rgba(0, 255, 135, 0.2)';
    banner.style.background = 'rgba(0, 255, 135, 0.06)';
    
    if (guideBoss) {
      guideBoss.innerHTML = `
        <h4 style="font-size: 14px; font-weight: 800; color: var(--text-white); margin-bottom: 6px; text-transform: uppercase;">2. SỰ KIỆN PHÂN KHU HÀM NGỤC (CHO TRÒ CHƠI NÀY)</h4>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 6px;">
          Hệ thống tự động đồng bộ theo chu kỳ Reset hầm ngục 60 phút của trò chơi này:
        </p>
        <ul style="padding-left: 20px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
          <li>⏱️ Đợt làm mới và reset quái/tài nguyên diễn ra chính xác **đầu mỗi giờ** (:00 phút).</li>
          <li>🛡️ Server ít người chơi sẽ giúp giảm thiểu tối đa hiện tượng lag máy, trễ phím (delay ping) khi combo Boss.</li>
          <li>🔥 Săn Boss rảnh tay, không bị phá game hay ks điểm kinh nghiệm.</li>
        </ul>
      `;
    }
  }
}

// ==========================================
// CẬP NHẬT BẢNG GIÁ DỊCH VỤ THEO TỪNG GAME
// ==========================================
function renderServices(placeId, gameName) {
  const container = document.getElementById('services-content-area');
  if (!container) return;

  const serviceData = GAME_SERVICES[placeId];

  if (serviceData) {
    // Render dynamic table
    const verificationsHTML = serviceData.verifications.map(item => {
      const text = item.replace(/^✔\s*/, '').trim();
      return `
        <div class="policy-item">
          <span class="policy-check">✔</span> ${text}
        </div>
      `;
    }).join('');

    const headersHTML = serviceData.headers.map(h => `
      <th>${h}</th>
    `).join('');

    const rowsHTML = serviceData.rows.map(row => `
      <tr class="row-${row.badgeClass}">
        <td>
          <div class="service-info-cell">
            <span class="service-dot dot-${row.badgeClass}"></span>
            <div class="service-details">
              <span class="service-name">${row.name}</span>
              <span class="service-badge-tag tag-${row.badgeClass}">${row.badge}</span>
            </div>
          </div>
        </td>
        <td class="price-col highlight-price">
          ${row.price1} <span class="price-unit">${row.price1Suffix}</span>
        </td>
        <td class="price-col">
          ${row.price2 === '—' ? `<span style="color: var(--text-muted); font-weight: bold;">—</span>` : `${row.price2} <span class="price-unit">${row.price2Suffix}</span>`}
        </td>
        <td class="note-col">${row.note}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="dungeon-hero-section">
        <div class="dungeon-hero-glow"></div>
        <div class="dungeon-hero-content">
          <span class="hero-kicker">// BẢNG GIÁ DỊCH VỤ CÀY THUÊ ${serviceData.gameName.toUpperCase()}</span>
          <h1 class="hero-title">${serviceData.title}</h1>
          <p class="hero-subtitle">${serviceData.desc}</p>
        </div>
      </div>

      <div class="policy-hud-bar">
        ${verificationsHTML}
      </div>

      <h4 class="section-title-hud">// CHI TIẾT BẢNG GIÁ DỊCH VỤ</h4>
      
      <div class="pricing-table-container">
        <table class="premium-pricing-table">
          <thead>
            <tr>
              ${headersHTML}
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>

      <!-- Discord Massive Contact Card -->
      <section class="discord-contact-card">
        <div class="dungeon-hero-glow"></div>
        <div class="discord-card-inner" style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; gap: 32px; max-width: 800px; text-align: left;">
          
          <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 12px;">
            <h3 class="discord-card-title" style="margin-bottom: 0;">LIÊN HỆ ĐẶT LỊCH HỖ TRỢ / GRIND GAME</h3>
            <p class="discord-card-desc" style="margin-bottom: 12px; line-height: 1.6;">
              Nhấp vào nút bên dưới để tham gia Discord cộng đồng hoặc quét mã QR bên cạnh để thêm bạn và trao đổi trực tiếp với Admin.
            </p>
            <a href="https://discord.gg/QqmbXxDV" target="_blank" class="btn-discord-massive" style="width: max-content;">
              <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor" style="margin-right: 8px; vertical-align: middle;"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53A105.79,105.79,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5A51.48,51.48,0,0,0,30,78.82a74.37,74.37,0,0,0,67.13,0,51.48,51.48,0,0,0,1.87,1.69,68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.79,105.79,0,0,0,31.58-18.83C129.87,49.25,123.63,26.47,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/></svg>
              <span>THAM GIA DISCORD ĐẶT GÓI CÀY</span>
            </a>
          </div>

          <div class="qr-container" style="flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.03); border: 1.5px solid var(--cyber-border); border-radius: 12px; padding: 16px; box-shadow: 0 0 15px rgba(0, 240, 255, 0.05);">
            <img src="discord_qr.png" alt="Discord QR Code yuncoldiz" style="width: 140px; height: 140px; border-radius: 8px; display: block; border: 2px solid var(--primary-blue); box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);">
            <span style="font-family: var(--font-cyber); font-size: 11px; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em;">QR CODE: yuncoldiz</span>
          </div>

        </div>
      </section>
    `;
  } else {
    // Render beautiful empty state
    container.innerHTML = `
      <div class="dungeon-hero-section" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px; margin-bottom: 24px;">
        <div class="dungeon-hero-glow"></div>
        <div class="dungeon-hero-content">
          <div style="font-size: 48px; margin-bottom: 16px; animation: pulse 2s infinite;">🌌</div>
          <h3 class="hero-title" style="font-size: 16px; text-transform: uppercase;">
            // CHƯA CÓ THÔNG TIN DỊCH VỤ
          </h3>
          <p class="hero-subtitle" style="max-width: 480px; margin-bottom: 0;">
            Hiện tại tựa game <strong>${gameName}</strong> chưa có thông tin bảng giá dịch vụ cày thuê hoặc kéo Dungeon chính thức từ hệ thống của chúng tôi.
          </p>
        </div>
      </div>

      <!-- Discord Massive Contact Card -->
      <section class="discord-contact-card">
        <div class="dungeon-hero-glow"></div>
        <div class="discord-card-inner" style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; gap: 32px; max-width: 800px; text-align: left;">
          
          <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 12px;">
            <h3 class="discord-card-title" style="margin-bottom: 0;">LIÊN HỆ ĐỂ NHẬN BÁO GIÁ RIÊNG</h3>
            <p class="discord-card-desc" style="margin-bottom: 12px; line-height: 1.6;">
              Nhấp vào nút bên dưới để tham gia Discord cộng đồng hoặc quét mã QR bên cạnh để thêm bạn và thương lượng gói cày thuê cho game <strong>${gameName}</strong>.
            </p>
            <a href="https://discord.gg/QqmbXxDV" target="_blank" class="btn-discord-massive" style="width: max-content;">
              <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor" style="margin-right: 8px; vertical-align: middle;"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53A105.79,105.79,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5A51.48,51.48,0,0,0,30,78.82a74.37,74.37,0,0,0,67.13,0,51.48,51.48,0,0,0,1.87,1.69,68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.79,105.79,0,0,0,31.58-18.83C129.87,49.25,123.63,26.47,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/></svg>
              <span>THAM GIA DISCORD ĐẶT GÓI CÀY</span>
            </a>
          </div>

          <div class="qr-container" style="flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.03); border: 1.5px solid var(--cyber-border); border-radius: 12px; padding: 16px; box-shadow: 0 0 15px rgba(0, 240, 255, 0.05);">
            <img src="discord_qr.png" alt="Discord QR Code yuncoldiz" style="width: 140px; height: 140px; border-radius: 8px; display: block; border: 2px solid var(--primary-blue); box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);">
            <span style="font-family: var(--font-cyber); font-size: 11px; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em;">QR CODE: yuncoldiz</span>
          </div>

        </div>
      </section>
    `;
  }
}

// ==========================================
// SINH DỮ LIỆU SERVER MOCK ĐỘNG
// ==========================================
function generateMockServers() {
  const serverCount = 60 + Math.floor(Math.random() * 45); // khoảng 60 đến 105 server
  const servers = [];

  for (let i = 0; i < serverCount; i++) {
    // Generate Random hex id: xxxx-xxxx
    const hex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    const id = `${hex()}-${hex()}`;

    // Phân bố số người chơi ngẫu nhiên, không sinh server 0 người (tránh lỗi kết nối server chết)
    let playing = 1;
    const roll = Math.random();
    if (roll < 0.35) {
      playing = Math.floor(1 + Math.random() * 2); // 35% có 1-2 người (vừa cực vắng vừa đảm bảo hoạt động)
    } else if (roll < 0.70) {
      playing = Math.floor(3 + Math.random() * 3); // 35% từ 3-5 người
      
      // Đảm bảo không vượt quá maxPlayers của game
      playing = Math.min(playing, state.maxPlayers);
    } else if (roll < 0.90) {
      playing = Math.floor(6 + Math.random() * 4); // 20% từ 6-9 người
      playing = Math.min(playing, state.maxPlayers);
    } else {
      playing = Math.floor(10 + Math.random() * (state.maxPlayers - 9)); // 10% đầy hoặc gần đầy
      playing = Math.min(playing, state.maxPlayers);
    }
    
    // Đảm bảo tối thiểu là 1 người
    playing = Math.max(1, playing);

    const fps = Math.round(45 + Math.random() * 15); // FPS từ 45 đến 60
    const ping = Math.round(15 + Math.random() * 210); // Ping từ 15ms đến 225ms

    let tag = "Thường";
    if (playing === 1) tag = "Mới quét";
    else if (ping < 50) tag = "Mượt";
    else if (fps >= 57 && playing < 4) tag = "Ổn định";

    servers.push({
      id,
      playing,
      maxPlayers: state.maxPlayers,
      fps,
      ping,
      tag
    });
  }

  state.allServers = servers;
}

// ==========================================
// TẢI DỮ LIỆU SERVER THỰC TẾ TỪ ROBLOX
// ==========================================
async function fetchRealServers(placeId) {
  let response;
  let data;
  let errorMsg = "";

  // 1. Thử tải qua API tương đối của website (localhost hoặc Vercel của chính bạn)
  try {
    const url = `/api/servers?placeId=${placeId}`;
    response = await fetch(url);
    if (response.ok) {
      data = await response.json();
    } else {
      errorMsg = `HTTP status ${response.status}`;
    }
  } catch (e) {
    errorMsg = e.message;
    console.warn("Relative fetch failed, trying CORS proxy fallback...", e);
  }

  // 2. Dự phòng: Nếu API của bạn lỗi hoặc không trả về danh sách, tải trực tiếp từ Roblox qua CORS Proxy
  // Cách này bỏ qua Vercel của bạn, gọi thẳng Roblox API và vượt tường lửa nhà mạng
  const serverArray = data ? (data.servers || data.data) : null;
  if (!serverArray || !Array.isArray(serverArray) || serverArray.length === 0) {
    const robloxUrl = `https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=100`;
    
    // Thử Proxy 1: corsproxy.io
    try {
      console.log("Using direct Roblox CORS proxy fallback (corsproxy.io)...");
      const proxyUrl = `https://corsproxy.io/?${robloxUrl}`;
      response = await fetch(proxyUrl);
      if (response.ok) {
        const temp = await response.json();
        if (temp && (temp.data || temp.servers)) data = temp;
      }
    } catch (e) {
      console.warn("corsproxy.io failed, trying allorigins...", e);
    }

    // Thử Proxy 2: allorigins (chậm hơn nhưng cực kỳ uy tín, vượt qua mọi cấm cản)
    if (!data || !(data.data || data.servers)) {
      try {
        console.log("Using direct Roblox CORS proxy fallback (allorigins)...");
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(robloxUrl)}`;
        response = await fetch(proxyUrl);
        if (response.ok) {
          const wrapper = await response.json();
          const temp = JSON.parse(wrapper.contents);
          if (temp && (temp.data || temp.servers)) data = temp;
        }
      } catch (e) {
        console.error("allorigins fallback failed...", e);
      }
    }
  }

  // Lấy danh sách server cuối cùng từ dữ liệu đã phân tích
  const finalServers = data ? (data.servers || data.data) : null;
  if (!finalServers || !Array.isArray(finalServers)) {
    throw new Error(errorMsg || "Dữ liệu trả về không đúng định dạng Roblox");
  }

  const servers = finalServers.map(server => {
    const playing = server.playing || 0;
    const maxPlayers = server.maxPlayers || state.maxPlayers;
    const fps = Math.round(server.fps || 60);
    const ping = Math.round(server.ping || 100);
    
    let tag = "Thường";
    if (playing === 1) tag = "Mới quét";
    else if (ping < 50) tag = "Mượt";
    else if (fps >= 57 && playing < 4) tag = "Ổn định";
    
    return {
      id: server.id,
      playing,
      maxPlayers,
      fps,
      ping,
      tag
    };
  });
  
  state.allServers = servers;
}

// ==========================================
// XỬ LÝ LỌC & SẮP XẾP CACHE DỮ LIỆU
// ==========================================
function processAndRenderServers() {
  let filtered = [...state.allServers];
  
  // 1. Áp dụng bộ lọc người chơi
  if (state.activeFilter !== "all") {
    filtered = filtered.filter(s => {
      if (state.activeFilter === "empty") return s.playing <= 1;
      if (state.activeFilter === "open") return s.playing >= 2 && s.playing <= 5;
      if (state.activeFilter === "busy") return s.playing >= 6 && s.playing <= 10;
      return true;
    });
  }
  
  // 2. Áp dụng sắp xếp
  if (state.activeSort === 'asc') {
    // Ít người trước, ping thấp trước
    filtered.sort((a, b) => {
      if (a.playing !== b.playing) return a.playing - b.playing;
      return a.ping - b.ping;
    });
  } else if (state.activeSort === 'desc') {
    // Nhiều người trước
    filtered.sort((a, b) => b.playing - a.playing);
  } else if (state.activeSort === 'ping_asc') {
    filtered.sort((a, b) => a.ping - b.ping);
  } else if (state.activeSort === 'fps_desc') {
    filtered.sort((a, b) => b.fps - a.fps);
  }
  
  state.filteredServers = filtered;
  
  // Cập nhật thông số sidebar
  document.getElementById('stat-total-servers').textContent = state.allServers.length;
  
  const lowPop = state.allServers.filter(s => s.playing <= 3).length;
  document.getElementById('stat-lowpop-servers').textContent = lowPop;
  
  const now = new Date();
  document.getElementById('stat-last-updated').textContent = now.toLocaleTimeString();
  
  renderGrid();
}

// ==========================================
// RENDER DANH SÁCH THẺ SERVER LÊN TRANG
// ==========================================
function renderGrid() {
  const grid = document.getElementById('servers-grid');
  const showMoreBtn = document.getElementById('show-more-btn');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  if (state.filteredServers.length === 0) {
    grid.innerHTML = `
      <div class="no-servers-placeholder">
        <p class="empty-title">// KHÔNG TÌM THẤY SERVER PHÙ HỢP</p>
        <p class="empty-subtitle">Hãy chọn bộ lọc hoặc tải lại dữ liệu trò chơi.</p>
      </div>
    `;
    if (showMoreBtn) showMoreBtn.classList.add('hidden');
    return;
  }
  
  // Cắt danh sách theo visibleCount
  const slice = state.filteredServers.slice(0, state.visibleCount);
  
  slice.forEach(server => {
    const isOpened = state.openedServers.has(server.id);
    const fillPercent = Math.min(100, Math.round((server.playing / server.maxPlayers) * 100));
    
    // Gán class độ lấp đầy
    let statusClass = "empty";
    if (server.playing >= 11) statusClass = "full";
    else if (server.playing >= 6) statusClass = "busy";
    else if (server.playing >= 2) statusClass = "open";
    
    // Ping class màu sắc
    let pingClass = "good";
    if (server.ping > 150) pingClass = "poor";
    else if (server.ping > 75) pingClass = "fair";
    
    const card = document.createElement('article');
    card.className = `cam-hop-card cam-hop-card--${statusClass} ${isOpened ? 'cam-hop-card--opened' : ''}`;
    
    const shortId = server.id.substring(0, 8);
    
    card.innerHTML = `
      <div class="cam-hop-card__head">
        <span class="cam-hop-card__led cam-hop-card__led--${statusClass}"></span>
        <span class="cam-hop-card__id">
          <span>${shortId}</span>
          <button class="cam-hop-card__copy-btn" title="Copy mã console của server" onclick="copyConsoleCommand('${server.id}', event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
          </button>
        </span>
        <span class="cam-hop-card__tag cam-hop-card__tag--${statusClass}">${server.tag}</span>
      </div>
      <div class="cam-hop-card__count-row">
        <span class="cam-hop-card__count">
          <span class="cam-hop-card__count-now">${server.playing}</span>
          <span class="cam-hop-card__count-sep">/</span>
          <span class="cam-hop-card__count-cap">${server.maxPlayers}</span>
        </span>
        <span class="cam-hop-card__count-label">PLAYERS</span>
      </div>
      <div class="cam-hop-card__bar">
        <div class="cam-hop-card__fill cam-hop-card__fill--${statusClass}" style="width: ${fillPercent}%"></div>
      </div>
      <div class="cam-hop-card__meta">
        <span class="cam-hop-card__meta-cell">
          <span class="cam-hop-card__meta-k">FPS</span>
          <span class="cam-hop-card__meta-v">${server.fps}</span>
        </span>
        <span class="cam-hop-card__meta-sep">·</span>
        <span class="cam-hop-card__meta-cell cam-hop-card__meta-cell--${pingClass}">
          <span class="cam-hop-card__meta-k">PING</span>
          <span class="cam-hop-card__meta-v">${server.ping}ms</span>
        </span>
      </div>
      <button type="button" class="cam-hop-card__join ${isOpened ? 'cam-hop-card__join--opened' : ''}" 
        ${isOpened ? 'disabled' : ''} onclick="joinRobloxServer('${server.id}')">
        ${isOpened ? `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
          <span>OPENED</span>
        ` : `
          <span>HOP IN</span>
          <span class="cam-hop-card__join-arrow">→</span>
        `}
      </button>
    `;
    
    grid.appendChild(card);
  });
  
  // Ẩn / Hiện xem thêm
  if (state.filteredServers.length > state.visibleCount) {
    if (showMoreBtn) {
      showMoreBtn.classList.remove('hidden');
      const rem = state.filteredServers.length - state.visibleCount;
      document.getElementById('remaining-count-hint').textContent = `(Còn ${rem} phòng)`;
    }
  } else {
    if (showMoreBtn) showMoreBtn.classList.add('hidden');
  }
}

// ==========================================
// KHỞI CHẠY LIÊN KẾT PROTOCOL ROBLOX
// ==========================================
function joinRobloxServer(serverId, isAutoTriggered = false) {
  const robloxUri = `roblox://experiences/start?placeId=${state.placeId}&gameInstanceId=${serverId}`;
  
  if (isAutoTriggered) {
    // Tránh bị trình duyệt chặn: nạp phiên chạy qua localStorage và reload (giải thuật vi diệu)
    localStorage.setItem('hophub_pending_auto_hop', serverId);
    localStorage.setItem('hophub_pending_place_id', state.placeId);
    
    showToast('info', 'Đang tự động chuyển trang để kết nối game...');
    setTimeout(() => {
      window.location.reload();
    }, 150);
    return;
  }
  
  showToast('info', 'Đang kết nối Roblox Launcher...');
  
  // Mở Roblox URI Scheme
  window.location.href = robloxUri;
  
  // Lưu lịch sử hop
  recordHop(serverId);
  processAndRenderServers();
}

// Kiểm tra phiên auto-hop chờ tải lại (chrome popup bypass)
const pendingJob = localStorage.getItem('hophub_pending_auto_hop');
const pendingPlace = localStorage.getItem('hophub_pending_place_id');
if (pendingJob && pendingPlace) {
  localStorage.removeItem('hophub_pending_auto_hop');
  localStorage.removeItem('hophub_pending_place_id');
  
  setTimeout(() => {
    window.location.href = `roblox://experiences/start?placeId=${pendingPlace}&gameInstanceId=${pendingJob}`;
    
    // Ghi nhận
    state.openedServers.add(pendingJob);
    localStorage.setItem('hophub_opened_servers', JSON.stringify([...state.openedServers]));
    
    state.hopsCount++;
    localStorage.setItem('hophub_hops_today', state.hopsCount);
    
    const val = document.getElementById('hops-today-value');
    if (val) val.textContent = state.hopsCount;
    
    showToast('success', 'Auto Hop thành công! Đang kết nối phòng mới...');
  }, 400);
}

// ==========================================
// COPY CONSOLE COMMAND
// ==========================================
function copyConsoleCommand(serverId, event) {
  event.stopPropagation();
  const command = `Roblox.GameLauncher.joinGameInstance(${state.placeId}, "${serverId}")`;
  
  navigator.clipboard.writeText(command)
    .then(() => showToast('success', 'Đã copy mã console của HopHub!'))
    .catch(() => showToast('error', 'Lỗi sao chép mã console.'));
}

// ==========================================
// GIẢI THUẬT GHÉP NHANH (AUTO HOP)
// ==========================================
function performQuickJoin(isAutoTriggered = false) {
  // Tìm các server trống hoặc vắt từ 2-5 người chưa từng click mở
  let pool = state.allServers.filter(s => s.playing >= 2 && s.playing <= 5 && !state.openedServers.has(s.id));
  
  // Mở rộng pool nếu không có
  if (pool.length === 0) {
    pool = state.allServers.filter(s => s.playing >= 2 && s.playing <= 8 && !state.openedServers.has(s.id));
  }
  
  if (pool.length === 0) {
    pool = state.filteredServers.filter(s => !state.openedServers.has(s.id));
  }
  
  if (pool.length === 0 && state.allServers.length > 0) {
    state.openedServers.clear();
    localStorage.setItem('hophub_opened_servers', '[]');
    pool = state.allServers;
  }
  
  if (pool.length > 0) {
    const randomIdx = Math.floor(Math.random() * pool.length);
    const server = pool[randomIdx];
    
    showToast('success', `Hop nhanh thành công! Phòng ${server.id.substring(0,8)} (${server.playing} người).`);
    joinRobloxServer(server.id, isAutoTriggered);
  } else {
    showToast('error', 'Không tìm thấy server khả dụng để hop nhanh!');
  }
}

// ==========================================
// TICK TIMERS CHẠY NGẦM SAU CƠ CHẾ UTC
// ==========================================
function tickAutoRefresh() {
  if (!state.autoRefreshEnabled) return;
  
  state.autoRefreshTimer--;
  document.getElementById('auto-refresh-timer').textContent = `${state.autoRefreshTimer}s`;
  
  if (state.autoRefreshTimer <= 0) {
    state.autoRefreshTimer = 30;
    
    showToast('info', 'Đang tự động nạp lại danh sách server...');
    
    const loader = document.getElementById('loading-overlay');
    if (loader) loader.classList.remove('hidden');
    
    fetchRealServers(state.placeId)
      .then(() => {
        processAndRenderServers();
        if (loader) loader.classList.add('hidden');
      })
      .catch((error) => {
        console.error(error);
        showToast('error', 'Tự động quét lỗi, đang tải lại cache...');
        generateMockServers();
        processAndRenderServers();
        if (loader) loader.classList.add('hidden');
      });
  }
}

function tickAutoHop() {
  const span = document.getElementById('auto-hop-countdown-span');
  if (!state.autoHopEnabled) {
    if (span) span.textContent = '';
    return;
  }
  
  state.autoHopTimer--;
  if (span) span.textContent = ` (${state.autoHopTimer}s)`;
  
  if (state.autoHopTimer <= 0) {
    const select = document.getElementById('server-hop-timer-select');
    state.autoHopTimer = parseInt(select ? select.value : '60');
    
    showToast('info', 'Hệ thống tự động kích hoạt nhảy server vắng...');
    performQuickJoin(true);
  }
}

// ==========================================
// HỘP THOẠI TOAST CAO CẤP CHỐNG SPAM
// ==========================================
function showToast(type, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  // Chống spam thông báo trùng
  const activeToasts = Array.from(container.children);
  const isDuplicate = activeToasts.some(t => {
    const textEl = t.querySelector('span:last-child');
    return textEl && textEl.textContent === message;
  });
  if (isDuplicate) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  
  let color = 'var(--primary-blue)';
  let icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`;
  
  if (type === 'success') {
    color = 'var(--success-green)';
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>`;
  } else if (type === 'error') {
    color = 'var(--danger-red)';
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>`;
  }
  
  toast.innerHTML = `
    <span style="color: ${color}; display: flex; flex-shrink: 0;">${icon}</span>
    <span style="flex-grow: 1; line-height: 1.4;">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // slideOut sau 4s
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// ========================================================
// Theme Customizer Logic (Synced Across Dual Sidebars)
// ========================================================
function setupThemeColorCustomizer() {
  const savedColor = localStorage.getItem('hophub_theme_color');
  const presetButtons = document.querySelectorAll('.preset-color-btn');
  const colorPickers = document.querySelectorAll('.custom-theme-color-picker');
  const colorPickerWrappers = document.querySelectorAll('.custom-color-picker-wrapper');
  const colorHexTexts = document.querySelectorAll('.current-color-hex');
  const resetBtns = document.querySelectorAll('.reset-theme-color-btn');
  const bgUploaders = document.querySelectorAll('.custom-bg-uploader');
  const removeBgBtns = document.querySelectorAll('.remove-custom-bg-btn');
  const opacitySliders = document.querySelectorAll('.glass-opacity-slider');
  const opacityValTexts = document.querySelectorAll('.glass-opacity-val');
  const effectSelects = document.querySelectorAll('.particles-effect-select');
  const layerSelects = document.querySelectorAll('.particles-layer-select');

  // 1. Theme Color Accent Application
  function applyThemeColor(hex) {
    if (!hex) return;
    const root = document.documentElement;
    root.style.setProperty('--primary-blue', hex);
    
    const rgb = hexToRgb(hex);
    if (rgb) {
      const isLight = document.body.classList.contains('light-theme');
      const hoverHex = lightenDarkenColor(hex, isLight ? -20 : 20); 
      root.style.setProperty('--primary-hover', hoverHex);
      
      if (!isLight) {
        root.style.setProperty('--cyber-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
        root.style.setProperty('--cyber-border-hover', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
        document.body.style.backgroundImage = `radial-gradient(circle at 50% 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.035) 0%, transparent 50%)`;
      } else {
        root.style.removeProperty('--cyber-border');
        root.style.removeProperty('--cyber-border-hover');
        document.body.style.backgroundImage = `
          radial-gradient(at 0% 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05) 0px, transparent 50%), 
          radial-gradient(at 50% 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(244, 63, 94, 0.02) 0px, transparent 40%)
        `;
      }
    }
    
    colorHexTexts.forEach(txt => {
      txt.textContent = hex.toUpperCase();
      txt.style.color = hex;
    });
    
    colorPickers.forEach(picker => {
      picker.value = hex;
    });

    // Match preset highlights
    presetButtons.forEach(btn => {
      if (btn.dataset.color.toLowerCase() === hex.toLowerCase()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const hasMatchingPreset = Array.from(presetButtons).some(btn => btn.dataset.color.toLowerCase() === hex.toLowerCase());
    colorPickerWrappers.forEach(w => {
      if (!hasMatchingPreset) {
        w.classList.add('active');
      } else {
        w.classList.remove('active');
      }
    });
  }

  // Load theme color from cache
  if (savedColor) {
    applyThemeColor(savedColor);
  }

  // Bind color presets click event
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      applyThemeColor(color);
      localStorage.setItem('hophub_theme_color', color);
      showToast('success', `Đã đổi màu chủ đề thành ${btn.title}!`);
    });
  });

  // Bind custom color picker change event
  colorPickers.forEach(picker => {
    picker.addEventListener('input', (e) => {
      const color = e.target.value;
      applyThemeColor(color);
      localStorage.setItem('hophub_theme_color', color);
    });
    picker.addEventListener('change', (e) => {
      showToast('success', `Đã lưu màu tự chọn: ${e.target.value.toUpperCase()}!`);
    });
  });

  // 2. Custom Background Image Upload & Compression
  function applyCustomBackground(base64Url) {
    if (!base64Url) {
      document.body.style.removeProperty('background-image');
      removeBgBtns.forEach(btn => btn.style.display = 'none');
      const currentActiveColor = localStorage.getItem('hophub_theme_color') || '#00f0ff';
      applyThemeColor(currentActiveColor);
      return;
    }

    const isLight = document.body.classList.contains('light-theme');
    const overlay = isLight 
      ? 'linear-gradient(rgba(243, 244, 246, 0.88), rgba(243, 244, 246, 0.88))'
      : 'linear-gradient(rgba(10, 12, 18, 0.88), rgba(10, 12, 18, 0.88))';
    
    document.body.style.backgroundImage = `${overlay}, url(${base64Url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    
    removeBgBtns.forEach(btn => btn.style.display = 'block');
  }

  // Load custom background from cache
  const savedBg = localStorage.getItem('hophub_custom_bg');
  if (savedBg) {
    applyCustomBackground(savedBg);
  }

  // Bind background uploader change event
  bgUploaders.forEach(uploader => {
    uploader.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('error', 'Vui lòng chọn một tệp hình ảnh hợp lệ!');
        return;
      }

      showToast('info', 'Đang tối ưu dung lượng ảnh nền...');

      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;
          const maxDim = 1920;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          try {
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
            localStorage.setItem('hophub_custom_bg', compressedBase64);
            applyCustomBackground(compressedBase64);
            showToast('success', 'Đã lưu và áp dụng ảnh nền thành công!');
          } catch (err) {
            console.error(err);
            showToast('error', 'Ảnh quá lớn! Hãy thử chọn ảnh khác nhẹ hơn.');
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  });

  // Bind remove background click event
  removeBgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('hophub_custom_bg');
      applyCustomBackground(null);
      bgUploaders.forEach(uploader => uploader.value = '');
      showToast('success', 'Đã xóa ảnh nền tùy chọn và khôi phục mặc định!');
    });
  });

  // 3. Glassmorphism Opacity Slider
  function applyGlassOpacity(percentage) {
    if (!percentage) percentage = 65;
    const alpha = percentage / 100;
    const isLight = document.body.classList.contains('light-theme');
    const root = document.documentElement;

    if (isLight) {
      const panelAlpha = Math.max(0.1, alpha - 0.2);
      root.style.setProperty('--bg-panel', `rgba(255, 255, 255, ${panelAlpha})`);
      root.style.setProperty('--bg-card', `rgba(255, 255, 255, ${alpha})`);
    } else {
      const cardAlpha = Math.max(0.1, alpha - 0.05);
      root.style.setProperty('--bg-panel', `rgba(10, 12, 18, ${alpha})`);
      root.style.setProperty('--bg-card', `rgba(20, 22, 33, ${cardAlpha})`);
    }

    opacityValTexts.forEach(txt => txt.textContent = `${percentage}%`);
    opacitySliders.forEach(slider => slider.value = percentage);
  }

  // Load glass opacity from cache
  const savedOpacity = localStorage.getItem('hophub_glass_opacity');
  applyGlassOpacity(savedOpacity ? parseInt(savedOpacity, 10) : 65);

  // Bind opacity sliders
  opacitySliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const percentage = e.target.value;
      applyGlassOpacity(percentage);
      localStorage.setItem('hophub_glass_opacity', percentage);
    });
  });

  // 4. HTML5 Canvas Particles Animation Engine
  const particlesCanvas = document.getElementById('particles-canvas');
  let canvasCtx = particlesCanvas ? particlesCanvas.getContext('2d') : null;
  let animationFrameId = null;
  let particlesArray = [];

  function resizeCanvas() {
    if (!particlesCanvas) return;
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(effectType) {
      this.reset(effectType, true);
    }
    reset(effectType, isInit = false) {
      if (!particlesCanvas) return;
      this.effectType = effectType;
      const width = particlesCanvas.width;
      const height = particlesCanvas.height;

      if (effectType === 'GLOW') {
        this.x = Math.random() * width;
        this.y = isInit ? Math.random() * height : height + 10;
        this.size = Math.random() * 4 + 2;
        this.speedY = -(Math.random() * 0.8 + 0.3);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.45 + 0.2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swayRadius = Math.random() * 0.8 + 0.2;
      } else if (effectType === 'SAKURA') {
        this.x = Math.random() * (width + 100) - 50;
        this.y = isInit ? Math.random() * height : -20;
        this.size = Math.random() * 5 + 4;
        this.speedY = Math.random() * 0.8 + 0.5;
        this.speedX = -(Math.random() * 0.5 + 0.2);
        this.opacity = Math.random() * 0.5 + 0.3;
        this.spin = Math.random() * 0.02 - 0.01;
        this.angle = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swayRadius = Math.random() * 1.5 + 0.5;
      } else if (effectType === 'SNOW') {
        this.x = Math.random() * width;
        this.y = isInit ? Math.random() * height : -10;
        this.size = Math.random() * 3 + 1.5;
        this.speedY = Math.random() * 0.7 + 0.3;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.swaySpeed = Math.random() * 0.015 + 0.005;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swayRadius = Math.random() * 0.8 + 0.2;
      } else if (effectType === 'MATRIX') {
        this.x = Math.random() * width;
        this.x = Math.floor(this.x / 14) * 14;
        this.y = isInit ? Math.random() * height : -20;
        this.size = Math.random() * 4 + 10;
        this.speedY = Math.random() * 2 + 1.5;
        this.speedX = 0;
        this.opacity = Math.random() * 0.75 + 0.25;
        const chars = '01abcdefghijklmnopqrstuvwxyz日ハミヒーウシ';
        this.char = chars.charAt(Math.floor(Math.random() * chars.length));
        this.frameCounter = 0;
      } else if (effectType === 'STARS') {
        this.x = Math.random() * (width + 200) - 100;
        this.y = isInit ? Math.random() * height : -50;
        this.size = Math.random() * 40 + 30;
        this.speedY = Math.random() * 3 + 4;
        this.speedX = -(this.speedY * 1.2);
        this.opacity = Math.random() * 0.5 + 0.1;
        this.lineWidth = Math.random() * 1.5 + 0.5;
      }
    }
    update(effectType) {
      if (!particlesCanvas) return;
      if (effectType === 'GLOW') {
        this.y += this.speedY;
        this.swayAngle += this.swaySpeed;
        this.x += this.speedX + Math.sin(this.swayAngle) * this.swayRadius;
        if (this.y < -10) this.reset(effectType, false);
      } else if (effectType === 'SAKURA') {
        this.y += this.speedY;
        this.x += this.speedX;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * this.swayRadius;
        this.angle += this.spin;
        if (this.y > particlesCanvas.height + 10 || this.x < -60 || this.x > particlesCanvas.width + 60) {
          this.reset(effectType, false);
        }
      } else if (effectType === 'SNOW') {
        this.y += this.speedY;
        this.x += this.speedX;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * this.swayRadius;
        if (this.y > particlesCanvas.height + 10 || this.x < -10 || this.x > particlesCanvas.width + 10) {
          this.reset(effectType, false);
        }
      } else if (effectType === 'MATRIX') {
        this.y += this.speedY;
        this.frameCounter++;
        if (this.frameCounter % 15 === 0) {
          const chars = '01abcdefghijklmnopqrstuvwxyz日ハミヒーウシ';
          this.char = chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (this.y > particlesCanvas.height + 20) {
          this.reset(effectType, false);
        }
      } else if (effectType === 'STARS') {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > particlesCanvas.height + 50 || this.x < -100) {
          this.reset(effectType, false);
        }
      }
    }
    draw(activeColor) {
      if (!canvasCtx) return;
      canvasCtx.save();

      if (this.effectType === 'GLOW') {
        canvasCtx.translate(this.x, this.y);
        canvasCtx.globalAlpha = this.opacity;
        const gradient = canvasCtx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, activeColor);
        gradient.addColorStop(1, 'transparent');
        canvasCtx.fillStyle = gradient;
        canvasCtx.beginPath();
        canvasCtx.arc(0, 0, this.size, 0, Math.PI * 2);
        canvasCtx.fill();
      } else if (this.effectType === 'SAKURA') {
        canvasCtx.translate(this.x, this.y);
        canvasCtx.rotate(this.angle);
        canvasCtx.globalAlpha = this.opacity;
        canvasCtx.fillStyle = '#ff75a0';
        canvasCtx.beginPath();
        canvasCtx.ellipse(0, 0, this.size, this.size * 1.4, 0, 0, Math.PI * 2);
        canvasCtx.fill();
        canvasCtx.strokeStyle = '#ffa3c4';
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, this.size * 1.4);
        canvasCtx.lineTo(0, -this.size * 0.4);
        canvasCtx.stroke();
      } else if (this.effectType === 'SNOW') {
        canvasCtx.translate(this.x, this.y);
        canvasCtx.globalAlpha = this.opacity;
        const gradient = canvasCtx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'transparent');
        canvasCtx.fillStyle = gradient;
        canvasCtx.beginPath();
        canvasCtx.arc(0, 0, this.size, 0, Math.PI * 2);
        canvasCtx.fill();
      } else if (this.effectType === 'MATRIX') {
        canvasCtx.translate(this.x, this.y);
        canvasCtx.globalAlpha = this.opacity;
        canvasCtx.font = `${this.size}px monospace`;
        canvasCtx.fillStyle = activeColor;
        canvasCtx.shadowColor = activeColor;
        canvasCtx.shadowBlur = 8;
        canvasCtx.fillText(this.char, 0, 0);
      } else if (this.effectType === 'STARS') {
        canvasCtx.globalAlpha = this.opacity;
        canvasCtx.strokeStyle = activeColor;
        canvasCtx.lineWidth = this.lineWidth;
        canvasCtx.shadowColor = activeColor;
        canvasCtx.shadowBlur = 6;
        canvasCtx.beginPath();
        canvasCtx.moveTo(this.x, this.y);
        canvasCtx.lineTo(this.x - this.size, this.y - this.size * 0.8);
        canvasCtx.stroke();
      }
      canvasCtx.restore();
    }
  }

  function initParticles(effectType) {
    particlesArray = [];
    if (effectType === 'NONE') return;
    let count = 45;
    if (effectType === 'SNOW') count = 75;
    if (effectType === 'MATRIX') count = 50;
    const densityAdjuster = Math.min(count, Math.floor((window.innerWidth * window.innerHeight) / 25000));
    const finalCount = effectType === 'STARS' ? 6 : densityAdjuster;
    for (let i = 0; i < finalCount; i++) {
      particlesArray.push(new Particle(effectType));
    }
  }

  function animateParticles() {
    if (!canvasCtx || !particlesCanvas) return;
    canvasCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    const selectedEffect = effectSelects[0] ? effectSelects[0].value : 'GLOW';
    if (selectedEffect === 'NONE') {
      animationFrameId = requestAnimationFrame(animateParticles);
      return;
    }
    const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-blue').trim() || '#00f0ff';
    particlesArray.forEach(particle => {
      particle.update(selectedEffect);
      particle.draw(activeColor);
    });
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  function toggleParticles(isEnabled) {
    if (isEnabled) {
      if (particlesCanvas) particlesCanvas.style.display = 'block';
      if (!animationFrameId) animateParticles();
    } else {
      if (particlesCanvas) {
        particlesCanvas.style.display = 'none';
        canvasCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }

  function applyParticlesLayer(layer) {
    if (!particlesCanvas) return;
    particlesCanvas.style.zIndex = layer === 'FRONT' ? '999' : '-1';
    layerSelects.forEach(sel => sel.value = layer);
  }

  // Load effects config from cache
  const savedEffect = localStorage.getItem('hophub_particles_effect') || 'GLOW';
  const savedLayer = localStorage.getItem('hophub_particles_layer') || 'BACK';
  applyParticlesLayer(savedLayer);

  // Sync selectors & toggle particles engine
  effectSelects.forEach(sel => {
    sel.value = savedEffect;
    sel.addEventListener('change', (e) => {
      const selected = e.target.value;
      localStorage.setItem('hophub_particles_effect', selected);
      
      // Update both selects dropdowns
      effectSelects.forEach(s => s.value = selected);

      if (selected !== 'NONE') {
        initParticles(selected);
        toggleParticles(true);
        showToast('success', `Đã đổi hiệu ứng sang: ${sel.options[sel.selectedIndex].text}!`);
      } else {
        toggleParticles(false);
        showToast('success', 'Đã tắt hiệu ứng hạt bay!');
      }
    });
  });

  layerSelects.forEach(sel => {
    sel.value = savedLayer;
    sel.addEventListener('change', (e) => {
      const selected = e.target.value;
      localStorage.setItem('hophub_particles_layer', selected);
      
      // Update both selects dropdowns
      layerSelects.forEach(s => s.value = selected);
      applyParticlesLayer(selected);
      showToast('success', selected === 'FRONT' ? 'Hiệu ứng hiển thị đè lên trên!' : 'Hiệu ứng hiển thị dưới nền!');
    });
  });

  // Start animation if active
  if (savedEffect !== 'NONE') {
    initParticles(savedEffect);
    toggleParticles(true);
  }

  // 5. Restore Default customizer
  resetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('hophub_theme_color');
      localStorage.removeItem('hophub_glass_opacity');
      localStorage.removeItem('hophub_particles_effect');
      localStorage.removeItem('hophub_particles_layer');
      
      const root = document.documentElement;
      root.style.removeProperty('--primary-blue');
      root.style.removeProperty('--primary-hover');
      root.style.removeProperty('--cyber-border');
      root.style.removeProperty('--cyber-border-hover');
      
      const savedBg = localStorage.getItem('hophub_custom_bg');
      applyCustomBackground(savedBg);
      applyGlassOpacity(65);

      effectSelects.forEach(sel => sel.value = 'GLOW');
      layerSelects.forEach(sel => sel.value = 'BACK');
      localStorage.setItem('hophub_particles_effect', 'GLOW');
      localStorage.setItem('hophub_particles_layer', 'BACK');
      
      initParticles('GLOW');
      toggleParticles(true);
      applyParticlesLayer('BACK');
      applyThemeColor('#00f0ff');
      showToast('success', 'Đã khôi phục thiết lập giao diện mặc định!');
    });
  });

  // Re-sync customize components on Dark/Light Theme toggles
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTimeout(() => {
        const currentActiveColor = localStorage.getItem('hophub_theme_color') || '#00f0ff';
        applyThemeColor(currentActiveColor);
        
        const savedBg = localStorage.getItem('hophub_custom_bg');
        if (savedBg) applyCustomBackground(savedBg);

        const currentOpacity = localStorage.getItem('hophub_glass_opacity') || 65;
        applyGlassOpacity(parseInt(currentOpacity, 10));

        const savedEff = localStorage.getItem('hophub_particles_effect') || 'GLOW';
        if (savedEff !== 'NONE') {
          initParticles(savedEff);
          toggleParticles(true);
        } else {
          toggleParticles(false);
        }
      }, 50);
    });
  }
}

// Helpers
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function lightenDarkenColor(col, amt) {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  let num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

