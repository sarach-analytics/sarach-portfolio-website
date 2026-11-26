/* Playground: Echo demo, Spot the misleading chart, Pick the metric, Data health check. */
(function () {
  'use strict';
  var D = window.NB_DATA, NB = window.NB;
  if (!D || !NB) return;
  var t = NB.t;

  function sum(a, f) { return a.reduce(function (s, x) { return s + f(x); }, 0); }
  function baht(n) { return '฿' + Math.round(n).toLocaleString('en-US'); }
  function pct(n, d) { return (n >= 0 && d ? '+' : '') + n.toFixed(d === undefined ? 1 : d) + '%'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var MON_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  function mon(m, y) { var i = +m.slice(5, 7) - 1; return (NB.lang() === 'th' ? MON_TH[i] : MON_EN[i]) + (y ? ' ' + (NB.lang() === 'th' ? +m.slice(0, 4) + 543 : m.slice(0, 4)) : ''); }
  function period(ms) {
    var r = D.monthly.filter(function (m) { return ms.indexOf(m.m) > -1; });
    return { rows: r, room: sum(r, function (x) { return x.room; }), total: sum(r, function (x) { return x.total; }), avail: sum(r, function (x) { return x.avail; }), sold: sum(r, function (x) { return x.sold; }) };
  }
  var cur = period(D.last12), prev = period(D.prev12);
  var range = D.last12[0] + ' to ' + D.last12[11];

  /* =====================================================
     Echo
     ===================================================== */
  var INTENTS = [
    {
      id: 'forecast', keys: ['next month', 'forecast', 'predict', 'future', 'will we', 'will it', 'next year', 'เดือนหน้า', 'คาดการณ์', 'ทำนาย', 'อนาคต', 'ปีหน้า'],
      q: ['Will next month be busy?', 'เดือนหน้าจะยุ่งไหม'],
      run: function () {
        var last = D.monthly[D.monthly.length - 1].m;
        var y = +last.slice(0, 4), mo = +last.slice(5, 7) + 1; if (mo > 12) { mo = 1; y++; }
        var same = (y - 1) + '-' + String(mo).padStart(2, '0');
        var r = D.monthly.filter(function (x) { return x.m === same; })[0];
        return {
          decline: true,
          text: t('I can\'t forecast. This data only covers nights that already happened, and guessing would look like a fact. What I can tell you: the same month last year (' + mon(same, true) + ') ran at <b>' + (r.sold * 100 / r.avail).toFixed(1) + '%</b> occupancy.',
            'ผมพยากรณ์ไม่ได้ครับ ข้อมูลนี้มีแค่คืนที่ผ่านไปแล้ว ถ้าเดาก็จะดูเหมือนข้อเท็จจริง สิ่งที่บอกได้คือเดือนเดียวกันปีก่อน (' + mon(same, true) + ') มีอัตราเข้าพัก <b>' + (r.sold * 100 / r.avail).toFixed(1) + '%</b>'),
          sql: "SELECT SUM(rooms_sold) * 100.0 / SUM(rooms_available) AS occupancy_pct\nFROM daily_kpi\nWHERE strftime('%Y-%m', business_date) = '" + same + "';",
          cols: ['month', 'rooms_sold', 'rooms_available', 'occupancy_pct'],
          rows: [[same, r.sold, r.avail, (r.sold * 100 / r.avail).toFixed(1)]]
        };
      }
    },
    {
      id: 'commission', keys: ['commission', 'fee', 'cost us', 'ota cost', 'ค่าคอม', 'คอมมิชชั่น', 'ค่าธรรมเนียม'],
      q: ['How much did we pay in commission?', 'เราจ่ายค่าคอมไปเท่าไหร่'],
      run: function () {
        var ch = D.channel.cur.filter(function (c) { return c.comm > 0; }).sort(function (a, b) { return b.rev * b.comm - a.rev * a.comm; });
        var total = sum(ch, function (c) { return c.rev * c.comm / 100; });
        return {
          text: t('In the last 12 months the hotel paid <b>' + baht(total) + '</b> in commission, ' + (total * 100 / cur.room).toFixed(1) + '% of room revenue. The biggest share went to ' + ch[0].name + ' (' + baht(ch[0].rev * ch[0].comm / 100) + ').',
            '12 เดือนล่าสุดโรงแรมจ่ายค่าคอมไป <b>' + baht(total) + '</b> คิดเป็น ' + (total * 100 / cur.room).toFixed(1) + '% ของรายได้ห้อง ก้อนใหญ่สุดคือ ' + ch[0].name + ' (' + baht(ch[0].rev * ch[0].comm / 100) + ')'),
          sql: "SELECT channel, SUM(revenue_thb) AS revenue,\n       ROUND(SUM(revenue_thb * commission_pct / 100.0)) AS commission\nFROM channel_performance\nWHERE business_date BETWEEN :start AND :end\n  AND commission_pct > 0\nGROUP BY channel ORDER BY commission DESC;",
          cols: ['channel', 'revenue', 'commission_pct', 'commission'],
          rows: ch.map(function (c) { return [c.name, baht(c.rev), c.comm + '%', baht(c.rev * c.comm / 100)]; })
        };
      }
    },
    {
      id: 'revenue', keys: ['revenue', 'sales', 'income', 'grow', 'growth', 'last year', 'how did', 'performance', 'รายได้', 'ยอด', 'โต', 'ปีก่อน', 'ผลงาน'],
      q: ['How did revenue do against last year?', 'รายได้เทียบกับปีก่อนเป็นยังไง'],
      run: function () {
        var g = (cur.room / prev.room - 1) * 100, gt = (cur.total / prev.total - 1) * 100;
        return {
          text: t('Room revenue for the last 12 months was <b>' + baht(cur.room) + '</b>, ' + pct(g) + ' on the 12 months before. Total revenue including F&amp;B and other was ' + baht(cur.total) + ' (' + pct(gt) + ').',
            'รายได้ห้อง 12 เดือนล่าสุด <b>' + baht(cur.room) + '</b> โต ' + pct(g) + ' จาก 12 เดือนก่อนหน้า รายได้รวมทั้งอาหารและอื่น ๆ ' + baht(cur.total) + ' (' + pct(gt) + ')'),
          sql: "SELECT CASE WHEN business_date >= :start THEN 'last_12m' ELSE 'prior_12m' END AS period,\n       SUM(room_revenue_thb) AS room_revenue,\n       SUM(total_revenue_thb) AS total_revenue\nFROM daily_kpi\nGROUP BY period;",
          cols: ['period', 'room_revenue', 'total_revenue'],
          rows: [['last_12m', baht(cur.room), baht(cur.total)], ['prior_12m', baht(prev.room), baht(prev.total)]]
        };
      }
    },
    {
      id: 'best', keys: ['best', 'busiest', 'peak', 'highest', 'top month', 'which month', 'ดีที่สุด', 'สูงสุด', 'เดือนไหน', 'พีค'],
      q: ['Which month was the best?', 'เดือนไหนดีที่สุด'],
      run: function () {
        var rows = cur.rows.slice().sort(function (a, b) { return b.room - a.room; });
        var b = rows[0];
        return {
          text: t('<b>' + mon(b.m, true) + '</b> was the best month of the last 12: ' + baht(b.room) + ' in room revenue at ' + (b.sold * 100 / b.avail).toFixed(1) + '% occupancy. Krabi\'s high season runs December to March.',
            '<b>' + mon(b.m, true) + '</b> ดีที่สุดใน 12 เดือนล่าสุด รายได้ห้อง ' + baht(b.room) + ' อัตราเข้าพัก ' + (b.sold * 100 / b.avail).toFixed(1) + '% ไฮซีซั่นของกระบี่คือธันวาคมถึงมีนาคม'),
          sql: "SELECT strftime('%Y-%m', business_date) AS month,\n       SUM(room_revenue_thb) AS room_revenue,\n       SUM(rooms_sold) * 100.0 / SUM(rooms_available) AS occupancy_pct\nFROM daily_kpi\nWHERE business_date BETWEEN :start AND :end\nGROUP BY month ORDER BY room_revenue DESC LIMIT 3;",
          cols: ['month', 'room_revenue', 'occupancy_pct'],
          rows: rows.slice(0, 3).map(function (r) { return [r.m, baht(r.room), (r.sold * 100 / r.avail).toFixed(1)]; })
        };
      }
    },
    {
      id: 'channel', keys: ['channel', 'ota', 'agoda', 'booking.com', 'expedia', 'direct', 'walk-in', 'booked', 'ช่องทาง', 'จองตรง', 'จองผ่าน'],
      q: ['Which booking channel brings the most revenue?', 'ช่องทางจองไหนทำรายได้มากที่สุด'],
      run: function () {
        var ch = D.channel.cur.slice().sort(function (a, b) { return b.rev - a.rev; });
        var direct = sum(D.channel.cur.filter(function (c) { return c.comm === 0; }), function (c) { return c.sold; });
        return {
          text: t('<b>' + ch[0].name + '</b> brought the most room revenue (' + baht(ch[0].rev) + '). Bookings with no commission (direct and walk-in) were ' + (direct * 100 / cur.sold).toFixed(0) + '% of rooms sold.',
            '<b>' + ch[0].name + '</b> ทำรายได้ห้องมากที่สุด (' + baht(ch[0].rev) + ') ส่วนการจองที่ไม่เสียค่าคอม (จองตรงและ walk-in) คิดเป็น ' + (direct * 100 / cur.sold).toFixed(0) + '% ของห้องที่ขายได้'),
          sql: "SELECT channel, SUM(rooms_sold) AS rooms, SUM(revenue_thb) AS revenue\nFROM channel_performance\nWHERE business_date BETWEEN :start AND :end\nGROUP BY channel ORDER BY revenue DESC;",
          cols: ['channel', 'rooms', 'revenue'],
          rows: ch.map(function (c) { return [c.name, c.sold.toLocaleString('en-US'), baht(c.rev)]; })
        };
      }
    },
    {
      id: 'market', keys: ['market', 'country', 'china', 'chinese', 'europe', 'thai guests', 'usa', 'australia', 'guests from', 'where', 'ตลาด', 'ประเทศ', 'จีน', 'ยุโรป', 'ลูกค้าจาก', 'มาจากไหน'],
      q: ['Which guest market grew the most?', 'ลูกค้าตลาดไหนโตมากที่สุด'],
      run: function () {
        var p = {}; D.market.prev.forEach(function (m) { p[m.name] = m.rev; });
        var ms = D.market.cur.map(function (m) { return { name: m.name, rev: m.rev, g: (m.rev / p[m.name] - 1) * 100 }; }).sort(function (a, b) { return b.g - a.g; });
        return {
          text: t('<b>' + ms[0].name + '</b> grew the most: room revenue ' + pct(ms[0].g) + ' on the year before. The slowest was ' + ms[ms.length - 1].name + ' (' + pct(ms[ms.length - 1].g) + ').',
            '<b>' + ms[0].name + '</b> โตมากที่สุด รายได้ห้อง ' + pct(ms[0].g) + ' จากปีก่อน ตลาดที่โตช้าที่สุดคือ ' + ms[ms.length - 1].name + ' (' + pct(ms[ms.length - 1].g) + ')'),
          sql: "SELECT market,\n       SUM(CASE WHEN business_date >= :start THEN revenue_thb END) AS last_12m,\n       SUM(CASE WHEN business_date <  :start THEN revenue_thb END) AS prior_12m\nFROM market_performance\nGROUP BY market ORDER BY last_12m * 1.0 / prior_12m DESC;",
          cols: ['market', 'last_12m', 'growth'],
          rows: ms.map(function (m) { return [m.name, baht(m.rev), pct(m.g)]; })
        };
      }
    },
    {
      id: 'weekend', keys: ['weekend', 'weekday', 'friday', 'saturday', 'สุดสัปดาห์', 'วันหยุด', 'วันธรรมดา', 'เสาร์', 'ศุกร์'],
      q: ['Are weekends busier than weekdays?', 'วันหยุดยุ่งกว่าวันธรรมดาไหม'],
      run: function () {
        var we = D.weekend.filter(function (w) { return w.weekend; })[0], wd = D.weekend.filter(function (w) { return !w.weekend; })[0];
        var a = we.sold * 100 / we.avail, b = wd.sold * 100 / wd.avail;
        return {
          text: t('Yes. Friday and Saturday nights ran at <b>' + a.toFixed(1) + '%</b> occupancy, against ' + b.toFixed(1) + '% on other nights, over the last 12 months.',
            'ใช่ครับ คืนวันศุกร์และเสาร์มีอัตราเข้าพัก <b>' + a.toFixed(1) + '%</b> เทียบกับ ' + b.toFixed(1) + '% ในคืนอื่น ช่วง 12 เดือนล่าสุด'),
          sql: "SELECT CASE WHEN strftime('%w', business_date) IN ('5','6') THEN 'Fri-Sat' ELSE 'Sun-Thu' END AS nights,\n       SUM(rooms_sold) * 100.0 / SUM(rooms_available) AS occupancy_pct\nFROM daily_kpi\nWHERE business_date BETWEEN :start AND :end\nGROUP BY nights;",
          cols: ['nights', 'rooms_sold', 'rooms_available', 'occupancy_pct'],
          rows: [['Fri-Sat', we.sold, we.avail, a.toFixed(1)], ['Sun-Thu', wd.sold, wd.avail, b.toFixed(1)]]
        };
      }
    },
    {
      id: 'room', keys: ['room type', 'suite', 'deluxe', 'standard', 'sea view', 'per room', 'ประเภทห้อง', 'ห้องแบบ', 'สวีท', 'ห้องไหน'],
      q: ['Which room type earns the most per room?', 'ห้องแบบไหนทำเงินต่อห้องได้มากที่สุด'],
      run: function () {
        var r = D.room_type.cur.map(function (x) { return { name: x.name, rp: x.rev / x.avail, occ: x.sold * 100 / x.avail, rev: x.rev }; }).sort(function (a, b) { return b.rp - a.rp; });
        return {
          text: t('The <b>' + r[0].name + '</b> earns the most per available room: ' + baht(r[0].rp) + ' a night (RevPAR). ' + r[r.length - 1].name + ' earns the least at ' + baht(r[r.length - 1].rp) + '.',
            'ห้อง <b>' + r[0].name + '</b> ทำเงินต่อห้องได้มากที่สุด ' + baht(r[0].rp) + ' ต่อคืน (RevPAR) ส่วน ' + r[r.length - 1].name + ' น้อยที่สุดที่ ' + baht(r[r.length - 1].rp)),
          sql: "SELECT room_type,\n       SUM(revenue_thb) * 1.0 / SUM(rooms_available) AS revpar,\n       SUM(rooms_sold) * 100.0 / SUM(rooms_available) AS occupancy_pct\nFROM room_type_performance\nWHERE business_date BETWEEN :start AND :end\nGROUP BY room_type ORDER BY revpar DESC;",
          cols: ['room_type', 'revpar', 'occupancy_pct'],
          rows: r.map(function (x) { return [x.name, baht(x.rp), x.occ.toFixed(1)]; })
        };
      }
    }
  ];

  var log = document.getElementById('echo-log');
  function addMsg(cls, html) {
    var d = document.createElement('div'); d.className = 'msg ' + cls; d.innerHTML = html; log.appendChild(d);
    log.scrollTop = log.scrollHeight; return d;
  }
  function match(q) {
    var s = q.toLowerCase();
    for (var i = 0; i < INTENTS.length; i++) {
      for (var k = 0; k < INTENTS[i].keys.length; k++) if (s.indexOf(INTENTS[i].keys[k]) > -1) return INTENTS[i];
    }
    return null;
  }
  function ask(q, intent) {
    if (!q.trim()) return;
    if (window.NB && NB.track) NB.track('ask_echo', { source: intent ? 'suggested' : 'typed', answered: !!(intent || match(q)) });
    addMsg('user', esc(q));
    var bot = addMsg('bot', '<span class="typing"><i></i><i></i><i></i></span>');
    intent = intent || match(q);
    setTimeout(function () {
      if (!intent) {
        bot.innerHTML = '<div class="ans">' + t('I don\'t know. The data only has nights, rooms, revenue, booking channels, guest markets and room types, so I won\'t guess. Try one of the questions on the left.',
          'ผมไม่รู้ครับ ข้อมูลนี้มีแค่คืน ห้อง รายได้ ช่องทางจอง ตลาดลูกค้า และประเภทห้อง ผมจะไม่เดา ลองคำถามด้านซ้ายดูครับ') + '</div>';
      } else {
        var a = intent.run();
        var table = '<table class="data-table"><thead><tr>' + a.cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
          a.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
        bot.innerHTML = '<div class="ans">' + a.text + '</div>' +
          '<details><summary>' + t('Show the SQL and source rows', 'ดู SQL และแถวข้อมูลต้นทาง') + '</summary><pre>' + esc(a.sql.replace(/:start/g, "'" + D.last12[0] + "-01'").replace(/:end/g, "'" + D.last) + "'") + '</pre>' + table +
          '<p class="small muted" style="margin-top:6px">' + t('Period: ', 'ช่วงเวลา: ') + range + '</p></details>';
      }
      log.scrollTop = log.scrollHeight;
      NB.earn('echo');
    }, 650);
  }
  function renderQs() {
    var box = document.getElementById('echo-qs'); if (!box) return;
    box.innerHTML = '';
    INTENTS.slice().sort(function (a, b) { return a.id === 'forecast' ? 1 : b.id === 'forecast' ? -1 : 0; }).forEach(function (it) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'q';
      b.textContent = t(it.q[0], it.q[1]);
      b.addEventListener('click', function () { ask(b.textContent, it); });
      box.appendChild(b);
    });
  }
  if (log) {
    addMsg('bot', '<div class="ans">' + t('Hi, I\'m Echo. Ask me about Seaside Boutique Hotel\'s last two years. I\'ll show you where every number comes from.', 'สวัสดีครับ ผมคือ Echo ถามผมเรื่องข้อมูล 2 ปีของ Seaside Boutique Hotel ได้เลย ผมจะบอกว่าตัวเลขทุกตัวมาจากไหน') + '</div>');
    renderQs();
    document.getElementById('echo-form').addEventListener('submit', function (e) {
      e.preventDefault(); var i = document.getElementById('echo-in'); ask(i.value); i.value = '';
    });
  }

  /* =====================================================
     Small chart helpers for the game
     ===================================================== */
  var NAVY, SOFT, GOLD, GOLDINK, RULE, FAINT;
  function chartColors() {
    var cs = getComputedStyle(document.documentElement), v = function (n) { return cs.getPropertyValue(n).trim(); };
    NAVY = v('--navy'); SOFT = v('--navy-soft'); GOLD = v('--gold'); GOLDINK = v('--gold-ink'); RULE = v('--rule-strong'); FAINT = v('--faint');
  }
  chartColors();
  function svgOpen(label) { return '<svg viewBox="0 0 320 190" role="img" aria-label="' + esc(label) + '">'; }
  function txt(x, y, s, a, size, fill) { return '<text x="' + x + '" y="' + y + '" font-family="Prompt, sans-serif" font-size="' + (size || 10) + '" fill="' + (fill || FAINT) + '"' + (a ? ' text-anchor="' + a + '"' : '') + '>' + esc(s) + '</text>'; }
  function bars(vals, labels, lo, hi, opts) {
    opts = opts || {};
    var L = 44, R = 10, T = 14, B = 26, W = 320, H = 190;
    var y = function (v) { return T + (1 - (v - lo) / (hi - lo)) * (H - T - B); };
    var s = svgOpen(opts.label || 'bar chart');
    [lo, (lo + hi) / 2, hi].forEach(function (v) { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + RULE + '"/>' + txt(L - 6, y(v) + 3, opts.fmt ? opts.fmt(v) : Math.round(v), 'end'); });
    var bw = (W - L - R) / vals.length;
    vals.forEach(function (v, i) {
      var x = L + i * bw + bw * .2, w = bw * .6;
      s += '<rect x="' + x + '" y="' + y(v) + '" width="' + w + '" height="' + (y(lo) - y(v)) + '" rx="3" fill="' + (opts.color || NAVY) + '"/>';
      if (labels[i]) s += txt(x + w / 2, H - 9, labels[i], 'middle');
    });
    return s + '</svg>';
  }
  function lines(series, labels, lo, hi, opts) {
    opts = opts || {};
    var L = 44, R = 12, T = 14, B = 26, W = 320, H = 190, n = series[0].v.length;
    var x = function (i) { return L + i * (W - L - R) / (n - 1); };
    var s = svgOpen(opts.label || 'line chart');
    var yl = function (v, a, b) { return T + (1 - (v - a) / (b - a)) * (H - T - B); };
    [lo, (lo + hi) / 2, hi].forEach(function (v) { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yl(v, lo, hi) + '" y2="' + yl(v, lo, hi) + '" stroke="' + RULE + '"/>' + txt(L - 6, yl(v, lo, hi) + 3, opts.fmt ? opts.fmt(v) : Math.round(v), 'end'); });
    if (opts.right) [opts.right.lo, opts.right.hi].forEach(function (v) { s += txt(W - 2, yl(v, opts.right.lo, opts.right.hi) + 3, opts.right.fmt(v), 'end', 10, GOLD); });
    series.forEach(function (sr, k) {
      var a = sr.lo !== undefined ? sr.lo : lo, b = sr.hi !== undefined ? sr.hi : hi;
      s += '<path fill="none" stroke="' + sr.c + '" stroke-width="2.5" stroke-linejoin="round" d="' + sr.v.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + yl(v, a, b).toFixed(1); }).join(' ') + '"/>';
      if (sr.name) s += txt(x(n - 1) - 2, yl(sr.v[n - 1], a, b) - 8, sr.name, 'end', 10, sr.c === GOLD ? GOLDINK : sr.c);
      void k;
    });
    labels.forEach(function (l, i) { if (l) s += txt(x(i), H - 9, l, 'middle'); });
    return s + '</svg>';
  }

  /* =====================================================
     Spot the misleading chart
     ===================================================== */
  function rounds() {
    chartColors();
    var M = D.monthly, find = function (m) { return M.filter(function (x) { return x.m === m; })[0]; };
    var c = cur.rows;
    var jan = c.filter(function (r) { return r.m.slice(5) === '01'; })[0], feb = c.filter(function (r) { return r.m.slice(5) === '02'; })[0];
    var adr = [jan.room / jan.sold, feb.room / feb.sold];
    var occ = c.map(function (r) { return r.sold * 100 / r.avail; }), adrs = c.map(function (r) { return r.room / r.sold; });
    var cum = [], run = 0; c.forEach(function (r) { run += r.room; cum.push(run / 1e6); });
    var aLo = Math.floor(Math.min.apply(null, adrs) / 100) * 100, aHi = Math.ceil(Math.max.apply(null, adrs) / 100) * 100;
    var lab12 = c.map(function (r, i) { return i % 3 === 0 ? mon(r.m) : ''; });
    var full = M.slice(-24), short = full.slice(2, 8);
    void find;
    return [
      {
        q: t('The owner asks: did our room rate crash in February?', 'เจ้าของถาม: ค่าห้องเดือนกุมภาพันธ์ร่วงหนักไหม'),
        honest: bars(adr, [mon(jan.m), mon(feb.m)], 0, 4500, { fmt: function (v) { return (v / 1000).toFixed(1) + 'k'; }, label: 'ADR from zero' }),
        bad: bars(adr, [mon(jan.m), mon(feb.m)], Math.floor(Math.min(adr[0], adr[1]) / 50) * 50 - 20, Math.ceil(Math.max(adr[0], adr[1]) / 50) * 50, { fmt: function (v) { return Math.round(v).toLocaleString('en-US'); }, label: 'ADR with a cut axis' }),
        capH: t('Axis starts at zero', 'แกนเริ่มที่ศูนย์'), capB: t('Axis starts near the values', 'แกนเริ่มใกล้ค่าข้อมูล'),
        why: t('The rate fell ' + ((adr[1] / adr[0] - 1) * 100).toFixed(1) + '%. Starting the axis just under the values makes a small dip look like a crash. Bar charts must start at zero.',
          'ค่าห้องลดลง ' + ((adr[1] / adr[0] - 1) * 100).toFixed(1) + '% การเริ่มแกนใกล้ค่าข้อมูล ทำให้การลดลงนิดเดียวดูเหมือนร่วงหนัก กราฟแท่งต้องเริ่มที่ศูนย์')
      },
      {
        q: t('The owner asks: did occupancy hold steady while we moved prices around?', 'เจ้าของถาม: อัตราเข้าพักคงที่ ระหว่างที่เราปรับราคาขึ้นลงหรือเปล่า'),
        honest: lines([{ v: occ.map(function (v, i) { return v / occ[0] * 100; }), c: NAVY, name: t('Occupancy', 'อัตราเข้าพัก') }, { v: adrs.map(function (v) { return v / adrs[0] * 100; }), c: GOLD, name: 'ADR' }], lab12, 60, 200, { fmt: function (v) { return Math.round(v); }, label: 'indexed lines' }),
        bad: lines([{ v: occ, c: NAVY, name: t('Occupancy', 'อัตราเข้าพัก'), lo: 0, hi: 300 }, { v: adrs, c: GOLD, name: 'ADR', lo: aLo, hi: aHi }], lab12, 0, 300, { fmt: function (v) { return v + '%'; }, right: { lo: aLo, hi: aHi, fmt: function (v) { return '฿' + v.toLocaleString('en-US'); } }, label: 'dual axis' }),
        capH: t('Both indexed to the first month = 100', 'ทั้งสองเส้นเทียบเดือนแรก = 100'), capB: t('Two different y-axes', 'แกน y สองแกน'),
        why: t('With two y-axes you choose how big each line looks. Stretch the occupancy axis to 300% and stretch the rate, and occupancy looks flat. Indexed to the same start, both swing with the seasons: occupancy moved more than the rate did.',
          'ถ้ามีแกน y สองแกน คุณเลือกได้ว่าจะให้เส้นไหนดูใหญ่แค่ไหน ยืดแกนอัตราเข้าพักไปถึง 300% แล้วอัตราเข้าพักจะดูนิ่ง แต่ถ้าเทียบกับจุดเริ่มเดียวกัน ทั้งคู่ขึ้นลงตามฤดูกาล และอัตราเข้าพักขยับมากกว่าราคาด้วยซ้ำ')
      },
      {
        q: t('The owner asks: is business slowing down this spring?', 'เจ้าของถาม: ช่วงนี้ธุรกิจชะลอตัวไหม'),
        honest: bars(c.map(function (r) { return r.room / 1e6; }), lab12, 0, 3.5, { fmt: function (v) { return v.toFixed(1) + 'M'; }, label: 'monthly revenue' }),
        bad: lines([{ v: cum, c: NAVY, name: t('Revenue so far', 'รายได้สะสม') }], lab12, 0, 30, { fmt: function (v) { return v + 'M'; }, label: 'cumulative revenue' }),
        capH: t('Revenue per month', 'รายได้รายเดือน'), capB: t('Revenue added up over the year', 'รายได้สะสมทั้งปี'),
        why: t('A running total can only go up, so it hides the drop after March. Monthly bars show the low season arriving.',
          'ยอดสะสมมีแต่ขึ้น จึงซ่อนการลดลงหลังเดือนมีนาคม กราฟแท่งรายเดือนแสดงให้เห็นว่าโลว์ซีซั่นมาแล้ว')
      },
      {
        q: t('The owner asks: how fast is RevPAR growing?', 'เจ้าของถาม: RevPAR โตเร็วแค่ไหน'),
        honest: lines([{ v: full.map(function (r) { return r.room / r.avail; }), c: NAVY }], full.map(function (r, i) { return i % 6 === 0 ? mon(r.m) : ''; }), 0, 4000, { fmt: function (v) { return (v / 1000) + 'k'; }, label: '24 months' }),
        bad: lines([{ v: short.map(function (r) { return r.room / r.avail; }), c: NAVY }], short.map(function (r) { return mon(r.m); }), 1000, 3500, { fmt: function (v) { return (v / 1000).toFixed(1) + 'k'; }, label: '6 picked months' }),
        capH: t('All 24 months', 'ครบ 24 เดือน'), capB: t('Six months, August to January', '6 เดือน สิงหาคมถึงมกราคม'),
        why: t('Picking August to January shows low season turning into high season, which looks like +' + Math.round((short[5].room / short[5].avail) / (short[0].room / short[0].avail) * 100 - 100) + '% growth. The full two years show the real trend: about +4% a year.',
          'การเลือกแค่สิงหาคมถึงมกราคมคือการเอาโลว์ซีซั่นไปเทียบไฮซีซั่น ดูเหมือนโต +' + Math.round((short[5].room / short[5].avail) / (short[0].room / short[0].avail) * 100 - 100) + '% แต่ข้อมูลครบ 2 ปีแสดงเทรนด์จริง คือโตราว 4% ต่อปี')
      }
    ];
  }
  var spot = { i: 0, score: 0 };
  function renderSpot() {
    var box = document.getElementById('spot-game'); if (!box) return;
    var R = rounds();
    if (spot.i >= R.length) {
      box.innerHTML = '<div class="game-top"><p class="game-q">' + t('You got ' + spot.score + ' of ' + R.length + '.', 'คุณตอบถูก ' + spot.score + ' จาก ' + R.length + ' ข้อ') + '</p></div>' +
        '<p>' + t('Every one of these tricks shows up in real meetings. A good analyst catches them before the slide goes out.', 'ทุกกลเม็ดนี้เจอได้จริงในห้องประชุม นักวิเคราะห์ที่ดีจับได้ก่อนสไลด์จะถูกส่งออกไป') + '</p>' +
        '<div class="btn-row" style="margin-top:6px"><button class="btn ghost small" type="button" id="spot-again">' + NB.icon('refresh') + t('Play again', 'เล่นอีกครั้ง') + '</button></div>';
      document.getElementById('spot-again').addEventListener('click', function () { spot = { i: 0, score: 0 }; renderSpot(); });
      NB.earn('chart');
      return;
    }
    var r = R[spot.i];
    var flip = (spot.i % 2 === 1);
    var opts = [{ svg: r.honest, cap: r.capH, ok: true }, { svg: r.bad, cap: r.capB, ok: false }];
    if (flip) opts.reverse();
    box.innerHTML = '<div class="game-top"><p class="game-q">' + r.q + '</p><span class="score">' + t('Round ', 'รอบ ') + (spot.i + 1) + '/' + R.length + '&nbsp;&nbsp;&nbsp;' + t('Score ', 'คะแนน ') + spot.score + '</span></div>' +
      '<p class="muted small">' + t('Which chart tells the truth?', 'กราฟไหนบอกความจริง') + '</p>' +
      '<div class="choices">' + opts.map(function (o, k) { return '<button class="choice" type="button" data-k="' + k + '">' + o.svg + '<div class="cap">' + o.cap + '</div></button>'; }).join('') + '</div>' +
      '<div class="explain" id="spot-why"></div>';
    box.querySelectorAll('.choice').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = +b.getAttribute('data-k'), ok = opts[k].ok;
        if (ok) spot.score++;
        box.querySelectorAll('.choice').forEach(function (c, j) { c.disabled = true; c.classList.add(opts[j].ok ? 'right' : 'wrong'); });
        var w = document.getElementById('spot-why');
        w.innerHTML = '<p><b>' + (ok ? t('Right.', 'ถูกต้อง') : t('Not quite.', 'ยังไม่ใช่')) + '</b> ' + r.why + '</p><div class="btn-row" style="margin-top:12px"><button class="btn small" type="button" id="spot-next">' + t(spot.i + 1 < R.length ? 'Next round' : 'See my score', spot.i + 1 < R.length ? 'รอบถัดไป' : 'ดูคะแนน') + '</button></div>';
        w.classList.add('show');
        document.getElementById('spot-next').addEventListener('click', function () { spot.i++; renderSpot(); document.getElementById('spot').scrollIntoView({ block: 'start' }); });
      });
    });
  }

  /* =====================================================
     Pick the metric
     ===================================================== */
  var METRICS = {
    occ: ['Occupancy', 'อัตราเข้าพัก (Occupancy)'], adr: ['ADR (average rate per sold room)', 'ADR (ราคาเฉลี่ยต่อห้องที่ขายได้)'],
    revpar: ['RevPAR (revenue per available room)', 'RevPAR (รายได้ต่อห้องที่มีขาย)'], comm: ['Commission as % of room revenue', 'ค่าคอมเป็น % ของรายได้ห้อง'],
    direct: ['Direct booking share', 'สัดส่วนการจองตรง'], total: ['Total revenue', 'รายได้รวม']
  };
  var QUIZ = [
    { q: ['"Are we filling our rooms?"', '"เราขายห้องได้เต็มแค่ไหน"'], a: 'occ', o: ['occ', 'adr', 'total', 'revpar'],
      why: ['Occupancy is rooms sold divided by rooms available. It answers "how full", nothing about price.', 'Occupancy คือห้องที่ขายได้หารด้วยห้องที่มี ตอบคำถามว่า "เต็มแค่ไหน" ไม่ได้บอกเรื่องราคา'] },
    { q: ['"Are we charging enough for the rooms we do sell?"', '"ห้องที่ขายได้ เราตั้งราคาพอหรือยัง"'], a: 'adr', o: ['revpar', 'adr', 'occ', 'comm'],
      why: ['ADR is room revenue divided by rooms sold. It ignores empty rooms on purpose.', 'ADR คือรายได้ห้องหารด้วยห้องที่ขายได้ ตั้งใจไม่นับห้องว่าง'] },
    { q: ['"How much does every room we own earn us, sold or not?"', '"ห้องทุกห้องที่มี ทำเงินให้เราห้องละเท่าไหร่ ไม่ว่าจะขายได้หรือไม่"'], a: 'revpar', o: ['adr', 'total', 'revpar', 'occ'],
      why: ['RevPAR is room revenue divided by rooms available. It combines price and occupancy in one number.', 'RevPAR คือรายได้ห้องหารด้วยห้องที่มีขาย รวมราคาและอัตราเข้าพักไว้ในตัวเลขเดียว'] },
    { q: ['"How much do booking sites really cost us?"', '"เว็บจองห้องกินเงินเราจริง ๆ เท่าไหร่"'], a: 'comm', o: ['direct', 'comm', 'total', 'adr'],
      why: ['Commission as a share of room revenue shows the cost directly. Direct share explains why it moves, but it is not the cost itself.', 'ค่าคอมเป็นสัดส่วนของรายได้ห้องบอกต้นทุนตรง ๆ ส่วน direct share อธิบายว่าทำไมมันขยับ แต่ไม่ใช่ตัวต้นทุน'] },
    { q: ['"Are guests booking with us instead of through apps?"', '"แขกจองกับเราตรง ๆ แทนการจองผ่านแอปหรือยัง"'], a: 'direct', o: ['occ', 'comm', 'direct', 'revpar'],
      why: ['Direct share is rooms booked direct divided by all rooms sold. It is the number the owner can actually move.', 'Direct share คือห้องที่จองตรงหารด้วยห้องที่ขายได้ทั้งหมด เป็นตัวเลขที่เจ้าของขยับได้จริง'] }
  ];
  var mq = { i: 0, score: 0 };
  function renderMetric() {
    var box = document.getElementById('metric-game'); if (!box) return;
    if (mq.i >= QUIZ.length) {
      box.innerHTML = '<p class="game-q">' + t('You got ' + mq.score + ' of ' + QUIZ.length + '.', 'คุณตอบถูก ' + mq.score + ' จาก ' + QUIZ.length + ' ข้อ') + '</p>' +
        '<p>' + t('Picking the metric is the step most dashboards skip. It decides whether the rest of the work answers the question.', 'การเลือก metric คือขั้นที่ dashboard ส่วนใหญ่ข้ามไป แต่มันตัดสินว่างานที่เหลือจะตอบคำถามได้หรือไม่') + '</p>' +
        '<div class="btn-row" style="margin-top:6px"><button class="btn ghost small" type="button" id="mq-again">' + NB.icon('refresh') + t('Play again', 'เล่นอีกครั้ง') + '</button></div>';
      document.getElementById('mq-again').addEventListener('click', function () { mq = { i: 0, score: 0 }; renderMetric(); });
      NB.earn('metric');
      return;
    }
    var Q = QUIZ[mq.i];
    box.innerHTML = '<div class="game-top"><p class="game-q">' + t(Q.q[0], Q.q[1]) + '</p><span class="score">' + (mq.i + 1) + '/' + QUIZ.length + '&nbsp;&nbsp;&nbsp;' + t('Score ', 'คะแนน ') + mq.score + '</span></div>' +
      '<div class="opts">' + Q.o.map(function (k) { return '<button class="opt" type="button" data-k="' + k + '">' + t(METRICS[k][0], METRICS[k][1]) + '</button>'; }).join('') + '</div>' +
      '<div class="explain" id="mq-why"></div>';
    box.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var ok = b.getAttribute('data-k') === Q.a; if (ok) mq.score++;
        box.querySelectorAll('.opt').forEach(function (o) {
          o.disabled = true;
          if (o.getAttribute('data-k') === Q.a) o.classList.add('right'); else if (o === b) o.classList.add('wrong');
        });
        var w = document.getElementById('mq-why');
        w.innerHTML = '<p><b>' + (ok ? t('Right.', 'ถูกต้อง') : t('Not quite.', 'ยังไม่ใช่')) + '</b> ' + t(Q.why[0], Q.why[1]) + '</p><div class="btn-row" style="margin-top:12px"><button class="btn small" type="button" id="mq-next">' + t(mq.i + 1 < QUIZ.length ? 'Next question' : 'See my score', mq.i + 1 < QUIZ.length ? 'ข้อถัดไป' : 'ดูคะแนน') + '</button></div>';
        w.classList.add('show');
        document.getElementById('mq-next').addEventListener('click', function () { mq.i++; renderMetric(); });
      });
    });
  }

  /* =====================================================
     Data health check
     ===================================================== */
  var HC = [
    ['Ask two people for last month\'s revenue. Do they give the same number?', 'ถามคนสองคนว่ารายได้เดือนที่แล้วเท่าไหร่ ได้ตัวเลขเดียวกันไหม'],
    ['Is each key metric written down with one definition?', 'metric หลักแต่ละตัวมีนิยามเขียนไว้ชัดเจนแบบเดียวไหม'],
    ['Do your reports refresh without anyone copying and pasting?', 'รายงานอัปเดตเองได้ โดยไม่ต้องมีใครคัดลอกวางไหม'],
    ['Can you trace a number on a dashboard back to the rows it came from?', 'ตัวเลขบน dashboard ย้อนกลับไปหาแถวข้อมูลต้นทางได้ไหม'],
    ['Do you find out data is late or broken before your boss does?', 'คุณรู้ว่าข้อมูลมาช้าหรือเสียก่อนหัวหน้ารู้ไหม'],
    ['Are dates, currencies and names stored one consistent way?', 'วันที่ สกุลเงิน และชื่อต่าง ๆ เก็บในรูปแบบเดียวกันไหม'],
    ['Does every dashboard answer a question someone actually asks?', 'ทุก dashboard ตอบคำถามที่มีคนถามจริงไหม'],
    ['Would you trust an AI assistant\'s answer about your data today?', 'วันนี้คุณจะเชื่อคำตอบของ AI เกี่ยวกับข้อมูลของคุณไหม']
  ];
  var hcAns = {};
  function renderHealth() {
    var box = document.getElementById('health-check'); if (!box) return;
    var opts = [['yes', 'Yes', 'ใช่', 2], ['partly', 'Partly', 'บางส่วน', 1], ['no', 'No', 'ไม่', 0]];
    box.innerHTML = '<div>' + HC.map(function (q, i) {
      return '<div class="hc-q"><span>' + (i + 1) + '. ' + t(q[0], q[1]) + '</span><span class="seg" role="group" aria-label="' + esc(q[0]) + '">' +
        opts.map(function (o) { return '<button type="button" data-q="' + i + '" data-v="' + o[3] + '" aria-pressed="' + (hcAns[i] === o[3]) + '">' + t(o[1], o[2]) + '</button>'; }).join('') + '</span></div>';
    }).join('') + '</div><div class="hc-result" id="hc-result"></div>';
    box.querySelectorAll('.seg button').forEach(function (b) {
      b.addEventListener('click', function () {
        hcAns[+b.getAttribute('data-q')] = +b.getAttribute('data-v');
        b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        result();
      });
    });
    result();
  }
  function result() {
    var r = document.getElementById('hc-result'); if (!r) return;
    var n = Object.keys(hcAns).length;
    if (n < HC.length) { r.classList.remove('show'); return; }
    var score = 0; for (var k in hcAns) score += hcAns[k];
    var band, text, cta;
    if (score >= 13) {
      band = t('Healthy', 'สุขภาพดี');
      text = t('Your data is in good shape. You are ready to put an AI agent like Echo on top of it.', 'ข้อมูลของคุณอยู่ในสภาพดี พร้อมให้ AI agent แบบ Echo ทำงานบนข้อมูลนี้แล้ว');
      cta = '<a class="btn gold" href="courses.html#blueprint">' + t('Build Echo on it', 'สร้าง Echo บนข้อมูลนี้') + '</a>';
    } else if (score >= 8) {
      band = t('Fixable', 'แก้ได้');
      text = t('The basics are there, but definitions or refreshes leak. A short clean-up would make every report after it trustworthy.', 'พื้นฐานมีแล้ว แต่นิยามหรือการอัปเดตยังรั่ว ล้างข้อมูลสั้น ๆ ครั้งเดียว จะทำให้ทุกรายงานหลังจากนั้นเชื่อถือได้');
      cta = '<a class="btn" href="services.html">' + t('See the done-for-you clean-up', 'ดูบริการล้างข้อมูล') + '</a>';
    } else {
      band = t('Needs care', 'ต้องดูแล');
      text = t('Numbers depend on who you ask. Fix this before any dashboard or AI, or both will repeat the confusion faster.', 'ตัวเลขขึ้นอยู่กับว่าถามใคร แก้ตรงนี้ก่อนทำ dashboard หรือ AI ไม่อย่างนั้นทั้งคู่จะทำซ้ำความสับสนให้เร็วขึ้น');
      cta = '<a class="btn" href="index.html#contact">' + t('Talk to me about it', 'คุยกับผมเรื่องนี้') + '</a>';
    }
    r.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap"><h3>' + band + '</h3><span class="num" style="font-size:1.6rem">' + score + ' / 16</span></div>' +
      '<div class="meter" style="margin:10px 0 14px"><i style="width:' + (score / 16 * 100) + '%"></i></div><p>' + text + '</p><div class="btn-row" style="margin-top:16px">' + cta + '</div>';
    r.classList.add('show');
    NB.earn('health');
  }

  /* ---------- boot ---------- */
  renderSpot(); renderMetric(); renderHealth();
  document.addEventListener('nb:lang', function () { renderQs(); renderSpot(); renderMetric(); renderHealth(); });
  document.addEventListener('nb:theme', function () { renderSpot(); });
})();
