const fs = require('fs');
const path = require('path');

const appJsContent = `/**
 * App.js - RandomLeague (Firebase + CRUD + Dropdowns)
 */

const App = {
  data: {
    players: [],
    matches: [],
    finances: [],
    rules: [],
    rankings: null,
    playerStats: null,
    news: []
  },

  isAdmin: true,

  init: async function() {
    await this.fetchData();
    this.processData();
    this.renderCurrentPage();
    this.initModalsContainer();
  },

  fetchData: async function() {
    const allData = await DB.getAllData();
    this.data = { ...this.data, ...allData };
  },

  processData: function() {
    if (typeof Calculator !== 'undefined') {
      this.data.rankings = Calculator.calculateRankings(this.data.matches);
      this.data.playerStats = Calculator.calculatePlayerStats(this.data.matches, this.data.players);
    }
    if (typeof Generator !== 'undefined' && this.data.rankings) {
      this.data.news = Generator.generateAllNews(this.data.rankings, this.data.playerStats);
    }
  },

  initModalsContainer: function() {
    if (!document.getElementById('modal-container')) {
      const div = document.createElement('div');
      div.id = 'modal-container';
      document.body.appendChild(div);
    }
  },

  renderCurrentPage: function() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    this.renderNavbar(page);

    if (page === 'index.html' || page === '') {
      this.renderRankings();
    } else if (page === 'players.html') {
      this.renderPlayers();
    } else if (page === 'results.html') {
      this.renderResults();
    } else if (page === 'finances.html') {
      this.renderFinances();
    } else if (page === 'rules.html') {
      this.renderRules();
    } else if (page === 'news.html') {
      this.renderNews();
    }
  },

  renderNavbar: function(currentPage) {
    const navHtml = \`
      <nav class="glass sticky top-0 z-50 px-4 py-3 mb-6">
        <div class="max-w-6xl mx-auto flex flex-wrap justify-between items-center">
          <a href="index.html" class="flex items-center space-x-2">
            <span class="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Random<span class="text-white">League</span>
            </span>
          </a>
          <div id="nav-links" class="flex flex-row w-full mt-4 space-x-4 md:space-x-6 text-sm font-medium overflow-x-auto pb-2 whitespace-nowrap" style="-webkit-overflow-scrolling: touch; scrollbar-width: none;">
            <a href="index.html" class="nav-link py-1 \${(currentPage === 'index.html' || currentPage === '') ? 'active' : ''}">BXH</a>
            <a href="results.html" class="nav-link py-1 \${currentPage === 'results.html' ? 'active' : ''}">Kết quả</a>
            <a href="players.html" class="nav-link py-1 \${currentPage === 'players.html' ? 'active' : ''}">Cầu thủ</a>
            <a href="finances.html" class="nav-link py-1 \${currentPage === 'finances.html' ? 'active' : ''}">Tài chính</a>
            <a href="news.html" class="nav-link py-1 \${currentPage === 'news.html' ? 'active' : ''}">Tin tức</a>
            <a href="rules.html" class="nav-link py-1 \${currentPage === 'rules.html' ? 'active' : ''}">Luật</a>
          </div>
        </div>
      </nav>
    \`;
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
      navContainer.innerHTML = navHtml;
    }
  },

  renderRankings: function() {
    const container = document.getElementById('rankings-container');
    if (!container || !this.data.rankings) return;

    let html = \`
      <div class="glass-panel rounded-2xl overflow-hidden fade-in">
        <div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 class="text-2xl font-bold font-display">Bảng Xếp Hạng Tổng</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-black/20 text-emerald-400 text-sm uppercase tracking-wider">
                <th class="p-4 font-semibold">Hạng</th>
                <th class="p-4 font-semibold">Đội bóng</th>
                <th class="p-4 font-semibold text-center">Số Trận</th>
                <th class="p-4 font-semibold text-center">Hiệu Số</th>
                <th class="p-4 font-semibold text-center text-xl text-white">Điểm</th>
              </tr>
            </thead>
            <tbody>
    \`;

    this.data.rankings.overall.forEach((team, index) => {
      let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
      html += \`
        <tr class="border-b border-white/5 table-row-hover transition-colors">
          <td class="p-4 font-bold text-lg">\${medal} \${index + 1}</td>
          <td class="p-4 font-bold text-white flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr \${index===0?'from-yellow-400 to-orange-500':index===1?'from-gray-300 to-gray-500':'from-amber-700 to-amber-900'} flex items-center justify-center shadow-lg">
              \${team.name.charAt(0)}
            </div>
            <span>\${team.name}</span>
          </td>
          <td class="p-4 text-center text-gray-300">\${team.matchesPlayed}</td>
          <td class="p-4 text-center text-gray-300">\${team.goalDifference > 0 ? '+'+team.goalDifference : team.goalDifference}</td>
          <td class="p-4 text-center font-bold text-2xl text-emerald-400">\${team.totalPoints}</td>
        </tr>
      \`;
    });

    html += \`</tbody></table></div></div>\`;
    container.innerHTML = html;

    const roundContainer = document.getElementById('round-rankings-container');
    if (roundContainer) {
      let roundHtml = '';
      const rounds = Object.keys(this.data.rankings.byRound).sort((a,b) => b-a);
      rounds.forEach((r, idx) => {
        roundHtml += \`
          <div class="glass-panel rounded-xl p-5 fade-in delay-\${(idx+1)*100}">
            <h3 class="text-lg font-bold text-cyan-400 mb-3 border-b border-white/10 pb-2">Hệ số Vòng \${r}</h3>
            <ul class="space-y-2">
        \`;
        this.data.rankings.byRound[r].forEach((t, i) => {
          let pts = i === 0 ? '+2đ' : i === 1 ? '+1đ' : '0đ';
          let color = i === 0 ? 'text-emerald-400' : i === 1 ? 'text-yellow-400' : 'text-gray-400';
          roundHtml += \`
            <li class="flex justify-between items-center bg-black/20 p-2 rounded">
              <span class="font-medium">\${i+1}. \${t.name}</span>
              <span class="font-bold \${color}">\${t.matchPoints} hs <span class="text-xs bg-white/10 px-2 py-0.5 rounded ml-2">\${pts}</span></span>
            </li>
          \`;
        });
        roundHtml += \`</ul></div>\`;
      });
      roundContainer.innerHTML = roundHtml;
    }
  },

  renderPlayers: function() {
    const container = document.getElementById('players-container');
    if (!container || !this.data.playerStats) return;

    let adminBtn = this.isAdmin ? \`<button onclick="App.openPlayerModal()" class="mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all">+ Thêm Cầu Thủ</button>\` : '';

    const teams = {};
    this.data.playerStats.forEach(p => {
      if (!teams[p.team]) teams[p.team] = [];
      teams[p.team].push(p);
    });

    let html = adminBtn;

    Object.keys(teams).forEach((teamName, tIdx) => {
      html += \`
        <div class="mb-10 w-full col-span-full">
          <h2 class="text-2xl font-bold font-display text-emerald-400 mb-4 border-b border-emerald-500/30 pb-2">\${teamName}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      \`;
      
      teams[teamName].forEach((p, idx) => {
        let editBtn = this.isAdmin ? \`<button onclick="App.openPlayerModal('\${p.id}')" class="absolute top-2 right-2 text-gray-400 hover:text-white p-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>\` : '';

        html += \`
          <div class="glass-panel rounded-2xl p-5 flex flex-col items-center hover-scale fade-in relative delay-\${(idx%3)*100}">
            \${editBtn}
            <img src="\${p.img}" alt="\${p.name}" class="w-24 h-24 rounded-full border-4 border-emerald-500/30 object-cover mb-4 shadow-lg">
            <h3 class="text-xl font-bold font-display text-white">\${p.name}</h3>
            <span class="text-sm text-cyan-400 font-medium mb-2">\${p.team} - \${p.info}</span>
            <div class="w-full flex justify-around mt-4 pt-4 border-t border-white/10">
              <div class="text-center">
                <div class="text-2xl font-bold text-emerald-400">\${p.goals}</div>
                <div class="text-xs text-gray-400 uppercase">Bàn thắng</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-400">\${p.yellowCards}</div>
                <div class="text-xs text-gray-400 uppercase">Thẻ vàng</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-red-500">\${p.redCards}</div>
                <div class="text-xs text-gray-400 uppercase">Thẻ đỏ</div>
              </div>
            </div>
          </div>
        \`;
      });
      html += \`</div></div>\`;
    });
    
    container.innerHTML = html;
  },

  renderResults: function() {
    const container = document.getElementById('results-container');
    if (!container) return;

    let adminBtn = this.isAdmin ? \`<button onclick="App.openMatchModal()" class="mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all">+ Thêm Trận Đấu</button>\` : '';

    const byRound = {};
    this.data.matches.forEach(m => {
      if (!byRound[m.round]) byRound[m.round] = [];
      byRound[m.round].push(m);
    });

    let html = adminBtn;

    Object.keys(byRound).sort((a,b)=>b-a).forEach((r, idx) => {
      html += \`<div class="mb-8 fade-in delay-\${idx*100}">
        <h2 class="text-2xl font-bold font-display mb-4 text-emerald-400 flex items-center">
          <span class="w-8 h-1 bg-emerald-500 mr-3 rounded"></span>Vòng \${r}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">\`;
      
      byRound[r].forEach(m => {
        let editBtn = this.isAdmin ? \`<button onclick="App.openMatchModal('\${m.id}')" class="text-emerald-400 hover:text-white text-sm">Sửa</button>\` : '';
        html += \`
          <div class="glass-panel rounded-xl p-4 hover-scale transition-all relative">
            <div class="flex justify-between items-center mb-3 text-sm text-gray-400">
              <span>Trận \${m.match}</span>
              \${editBtn}
            </div>
            <div class="flex justify-between items-center mb-4">
              <div class="font-bold text-lg w-2/5 text-right">\${m.teamA}</div>
              <div class="w-1/5 text-center px-2 py-1 bg-black/40 rounded-lg text-xl font-bold text-white shadow-inner">
                \${m.scoreA !== '' ? m.scoreA : '?'} - \${m.scoreB !== '' ? m.scoreB : '?'}
              </div>
              <div class="font-bold text-lg w-2/5 text-left">\${m.teamB}</div>
            </div>
            \${(m.scorers || m.cards) ? \`
              <div class="mt-3 pt-3 border-t border-white/5 text-sm">
                \${m.scorers ? \`<div class="text-emerald-400 mb-1">⚽ \${m.scorers}</div>\` : ''}
                \${m.cards ? \`<div class="text-yellow-500">🟨🟥 \${m.cards}</div>\` : ''}
              </div>
            \` : ''}
          </div>
        \`;
      });
      html += \`</div></div>\`;
    });
    container.innerHTML = html;
  },

  renderFinances: function() {
    const container = document.getElementById('finances-container');
    if (!container) return;

    let adminBtn = this.isAdmin ? \`<button onclick="App.openFinanceModal()" class="mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all">+ Thêm Giao Dịch</button>\` : '';

    let html = adminBtn + \`
      <div class="glass-panel rounded-2xl overflow-hidden fade-in">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-black/20 text-cyan-400 text-sm uppercase tracking-wider">
              <th class="p-4 font-semibold">Ngày</th>
              <th class="p-4 font-semibold">Nội dung</th>
              <th class="p-4 font-semibold text-right text-emerald-400">Thu</th>
              <th class="p-4 font-semibold text-right text-red-400">Chi</th>
              <th class="p-4 font-semibold text-right">Tồn Quỹ</th>
              \${this.isAdmin ? '<th class="p-4 font-semibold text-center">Sửa</th>' : ''}
            </tr>
          </thead>
          <tbody>
    \`;

    this.data.finances.forEach(f => {
      const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
      let editBtn = this.isAdmin ? \`<td class="p-4 text-center"><button onclick="App.openFinanceModal('\${f.id}')" class="text-cyan-400 hover:text-white">✏️</button></td>\` : '';
      html += \`
        <tr class="border-b border-white/5 table-row-hover">
          <td class="p-4 text-gray-300 text-sm">\${f.date}</td>
          <td class="p-4 font-medium text-white">\${f.content} <br><span class="text-xs text-gray-500">\${f.note}</span></td>
          <td class="p-4 text-right text-emerald-400 font-medium">\${f.in > 0 ? '+' + formatCurrency(f.in) : '-'}</td>
          <td class="p-4 text-right text-red-400 font-medium">\${f.out > 0 ? '-' + formatCurrency(f.out) : '-'}</td>
          <td class="p-4 text-right font-bold text-cyan-400">\${formatCurrency(f.balance)}</td>
          \${editBtn}
        </tr>
      \`;
    });

    html += \`</tbody></table></div>\`;
    container.innerHTML = html;
  },

  renderRules: function() {
    const container = document.getElementById('rules-container');
    if (!container) return;

    let adminBtn = this.isAdmin ? \`<button onclick="App.openRuleModal()" class="mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all">+ Thêm Luật</button>\` : '';

    let html = adminBtn + '<div class="space-y-4">';
    this.data.rules.forEach((r, idx) => {
      let editBtn = this.isAdmin ? \`<button onclick="App.openRuleModal('\${r.id}')" class="absolute top-4 right-4 text-gray-400 hover:text-white">✏️</button>\` : '';
      html += \`
        <div class="glass-panel rounded-xl p-5 fade-in delay-\${idx*100} relative">
          \${editBtn}
          <h3 class="text-xl font-bold font-display text-emerald-400 mb-2">\${r.rule}</h3>
          <p class="text-gray-300 leading-relaxed">\${r.detail}</p>
        </div>
      \`;
    });
    html += '</div>';
    container.innerHTML = html;
  },

  renderNews: function() {
    const container = document.getElementById('news-container');
    if (!container) return;

    if (this.data.news.length === 0) {
      container.innerHTML = \`<div class="glass-panel p-8 text-center text-gray-400 rounded-xl">Chưa có tin tức nào.</div>\`;
      return;
    }

    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
    this.data.news.forEach((n, idx) => {
      const contentHtml = n.content.replace(/\\*\\*(.*?)\\*\\*/g, '<span class="font-bold text-white">$1</span>');
      html += \`
        <div class="glass-panel rounded-2xl p-6 hover-scale fade-in delay-\${idx*100} border-l-4 border-l-emerald-500">
          <div class="text-xs text-emerald-400 mb-2 font-bold uppercase tracking-wider">\${n.date}</div>
          <h3 class="text-xl font-bold font-display text-white mb-3">\${n.title}</h3>
          <p class="text-gray-300 leading-relaxed text-sm">\${contentHtml}</p>
        </div>
      \`;
    });
    html += '</div>';
    container.innerHTML = html;
  },

  // ---- CRUD MODALS ----
  
  updateDropdowns: function() {
    const teamA = document.getElementById('m-teamA').value;
    const teamB = document.getElementById('m-teamB').value;
    const playersA = this.data.players.filter(p => p.team === teamA);
    const playersB = this.data.players.filter(p => p.team === teamB);
    const allPlayers = [...playersA, ...playersB];

    const pSelect = document.getElementById('m-quick-player');
    if(pSelect) {
      pSelect.innerHTML = allPlayers.map(p => \`<option value="\${p.name}">\${p.name} (\${p.team})</option>\`).join('');
    }
  },

  addQuickAction: function() {
    const player = document.getElementById('m-quick-player').value;
    const type = document.getElementById('m-quick-type').value;
    
    if(type === 'goal') {
      const el = document.getElementById('m-scorers');
      el.value = el.value ? el.value + ', ' + player + '(1)' : player + '(1)';
    } else if(type === 'yellow') {
      const el = document.getElementById('m-cards');
      el.value = el.value ? el.value + ', ' + player + '(Y)' : player + '(Y)';
    } else if(type === 'red') {
      const el = document.getElementById('m-cards');
      el.value = el.value ? el.value + ', ' + player + '(R)' : player + '(R)';
    }
  },

  openMatchModal: function(id = null) {
    let m = id ? this.data.matches.find(x => x.id === id) : { id: 'm' + Date.now(), round: 1, match: 1, teamA: 'Sodapop', teamB: 'Chiến Lang', scoreA: '', scoreB: '', scorers: '', cards: '' };
    
    const teamOptions = ['Sodapop', 'Chiến Lang', 'Thiết Thành'].map(t => \`<option value="\${t}" \${m.teamA===t?'selected':''}>\${t}</option>\`).join('');
    const teamBOptions = ['Sodapop', 'Chiến Lang', 'Thiết Thành'].map(t => \`<option value="\${t}" \${m.teamB===t?'selected':''}>\${t}</option>\`).join('');

    const html = \`
      <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
        <div class="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
          <h2 class="text-2xl font-bold text-white mb-4">\${id ? 'Sửa' : 'Thêm'} Trận Đấu</h2>
          <div class="space-y-4">
            <div class="flex space-x-4">
              <div class="w-1/2"><label class="block text-gray-400 text-sm mb-1">Vòng</label><input type="number" id="m-round" value="\${m.round}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"></div>
              <div class="w-1/2"><label class="block text-gray-400 text-sm mb-1">Trận thứ</label><input type="number" id="m-match" value="\${m.match}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"></div>
            </div>
            
            <div class="flex space-x-4 items-center">
              <div class="w-2/5">
                <label class="block text-gray-400 text-sm mb-1">Đội A</label>
                <select id="m-teamA" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" onchange="App.updateDropdowns()">
                  \${teamOptions}
                </select>
              </div>
              <div class="w-1/5 text-center mt-6">
                <span class="text-gray-500 font-bold">VS</span>
              </div>
              <div class="w-2/5">
                <label class="block text-gray-400 text-sm mb-1">Đội B</label>
                <select id="m-teamB" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" onchange="App.updateDropdowns()">
                  \${teamBOptions}
                </select>
              </div>
            </div>

            <div class="flex space-x-4">
              <div class="w-1/2"><label class="block text-gray-400 text-sm mb-1">Tỉ số Đội A</label><input type="number" id="m-scoreA" value="\${m.scoreA}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-xl font-bold text-center focus:border-emerald-500 focus:outline-none"></div>
              <div class="w-1/2"><label class="block text-gray-400 text-sm mb-1">Tỉ số Đội B</label><input type="number" id="m-scoreB" value="\${m.scoreB}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-xl font-bold text-center focus:border-emerald-500 focus:outline-none"></div>
            </div>

            <div class="p-3 bg-white/5 rounded-lg border border-white/10">
              <label class="block text-emerald-400 text-sm font-bold mb-2">Thêm nhanh Ghi Bàn / Thẻ Phạt</label>
              <div class="flex space-x-2">
                <select id="m-quick-player" class="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-emerald-500 focus:outline-none"></select>
                <select id="m-quick-type" class="w-1/3 bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-emerald-500 focus:outline-none">
                  <option value="goal">⚽ Ghi bàn (1)</option>
                  <option value="yellow">🟨 Thẻ Vàng (Y)</option>
                  <option value="red">🟥 Thẻ Đỏ (R)</option>
                </select>
                <button onclick="App.addQuickAction()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-sm font-bold">+</button>
              </div>
            </div>

            <div><label class="block text-gray-400 text-sm mb-1">Ghi bàn (Chi tiết)</label><input type="text" id="m-scorers" value="\${m.scorers}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"></div>
            <div><label class="block text-gray-400 text-sm mb-1">Thẻ phạt (Chi tiết)</label><input type="text" id="m-cards" value="\${m.cards}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"></div>
            
          </div>
          <div class="mt-6 flex justify-between">
            \${id ? \`<button onclick="App.deleteMatch('\${id}')" class="text-red-500 hover:text-red-400">Xóa</button>\` : '<div></div>'}
            <div class="space-x-3">
              <button onclick="document.getElementById('modal-container').innerHTML=''" class="text-gray-400 hover:text-white px-4 py-2">Hủy</button>
              <button onclick="App.saveMatch('\${m.id}')" class="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold">Lưu</button>
            </div>
          </div>
        </div>
      </div>
    \`;
    document.getElementById('modal-container').innerHTML = html;
    this.updateDropdowns(); // Load players immediately
  },

  saveMatch: function(id) {
    let m = {
      id: id,
      round: parseInt(document.getElementById('m-round').value) || 1,
      match: parseInt(document.getElementById('m-match').value) || 1,
      teamA: document.getElementById('m-teamA').value,
      teamB: document.getElementById('m-teamB').value,
      scoreA: document.getElementById('m-scoreA').value,
      scoreB: document.getElementById('m-scoreB').value,
      scorers: document.getElementById('m-scorers').value,
      cards: document.getElementById('m-cards').value
    };
    if (m.scoreA !== '') m.scoreA = parseInt(m.scoreA);
    if (m.scoreB !== '') m.scoreB = parseInt(m.scoreB);

    let idx = this.data.matches.findIndex(x => x.id === id);
    if (idx >= 0) this.data.matches[idx] = m;
    else this.data.matches.push(m);

    DB.saveData(this.data);
    document.getElementById('modal-container').innerHTML = '';
    this.init();
  },

  deleteMatch: function(id) {
    if(confirm('Bạn có chắc chắn muốn xóa trận đấu này?')) {
      this.data.matches = this.data.matches.filter(x => x.id !== id);
      DB.saveData(this.data);
      document.getElementById('modal-container').innerHTML = '';
      this.init();
    }
  },

  openPlayerModal: function(id = null) {
    let p = id ? this.data.players.find(x => x.id === id) : { id: 'p' + Date.now(), name: '', team: 'Sodapop', info: 'Cầu thủ', img: 'https://i.pravatar.cc/150?u='+Date.now() };
    const html = \`
      <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
        <div class="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 relative">
          <h2 class="text-2xl font-bold text-white mb-4">\${id ? 'Sửa' : 'Thêm'} Cầu Thủ</h2>
          <div class="space-y-4">
            <div><label class="block text-gray-400 text-sm mb-1">Tên cầu thủ</label><input type="text" id="p-name" value="\${p.name}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
            <div>
              <label class="block text-gray-400 text-sm mb-1">Đội bóng</label>
              <select id="p-team" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white">
                <option value="Sodapop" \${p.team === 'Sodapop' ? 'selected' : ''}>Sodapop</option>
                <option value="Chiến Lang" \${p.team === 'Chiến Lang' ? 'selected' : ''}>Chiến Lang</option>
                <option value="Thiết Thành" \${p.team === 'Thiết Thành' ? 'selected' : ''}>Thiết Thành</option>
              </select>
            </div>
            <div><label class="block text-gray-400 text-sm mb-1">Vị trí/Vai trò</label><input type="text" id="p-info" value="\${p.info}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
            <div><label class="block text-gray-400 text-sm mb-1">Link Ảnh (URL)</label><input type="text" id="p-img" value="\${p.img}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-xs"></div>
          </div>
          <div class="mt-6 flex justify-between">
            \${id ? \`<button onclick="App.deletePlayer('\${id}')" class="text-red-500 hover:text-red-400">Xóa</button>\` : '<div></div>'}
            <div class="space-x-3">
              <button onclick="document.getElementById('modal-container').innerHTML=''" class="text-gray-400 hover:text-white px-4 py-2">Hủy</button>
              <button onclick="App.savePlayer('\${p.id}')" class="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold">Lưu</button>
            </div>
          </div>
        </div>
      </div>
    \`;
    document.getElementById('modal-container').innerHTML = html;
  },

  savePlayer: function(id) {
    let p = {
      id: id,
      name: document.getElementById('p-name').value,
      team: document.getElementById('p-team').value,
      info: document.getElementById('p-info').value,
      img: document.getElementById('p-img').value
    };
    let idx = this.data.players.findIndex(x => x.id === id);
    if (idx >= 0) this.data.players[idx] = p;
    else this.data.players.push(p);

    DB.saveData(this.data);
    document.getElementById('modal-container').innerHTML = '';
    this.init();
  },

  deletePlayer: function(id) {
    if(confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')) {
      this.data.players = this.data.players.filter(x => x.id !== id);
      DB.saveData(this.data);
      document.getElementById('modal-container').innerHTML = '';
      this.init();
    }
  },

  openFinanceModal: function(id = null) {
    let f = id ? this.data.finances.find(x => x.id === id) : { id: 'f' + Date.now(), date: '', content: '', in: 0, out: 0, balance: 0, note: '' };
    const html = \`
      <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
        <div class="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 relative">
          <h2 class="text-2xl font-bold text-white mb-4">\${id ? 'Sửa' : 'Thêm'} Tài Chính</h2>
          <div class="space-y-4">
            <div><label class="block text-gray-400 text-sm mb-1">Ngày</label><input type="text" id="f-date" value="\${f.date}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
            <div><label class="block text-gray-400 text-sm mb-1">Nội dung</label><input type="text" id="f-content" value="\${f.content}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
            <div class="flex space-x-4">
              <div class="w-1/2"><label class="block text-gray-400 text-sm mb-1">Thu</label><input type="number" id="f-in" value="\${f.in}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
              <div class="w-1/2"><label class="block text-gray-400 text-sm mb-1">Chi</label><input type="number" id="f-out" value="\${f.out}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
            </div>
            <div><label class="block text-gray-400 text-sm mb-1">Tồn quỹ hiện tại</label><input type="number" id="f-balance" value="\${f.balance}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
            <div><label class="block text-gray-400 text-sm mb-1">Ghi chú</label><input type="text" id="f-note" value="\${f.note}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
          </div>
          <div class="mt-6 flex justify-between">
            \${id ? \`<button onclick="App.deleteFinance('\${id}')" class="text-red-500 hover:text-red-400">Xóa</button>\` : '<div></div>'}
            <div class="space-x-3">
              <button onclick="document.getElementById('modal-container').innerHTML=''" class="text-gray-400 hover:text-white px-4 py-2">Hủy</button>
              <button onclick="App.saveFinance('\${f.id}')" class="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold">Lưu</button>
            </div>
          </div>
        </div>
      </div>
    \`;
    document.getElementById('modal-container').innerHTML = html;
  },

  saveFinance: function(id) {
    let f = {
      id: id,
      date: document.getElementById('f-date').value,
      content: document.getElementById('f-content').value,
      in: parseInt(document.getElementById('f-in').value) || 0,
      out: parseInt(document.getElementById('f-out').value) || 0,
      balance: parseInt(document.getElementById('f-balance').value) || 0,
      note: document.getElementById('f-note').value
    };
    let idx = this.data.finances.findIndex(x => x.id === id);
    if (idx >= 0) this.data.finances[idx] = f;
    else this.data.finances.push(f);

    DB.saveData(this.data);
    document.getElementById('modal-container').innerHTML = '';
    this.init();
  },

  deleteFinance: function(id) {
    if(confirm('Xóa giao dịch này?')) {
      this.data.finances = this.data.finances.filter(x => x.id !== id);
      DB.saveData(this.data);
      document.getElementById('modal-container').innerHTML = '';
      this.init();
    }
  },

  openRuleModal: function(id = null) {
    let r = id ? this.data.rules.find(x => x.id === id) : { id: 'r' + Date.now(), rule: '', detail: '' };
    const html = \`
      <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
        <div class="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 relative">
          <h2 class="text-2xl font-bold text-white mb-4">\${id ? 'Sửa' : 'Thêm'} Luật</h2>
          <div class="space-y-4">
            <div><label class="block text-gray-400 text-sm mb-1">Tiêu đề luật</label><input type="text" id="r-rule" value="\${r.rule}" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"></div>
            <div><label class="block text-gray-400 text-sm mb-1">Chi tiết</label><textarea id="r-detail" rows="4" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white">\${r.detail}</textarea></div>
          </div>
          <div class="mt-6 flex justify-between">
            \${id ? \`<button onclick="App.deleteRule('\${id}')" class="text-red-500 hover:text-red-400">Xóa</button>\` : '<div></div>'}
            <div class="space-x-3">
              <button onclick="document.getElementById('modal-container').innerHTML=''" class="text-gray-400 hover:text-white px-4 py-2">Hủy</button>
              <button onclick="App.saveRule('\${r.id}')" class="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold">Lưu</button>
            </div>
          </div>
        </div>
      </div>
    \`;
    document.getElementById('modal-container').innerHTML = html;
  },

  saveRule: function(id) {
    let r = {
      id: id,
      rule: document.getElementById('r-rule').value,
      detail: document.getElementById('r-detail').value
    };
    let idx = this.data.rules.findIndex(x => x.id === id);
    if (idx >= 0) this.data.rules[idx] = r;
    else this.data.rules.push(r);

    DB.saveData(this.data);
    document.getElementById('modal-container').innerHTML = '';
    this.init();
  },

  deleteRule: function(id) {
    if(confirm('Xóa luật này?')) {
      this.data.rules = this.data.rules.filter(x => x.id !== id);
      DB.saveData(this.data);
      document.getElementById('modal-container').innerHTML = '';
      this.init();
    }
  }

};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
`;

fs.writeFileSync(path.join('c:\\Users\\ULTRA 9\\Desktop\\Football\\js', 'app.js'), appJsContent, 'utf8');
console.log('app.js generated successfully.');
