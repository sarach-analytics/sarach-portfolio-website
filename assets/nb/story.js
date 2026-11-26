/* Homepage: the data field. Every dot is one room night sold at Seaside Boutique Hotel
   (fictional) in the last 12 months. The same dots form the Great Bear in the
   hero, then rearrange into each step of the story as you scroll.
   Data: nights.js (per night per channel) + data.js (monthly). */
(function () {
  'use strict';
  var D = window.NB_DATA, NN = window.NB_NIGHTS, NB = window.NB;
  if (!D || !NN || !NB) return;
  var t = NB.t;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= numbers ================= */
  function sum(a, f) { return a.reduce(function (s, x) { return s + f(x); }, 0); }
  function period(ms) {
    var r = D.monthly.filter(function (m) { return ms.indexOf(m.m) > -1; });
    var room = sum(r, function (x) { return x.room; }), avail = sum(r, function (x) { return x.avail; }), sold = sum(r, function (x) { return x.sold; });
    return { rows: r, room: room, avail: avail, sold: sold, revpar: room / avail, occ: sold * 100 / avail, adr: room / sold };
  }
  var cur = period(D.last12), prev = period(D.prev12);
  var CH = D.channel.cur;
  var comm = sum(CH, function (c) { return c.rev * c.comm / 100; });
  var ota = CH.filter(function (c) { return c.comm > 0; });
  var otaRev = sum(ota, function (c) { return c.rev; });
  var otaRate = comm / otaRev;
  var PERK = 0.03;                                  // stated assumption: a direct-booking perk costs about 3%
  var S = {
    roomGrowth: (cur.room / prev.room - 1) * 100,
    revpar: cur.revpar,
    comm: comm,
    commPct: comm * 100 / cur.room,
    otaShare: sum(ota, function (c) { return c.sold; }) * 100 / cur.sold
  };
  function baht(n) { return '฿' + Math.round(n).toLocaleString('en-US'); }
  function bahtShort(n) {
    if (Math.abs(n) >= 1e6) return '฿' + (n / 1e6).toFixed(2) + (NB.lang() === 'th' ? ' ล้าน' : 'M');
    if (Math.abs(n) >= 1e3) return '฿' + Math.round(n / 1e3).toLocaleString('en-US') + (NB.lang() === 'th' ? ' พัน' : 'k');
    return baht(n);
  }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  var MON_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  var DAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DAY_TH = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  function monName(i) { return NB.lang() === 'th' ? MON_TH[i] : MON_EN[i]; }
  function dateLabel(dt, withDay) {
    var th = NB.lang() === 'th';
    var s = dt.getUTCDate() + ' ' + monName(dt.getUTCMonth()) + ' ' + (th ? dt.getUTCFullYear() + 543 : dt.getUTCFullYear());
    return withDay ? (th ? DAY_TH : DAY_EN)[dt.getUTCDay()] + ' ' + s : s;
  }

  /* ================= the particles ================= */
  var CHN = NN.channels;                                   // Direct, Booking.com, Agoda, Expedia, Walk-in
  var COMM = NN.comm;
  var day0 = new Date(NN.first + 'T00:00:00Z');
  var NDAY = NN.sold.length;
  var dates = [], monthOfDay = [], firstMonth = day0.getUTCFullYear() * 12 + day0.getUTCMonth();
  for (var d = 0; d < NDAY; d++) {
    var dt = new Date(day0.getTime() + d * 864e5);
    dates.push(dt);
    monthOfDay.push(dt.getUTCFullYear() * 12 + dt.getUTCMonth() - firstMonth);
  }
  var pDay = [], pCh = [], pRate = [], pSlot = [], byCh = [[], [], [], [], []], byMonth = [], daySold = [];
  for (var m0 = 0; m0 < 12; m0++) byMonth.push([]);
  for (d = 0; d < NDAY; d++) {
    var slot = 0;
    for (var c = 0; c < 5; c++) {
      for (var k = 0; k < NN.sold[d][c]; k++) {
        var i = pDay.length;
        pDay.push(d); pCh.push(c); pRate.push(NN.rate[d][c]); pSlot.push(slot++);
        byCh[c].push(i); byMonth[monthOfDay[d]].push(i);
      }
    }
    daySold.push(slot);
  }
  var N = pDay.length;                                     // 7,169

  // seeded random so every visit draws the same picture
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }; }
  var R0 = rng(7);
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  var jitter = new Float32Array(N), perm = [];
  for (i = 0; i < N; i++) { jitter[i] = R0(); perm.push(i); }
  for (i = N - 1; i > 0; i--) { var j = Math.floor(R0() * (i + 1)), tmp = perm[i]; perm[i] = perm[j]; perm[j] = tmp; }

  // which booking-site nights pay for the commission, which move direct, which come back
  var pile = [], moveOrder = [[], [], [], [], []], pileOrder = [[], [], [], [], []], inPile = new Uint8Array(N);
  for (c = 0; c < 5; c++) {
    var list = byCh[c].slice().sort(function (a, b) { return jitter[a] - jitter[b]; });
    var kc = Math.round(list.length * COMM[c] / 100);
    for (k = 0; k < list.length; k++) {
      if (k < kc) { inPile[list[k]] = 1; pile.push(list[k]); pileOrder[c].push(list[k]); }
      else moveOrder[c].push(list[k]);
    }
  }
  var pileTotal = pile.length;                             // about 769 room nights' worth of commission

  /* colours (index into PAL) */
  // read from the theme tokens, so the dots follow dark and light mode
  function readPal() {
    var cs = getComputedStyle(document.documentElement), v = function (n) { return cs.getPropertyValue(n).trim(); };
    return [v('--dot-ink'), v('--dot-faint'), v('--dot-accent'), v('--bad'), v('--good'), v('--navy-soft'), v('--dot-accent')];
  }
  var PAL = readPal();
  var isDark = function () { return document.documentElement.getAttribute('data-theme') !== 'light'; };
  var NAVY = 0, FAINT = 1, GOLD = 2, RUST = 3, GREEN = 4, SOFT = 5;
  var NSTATE = 7;
  var SX = [], SY = [], SS = [], SC = [];
  for (k = 0; k < NSTATE; k++) { SX.push(new Float32Array(N)); SY.push(new Float32Array(N)); SS.push(new Float32Array(N)); SC.push(new Uint8Array(N)); }
  var labels = [];                                         // per state: [{x,y,html,cls}]
  var marks = [];                                          // per state: canvas annotations (lines)
  var hits = [];                                           // per state: hover regions

  /* ---------- state 0: the Great Bear (hero) ---------- */
  var BEAR = [[70, 170], [160, 140], [240, 168], [312, 214], [322, 318], [458, 330], [478, 232]];
  var NORTH = [536, 50];
  function buildBear(W, H) {
    var x = SX[0], y = SY[0], s = SS[0], col = SC[0];
    var sc = Math.min(W / 640, H / 420) * 0.92, ox = (W - 600 * sc) / 2, oy = (H - 380 * sc) / 2 + 6 * sc;
    function P(p) { return [ox + p[0] * sc, oy + p[1] * sc]; }
    var r = rng(11), n = 0;
    var segs = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]];
    var nNorth = 620, nStar = 300, nLine = 2000, nPoint = 380;
    var lens = segs.map(function (g) { var a = P(BEAR[g[0]]), b = P(BEAR[g[1]]); return Math.hypot(b[0] - a[0], b[1] - a[1]); });
    var totLen = lens.reduce(function (a, b) { return a + b; }, 0);
    var dot = Math.max(1.6, Math.min(2.6, 2.1 * sc));
    var nP = P(NORTH);
    for (var q = 0; q < N; q++) {
      var id = perm[q], px, py, cc = NAVY, ss = dot;
      if (n < nNorth) {                                    // the North Star: a gold burst
        if (n < nNorth * 0.6) { px = nP[0] + gauss(r) * 7 * sc; py = nP[1] + gauss(r) * 7 * sc; }
        else { var ang = Math.floor(r() * 4) * Math.PI / 2, dist = Math.pow(r(), 1.8) * 46 * sc; px = nP[0] + Math.cos(ang) * dist + gauss(r) * .8; py = nP[1] + Math.sin(ang) * dist + gauss(r) * .8; }
        cc = GOLD; ss = dot * 1.05;
      } else if (n < nNorth + nStar * 7) {                 // the seven stars of the Great Bear
        var st = Math.floor((n - nNorth) / nStar), sp = P(BEAR[st]);
        px = sp[0] + gauss(r) * 5.5 * sc; py = sp[1] + gauss(r) * 5.5 * sc;
      } else if (n < nNorth + nStar * 7 + nLine) {         // the lines between them
        var u = r() * totLen, g = 0;
        while (u > lens[g] && g < lens.length - 1) { u -= lens[g]; g++; }
        var a = P(BEAR[segs[g][0]]), b = P(BEAR[segs[g][1]]), f = u / lens[g];
        px = a[0] + (b[0] - a[0]) * f + gauss(r) * 1.3 * sc; py = a[1] + (b[1] - a[1]) * f + gauss(r) * 1.3 * sc;
        ss = dot * .8;
      } else if (n < nNorth + nStar * 7 + nLine + nPoint) { // the pointer: Merak to Dubhe and on to the North Star
        var a2 = P(BEAR[5]), b2 = nP, f2 = r();
        f2 = Math.floor(f2 * 22) / 22 + r() * (1 / 22) * .55;  // dashed
        px = a2[0] + (b2[0] - a2[0]) * f2 + gauss(r) * .9; py = a2[1] + (b2[1] - a2[1]) * f2 + gauss(r) * .9;
        cc = GOLD; ss = dot * .75;
      } else {                                             // the rest of the sky
        px = r() * W; py = r() * H; cc = FAINT; ss = dot * (.55 + r() * .6);
      }
      x[id] = px; y[id] = py; s[id] = ss; col[id] = cc; n++;
    }
    labels[0] = [{ x: nP[0] - 54 * sc, y: nP[1], cls: 'lab north', html: '<b>' + t('Net RevPAR', 'Net RevPAR') + '</b>' + t('the North Star metric', 'metric ดาวเหนือ') }];
    hits[0] = 'dot';
  }

  /* ---------- state 1: all of them, one sunflower ---------- */
  function buildSunflower(W, H) {
    var R = Math.min(W, H) * 0.44, cx = W / 2, cy = H / 2, pitch = R * Math.sqrt(Math.PI / N);
    for (var i = 0; i < N; i++) {
      var r = R * Math.sqrt((i + .5) / N), a = i * 2.399963;
      SX[1][i] = cx + Math.cos(a) * r; SY[1][i] = cy + Math.sin(a) * r;
      SS[1][i] = pitch * .78; SC[1][i] = NAVY;
    }
    labels[1] = [{ x: cx, y: cy + R + 26, cls: 'lab center', html: '<b>' + fmt(N) + '</b> ' + t('room nights sold in 12 months', 'คืนห้องพักที่ขายได้ใน 12 เดือน') }];
    hits[1] = 'dot';
  }

  /* ---------- state 2: the clean ledger, a calendar of every night ---------- */
  function buildCalendar(W, H) {
    var cols = (W >= 520 || W / H > .72) ? 4 : 3, rows = 12 / cols, lab = 22, gapX = W >= 520 ? 18 : 10, gapY = 24;
    var bw = (W - gapX * (cols - 1)) / cols;
    var cell = Math.min(bw / 7, (H - rows * (lab + gapY)) / rows / 6);
    var bh = cell * 6 + lab;
    var gw = cols * cell * 7 + gapX * (cols - 1), gh = rows * bh + (rows - 1) * gapY;
    var ox = (W - gw) / 2, oy = (H - gh) / 2;
    var pitch = cell * .78 / 6;
    var L = [], cells = [];
    for (var m = 0; m < 12; m++) {
      var bx = ox + (m % cols) * (cell * 7 + gapX), by = oy + Math.floor(m / cols) * (bh + gapY);
      var mi = (firstMonth + m) % 12;
      L.push({ x: bx, y: by, cls: 'lab month', html: monName(mi) });
      cells.push({ bx: bx, by: by + lab });
    }
    var calHit = [];
    for (var i = 0; i < N; i++) {
      var dd = pDay[i], dt = dates[dd], m2 = monthOfDay[dd];
      var first = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1));
      var wdFirst = (first.getUTCDay() + 6) % 7, dom = dt.getUTCDate() - 1;
      var col = (dom + wdFirst) % 7, row = Math.floor((dom + wdFirst) / 7);
      var cx0 = cells[m2].bx + col * cell + (cell - 5 * pitch) / 2, cy0 = cells[m2].by + row * cell + (cell - 6 * pitch) / 2;
      var sl = pSlot[i];
      SX[2][i] = cx0 + (sl % 5 + .5) * pitch; SY[2][i] = cy0 + (5 - Math.floor(sl / 5) + .5) * pitch;
      SS[2][i] = Math.max(1, pitch * .82); SC[2][i] = NAVY;
      if (sl === 0) calHit.push({ x: cells[m2].bx + col * cell, y: cells[m2].by + row * cell, w: cell, h: cell, day: dd });
    }
    labels[2] = L;
    hits[2] = calHit;
    marks[2] = calHit;
  }

  /* ---------- state 3: one table, sliced by channel ---------- */
  var chOrder = [1, 0, 2, 3, 4];                           // Booking.com, Direct, Agoda, Expedia, Walk-in (largest first)
  function buildClusters(W, H) {
    var layout = W >= 520 ? [[0, 1, 2], [3, 4]] : [[0, 1], [2, 3], [4]];
    var rowH = H / layout.length, best = Infinity;
    layout.forEach(function (row) {
      var cw = W / row.length;
      row.forEach(function (k) { var n = byCh[chOrder[k]].length, lim = Math.min(cw, rowH - 34) * .46 / Math.sqrt(n / Math.PI); if (lim < best) best = lim; });
    });
    var pitch = best, L = [], H3 = [];
    layout.forEach(function (row, ri) {
      var cw = W / row.length;
      row.forEach(function (k, ci) {
        var c = chOrder[k], list = byCh[c], R = pitch * Math.sqrt(list.length / Math.PI);
        var cx = cw * (ci + .5), cy = rowH * ri + (rowH - 30) / 2;
        list.forEach(function (id, q) {
          var r = R * Math.sqrt((q + .5) / list.length), a = q * 2.399963;
          SX[3][id] = cx + Math.cos(a) * r; SY[3][id] = cy + Math.sin(a) * r;
          SS[3][id] = pitch * .78; SC[3][id] = NAVY;
        });
        L.push({ x: cx, y: cy + R + 20, cls: 'lab center', html: '<b>' + CHN[c] + '</b> ' + fmt(list.length) });
        H3.push({ x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, ch: c });
      });
    });
    labels[3] = L; hits[3] = H3;
  }

  /* ---------- state 4: twelve months, stacked ---------- */
  function buildMonths(W, H) {
    var per = 8, lab = 30, top = 26;
    var max = 0, prevSold = D.monthly.filter(function (r) { return D.prev12.indexOf(r.m) > -1; }).map(function (r) { return r.sold; });
    byMonth.forEach(function (l, m) { max = Math.max(max, l.length, prevSold[m] || 0); });
    var colW = W / 12;
    var pitch = Math.min(colW * .8 / per, (H - lab - top) / Math.ceil(max / per));
    var base = top + Math.ceil(max / per) * pitch + (H - lab - top - Math.ceil(max / per) * pitch) / 2;
    var L = [], M = [], H4 = [];
    byMonth.forEach(function (list, m) {
      var cx = colW * (m + .5), x0 = cx - per * pitch / 2;
      list.forEach(function (id, q) {
        SX[4][id] = x0 + (q % per + .5) * pitch; SY[4][id] = base - (Math.floor(q / per) + .5) * pitch;
        SS[4][id] = pitch * .78; SC[4][id] = NAVY;
      });
      var mi = (firstMonth + m) % 12;
      L.push({ x: cx, y: base + 8, cls: 'lab center small', html: (W < 520 && m % 2) ? '' : monName(mi) });
      var py = base - Math.ceil((prevSold[m] || 0) / per) * pitch;
      M.push([x0 - pitch * .6, py, x0 + per * pitch + pitch * .6, py]);
      H4.push({ x: cx - colW / 2, y: 0, w: colW, h: H, month: m });
    });
    L.push({ x: W, y: 0, cls: 'lab right small', html: '<i class="dash"></i>' + t('same month last year', 'เดือนเดียวกันปีก่อน') });
    labels[4] = L; marks[4] = M; hits[4] = H4;
  }

  /* ---------- states 5 and 6: where the money goes, and what if ---------- */
  var shift = 0.10;
  function bandLayout(W, H) {
    var labW = 0, lineH = 22, gap = 12, nb = 6;
    var maxN = Math.max(byCh[1].length - Math.round(byCh[1].length * COMM[1] / 100), byCh[0].length + Math.round(sum([1, 2, 3], function (c) { return (byCh[c].length - pileOrder[c].length) * .3; })), pileTotal + 10);
    var best = { p: 0 };
    for (var rows = 6; rows <= 24; rows++) {
      var p = Math.min((W - labW) / Math.ceil(maxN / rows), (H - nb * (lineH + gap)) / (nb * rows));
      if (p > best.p) best = { p: p, rows: rows };
    }
    return { p: best.p, rows: best.rows, lineH: lineH, gap: gap, bandH: best.rows * best.p + lineH + gap, top: (H - nb * (best.rows * best.p + lineH + gap)) / 2 };
  }
  function place(st, ids, x0, y0, B, color) {
    ids.forEach(function (id, q) {
      SX[st][id] = x0 + (Math.floor(q / B.rows) + .5) * B.p;
      SY[st][id] = y0 + (q % B.rows + .5) * B.p;
      SS[st][id] = B.p * .8; SC[st][id] = color;
    });
  }
  var bandOrder = [1, 0, 2, 3, 4];
  function buildLeak(st, W, H, sh) {
    var B = bandLayout(W, H), L = [], HB = [];
    var moved = [[], [], [], [], []], back = [[], [], [], [], []], nMoved = 0, nBack = 0;
    if (st === 6) {
      [1, 2, 3].forEach(function (c) {
        var mv = Math.round(byCh[c].length * sh), bk = Math.round(byCh[c].length * sh * (COMM[c] - PERK * 100) / 100);
        moved[c] = moveOrder[c].slice(0, mv); back[c] = pileOrder[c].slice(0, bk);
        nMoved += mv; nBack += bk;
      });
    }
    var movedAll = [].concat(moved[1], moved[2], moved[3]);
    bandOrder.forEach(function (c, bi) {
      var y0 = B.top + bi * B.bandH + B.lineH;
      var stay = moveOrder[c].filter(function (id) { return moved[c].indexOf(id) < 0; });
      var isOta = COMM[c] > 0;
      place(st, stay, 0, y0, B, isOta ? GOLD : NAVY);
      var total = byCh[c].length - moved[c].length;
      var text = '<b>' + CHN[c] + '</b> ' + fmt(total) + ' ' + t('rooms', 'ห้อง') + (isOta ? ', ' + COMM[c] + '% ' + t('commission', 'ค่าคอม') : ', ' + t('no commission', 'ไม่มีค่าคอม')) +
        (moved[c].length ? ' <span class="o">(' + fmt(moved[c].length) + ' ' + t('moved direct', 'ย้ายไปจองตรง') + ')</span>' : '');
      if (c === 0 && st === 6 && nMoved) {
        place(st, movedAll, Math.ceil(stay.length / B.rows) * B.p + B.p * 1.5, y0, B, NAVY);
        text = '<b>' + CHN[c] + '</b> ' + fmt(byCh[c].length) + ' + <b class="gold-ink">' + fmt(nMoved) + '</b> ' + t('moved from booking sites', 'ย้ายมาจากเว็บจอง');
      }
      L.push({ x: 0, y: y0 - B.lineH + 2, cls: 'lab', html: text });
      HB.push({ x: 0, y: y0 - B.lineH, w: W, h: B.bandH, ch: c });
    });
    var y5 = B.top + 5 * B.bandH + B.lineH;
    var backAll = [].concat(back[1], back[2], back[3]);
    var still = pile.filter(function (id) { return backAll.indexOf(id) < 0; });
    place(st, still, 0, y5, B, RUST);
    if (st === 6 && nBack) place(st, backAll, Math.ceil(still.length / B.rows) * B.p + B.p * 3, y5, B, GREEN);
    var paid = st === 6 ? comm - otaRev * sh * (otaRate - PERK) : comm;
    var kept = otaRev * sh * (otaRate - PERK);
    L.push({ x: 0, y: y5 - B.lineH + 2, cls: 'lab rust', html: '<b>' + t('Paid to booking sites', 'จ่ายให้เว็บจอง') + ' ' + bahtShort(paid) + '</b> ' + t('worth ' + fmt(still.length) + ' room nights', 'เท่ากับ ' + fmt(still.length) + ' คืนห้องพัก') +
      (st === 6 && nBack ? ' <b class="green">' + t('kept ', 'เก็บไว้ ') + bahtShort(kept) + '</b>' : '') });
    HB.push({ x: 0, y: y5 - B.lineH, w: W, h: B.bandH, pile: true });
    labels[st] = L; hits[st] = HB;
  }

  /* ================= layout ================= */
  var canvas = document.getElementById('field'), ctx = canvas && canvas.getContext('2d');
  var heroStage = document.getElementById('hero-stage'), storyStage = document.getElementById('story-stage');
  var labelLayer = document.getElementById('stage-labels'), heroLabels = document.getElementById('hero-labels');
  var steps = [].slice.call(document.querySelectorAll('.step'));
  var heroBehind = !!document.querySelector('.hero-hm');
  if (!ctx || !heroStage || !storyStage) return;
  var dpr = 1, VW = 0, VH = 0, HW = 0, HH = 0, SW = 0, SH = 0;
  // drawing detail: 2 = full, 1 = no retina canvas, 0 = also plain batched dots, no glow or twinkle.
  // Every dot stays (each one is a room night); only how it is drawn gets cheaper.
  var quality = 2, slowFrames = 0, lastNow = 0, avgDt = 16.7;
  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, quality >= 2 ? 2 : 1);
    VW = window.innerWidth; VH = window.innerHeight;
    canvas.width = Math.round(VW * dpr); canvas.height = Math.round(VH * dpr);
    canvas.style.width = VW + 'px'; canvas.style.height = VH + 'px';
    var hr = heroStage.getBoundingClientRect(), sr = storyStage.getBoundingClientRect();
    HW = hr.width; HH = hr.height; SW = sr.width; SH = sr.height;
    buildBear(HW, HH);
    buildSunflower(SW, SH);
    buildCalendar(SW, SH);
    buildClusters(SW, SH);
    buildMonths(SW, SH);
    buildLeak(5, SW, SH, 0);
    buildLeak(6, SW, SH, shift);
    lastLabelState = -1;
  }

  /* ================= scroll → state ================= */
  var state = 0;                                           // continuous, 0 … 6
  function readScroll() {
    var mobile = VW <= 940, cs, focus;
    if (mobile) {
      // phones: the picture is pinned on top; a step takes over as its card reaches the picture's bottom edge
      var sr = storyStage.getBoundingClientRect();
      var pinTop = parseFloat(getComputedStyle(storyStage).top) || 66;
      focus = Math.min(sr.bottom, pinTop + sr.height) + VH * .1;   // where the picture's bottom sits once pinned
      var h = heroStage.getBoundingClientRect();
      cs = [h.top + h.height * .5 + VH * .1].concat(steps.map(function (s) { return s.querySelector('.step-card').getBoundingClientRect().top; }));
    } else {
      focus = VH * .5;
      cs = [heroStage.getBoundingClientRect()].concat(steps.map(function (s) { return s.getBoundingClientRect(); })).map(function (r) { return r.top + r.height * .5; });
    }
    if (focus <= cs[0]) return 0;
    for (var k = 0; k < cs.length - 1; k++) {
      if (focus <= cs[k + 1]) {
        var f = (focus - cs[k]) / (cs[k + 1] - cs[k]);
        f = mobile ? Math.max(0, Math.min(1, (f - .55) / .4))   // change late, just before the next card arrives
                   : Math.max(0, Math.min(1, (f - .22) / .56)); // hold each picture while its text is in view
        return k + f;
      }
    }
    return cs.length - 1;
  }
  function fieldOpacity() {
    var last = steps[steps.length - 1].getBoundingClientRect();
    var out = (VH * .45 - last.bottom) / (VH * .35);       // fade once the last step has gone by
    return Math.max(0, Math.min(1, 1 - out));
  }

  /* ================= drawing ================= */
  var px = new Float32Array(N), py = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
  // two looks per colour: a crisp dot for the charts, a glowing star for the sky
  var sprites, glows;
  function makeSprites() {
  sprites = PAL.map(function (c) {
    var s = document.createElement('canvas'); s.width = s.height = 24;
    var g = s.getContext('2d'); g.fillStyle = c; g.beginPath(); g.arc(12, 12, 11, 0, Math.PI * 2); g.fill();
    return s;
  });
  glows = PAL.map(function (c) {
    var s = document.createElement('canvas'); s.width = s.height = 48;
    var g = s.getContext('2d');
    var gr = g.createRadialGradient(24, 24, 0, 24, 24, 24);
    gr.addColorStop(0, c); gr.addColorStop(.22, c); gr.addColorStop(.32, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
    return s;
  });
  }
  makeSprites();
  document.addEventListener('nb:theme', function () { PAL = readPal(); makeSprites(); });
  var buckets = PAL.map(function () { return new Int32Array(N); }), counts = new Int32Array(PAL.length);
  var sizeNow = new Float32Array(N);
  var started = false, t0 = 0, mouse = { x: -1e4, y: -1e4, on: false }, hover = null;
  function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function originOf(st) {
    var r = st === 0 ? heroStage.getBoundingClientRect() : storyStage.getBoundingClientRect();
    return [r.left, r.top];
  }

  var lastLabelState = -1, lastLabelOpacity = -1;
  function renderLabels(st, op) {
    var target = st === 0 ? heroLabels : labelLayer;
    var other = st === 0 ? labelLayer : heroLabels;
    if (st !== lastLabelState) {
      lastLabelState = st;
      target.innerHTML = (labels[st] || []).map(function (l) {
        return '<span class="' + l.cls + '" style="left:' + l.x.toFixed(1) + 'px;top:' + l.y.toFixed(1) + 'px">' + l.html + '</span>';
      }).join('');
      if (other) other.innerHTML = '';
    }
    if (Math.abs(op - lastLabelOpacity) > .01) { target.style.opacity = op; lastLabelOpacity = op; }
  }

  // after the intro, if frames keep taking longer than ~24ms (under ~40fps), step the detail down once per slow spell
  function watchSpeed(now) {
    var dt = now - lastNow; lastNow = now;
    if (dt <= 0 || dt > 250 || reduce || quality === 0 || now - t0 < 2800) return;   // skip tab switches and the intro
    avgDt = avgDt * .9 + dt * .1;
    slowFrames = avgDt > 24 ? slowFrames + 1 : 0;
    if (slowFrames > 45) { quality = avgDt > 45 ? 0 : quality - 1; slowFrames = 0; avgDt = 16.7; layout(); }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!t0) t0 = now;
    watchSpeed(now);
    var op = fieldOpacity();
    canvas.style.opacity = op;
    if (op <= 0.001) { renderLabels(Math.round(state), 0); return; }
    state = readScroll();
    if (heroBehind) canvas.style.opacity = op * Math.min(1, .4 + .6 * Math.min(1, state));   // the sky sits behind the hero text, then brightens for the story
    var a = Math.floor(state), b = Math.min(NSTATE - 1, a + 1), f = state - a;
    var oA = originOf(a), oB = originOf(b);
    var near = Math.round(state), closeness = 1 - Math.min(1, Math.abs(state - near) * 2.2);
    renderLabels(near, closeness);

    // the first visit: the dots drift in from everywhere and settle into the bear
    var intro = reduce ? 1 : Math.min(1, (now - t0) / 2600);
    var k = reduce ? 1 : (intro < 1 ? .035 + .1 * intro : .16);
    var hero = state < .6 && !reduce;
    var mx = mouse.x, my = mouse.y, R2 = 70 * 70;
    counts.fill(0);
    var XA = SX[a], YA = SY[a], XB = SX[b], YB = SY[b], SA = SS[a], SBz = SS[b], CA = SC[a], CB = SC[b];
    var tw = now / 1000;
    for (var i = 0; i < N; i++) {
      var dl = jitter[i] * .35 + (XB[i] / (SW || 1)) * .1;
      var ti = f <= dl ? 0 : Math.min(1, (f - dl) / .55);
      var e = reduce ? (f >= .5 ? 1 : 0) : ease(ti);
      var tx = oA[0] + XA[i] + (oB[0] + XB[i] - oA[0] - XA[i]) * e;
      var ty = oA[1] + YA[i] + (oB[1] + YB[i] - oA[1] - YA[i]) * e;
      if (hero && mouse.on) {
        var dx = px[i] - mx, dy = py[i] - my, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > .01) { var push = (1 - d2 / R2) * 2.6, dd = Math.sqrt(d2); vx[i] += dx / dd * push; vy[i] += dy / dd * push; }
      }
      vx[i] *= .86; vy[i] *= .86;
      if (!started) { px[i] = Math.random() * VW; py[i] = Math.random() * VH * 1.2 - VH * .1; }
      px[i] += (tx - px[i]) * k + vx[i];
      py[i] += (ty - py[i]) * k + vy[i];
      var sz = SA[i] + (SBz[i] - SA[i]) * e;
      if (hero && quality > 0 && CA[i] === FAINT) sz *= .75 + .35 * Math.sin(tw * 1.7 + jitter[i] * 40);
      sizeNow[i] = sz;
      var cc = e < .5 ? CA[i] : CB[i];
      buckets[cc][counts[cc]++] = i;
    }
    started = true;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, VW, VH);
    // annotations: last year's level on the month columns
    var c4 = 1 - Math.min(1, Math.abs(state - 4) * 2.2);
    if (c4 > 0 && marks[4]) {
      var o4 = originOf(4);
      ctx.save(); ctx.globalAlpha = c4; ctx.strokeStyle = PAL[2]; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath();
      marks[4].forEach(function (m) { ctx.moveTo(o4[0] + m[0], o4[1] + m[1]); ctx.lineTo(o4[0] + m[2], o4[1] + m[3]); });
      ctx.stroke(); ctx.restore();
    }
    var c2 = 1 - Math.min(1, Math.abs(state - 2) * 2.2);
    if (c2 > 0 && marks[2]) {
      var o2 = originOf(2);
      ctx.save(); ctx.globalAlpha = c2; ctx.fillStyle = PAL[1]; ctx.globalAlpha *= .2;
      marks[2].forEach(function (r) { ctx.fillRect(o2[0] + r.x + 1, o2[1] + r.y + 1, r.w - 2, r.h - 2); });
      ctx.restore();
    }
    var sky = state < .7 && isDark();                                  // in the sky the stars glow and add up
    ctx.globalCompositeOperation = sky ? 'lighter' : 'source-over';
    for (var c = 0; c < PAL.length; c++) {
      var bk = buckets[c], n = counts[c];
      if (quality === 0) {                                 // slow devices: one batched shape per colour instead of a sprite per dot
        ctx.fillStyle = PAL[c]; ctx.beginPath();
        for (var q = 0; q < n; q++) { var id = bk[q], s = sizeNow[id] * (sky ? 1.15 : .9); ctx.rect(px[id] - s / 2, py[id] - s / 2, s, s); }
        ctx.fill();
        continue;
      }
      var spr = sky ? glows[c] : sprites[c], m = sky ? 2.6 : 1;
      for (var q = 0; q < n; q++) {
        var id = bk[q], s = sizeNow[id] * m;
        ctx.drawImage(spr, px[id] - s / 2, py[id] - s / 2, s, s);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // hover highlight
    if (hover && hover.rect) {
      ctx.save(); ctx.strokeStyle = PAL[2]; ctx.lineWidth = 2;
      ctx.strokeRect(hover.rect[0], hover.rect[1], hover.rect[2], hover.rect[3]); ctx.restore();
    } else if (hover && hover.id != null) {
      var hs = Math.max(8, sizeNow[hover.id] * 3);
      ctx.save(); ctx.strokeStyle = PAL[2]; ctx.lineWidth = 2; ctx.beginPath();
      ctx.arc(px[hover.id], py[hover.id], hs / 2 + 2, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
  }

  /* ================= hover: every dot is real ================= */
  var tip = document.getElementById('field-tip');
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.classList.add('show');
    var w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.max(8, Math.min(VW - w - 8, x - w / 2)) + 'px';
    tip.style.top = (y - h - 16 < 70 ? y + 22 : y - h - 16) + 'px';
  }
  function hideTip() { tip.classList.remove('show'); hover = null; }
  function chSummary(c) {
    var x = CH.filter(function (r) { return r.name === CHN[c]; })[0];
    if (!x) return '';
    return '<b>' + CHN[c] + '</b><br>' + fmt(x.sold) + ' ' + t('rooms', 'ห้อง') + ', ' + baht(x.rev) + '<br>' +
      (x.comm > 0 ? t('Commission ', 'ค่าคอม ') + x.comm + '% = ' + baht(x.rev * x.comm / 100) : t('No commission', 'ไม่มีค่าคอม'));
  }
  function onMove(e) {
    var cx = e.clientX, cy = e.clientY;
    mouse.x = cx; mouse.y = cy; mouse.on = true;
    if (canvas.style.opacity === '0') return hideTip();
    var st = Math.round(state);
    if (Math.abs(state - st) > .2) return hideTip();
    var o = originOf(st), lx = cx - o[0], ly = cy - o[1];
    var H = hits[st];
    if (H === 'dot') {
      var best = -1, bd = 14 * 14;
      for (var i = 0; i < N; i++) { var dx = px[i] - cx, dy = py[i] - cy, d2 = dx * dx + dy * dy; if (d2 < bd) { bd = d2; best = i; } }
      if (best < 0 || (st === 0 && SC[0][best] === FAINT && bd > 36)) return hideTip();
      hover = { id: best };
      return showTip('<b>' + t('One room, one night', 'ห้อง 1 ห้อง 1 คืน') + '</b><br>' + dateLabel(dates[pDay[best]], true) + '<br>' + t('Booked on ', 'จองผ่าน ') + CHN[pCh[best]] + ', ' + baht(pRate[best]), cx, cy);
    }
    if (!H || !H.length) return hideTip();
    for (var k = 0; k < H.length; k++) {
      var r = H[k];
      if (lx >= r.x && lx <= r.x + r.w && ly >= r.y && ly <= r.y + r.h) {
        var html;
        if (r.day != null) {
          var sold = daySold[r.day];
          html = '<b>' + dateLabel(dates[r.day], true) + '</b><br>' + t(sold + ' of 30 rooms sold', 'ขายได้ ' + sold + ' จาก 30 ห้อง');
          hover = { rect: [o[0] + r.x, o[1] + r.y, r.w, r.h] };
        } else if (r.month != null) {
          var cm = cur.rows[r.month], pm = prev.rows[r.month];
          var dlt = (cm.sold / pm.sold - 1) * 100;
          html = '<b>' + monName((firstMonth + r.month) % 12) + ' ' + (NB.lang() === 'th' ? +cm.m.slice(0, 4) + 543 : cm.m.slice(0, 4)) + '</b><br>' +
            fmt(cm.sold) + ' ' + t('rooms sold', 'ห้องที่ขายได้') + ' <span class="o">' + t('vs ', 'เทียบ ') + fmt(pm.sold) + '</span><br>' +
            (dlt >= 0 ? '+' : '') + dlt.toFixed(1) + '% ' + t('on last year', 'จากปีก่อน') + '<br>RevPAR ' + baht(cm.room / cm.avail);
          hover = { rect: [o[0] + r.x + 2, o[1] + 4, r.w - 4, SH - 8] };
        } else if (r.pile) {
          html = '<b>' + t('Commission paid', 'ค่าคอมที่จ่ายไป') + '</b><br>' + baht(comm) + ' ' + t('in 12 months', 'ใน 12 เดือน') + '<br>' + t('Each dot: one room night of that money', 'แต่ละจุด = เงินเท่ากับ 1 คืนห้องพัก');
          hover = null;
        } else if (r.ch != null) { html = chSummary(r.ch); hover = null; }
        return showTip(html, cx, cy);
      }
    }
    hideTip();
  }
  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', function () { mouse.on = false; hideTip(); });
  window.addEventListener('scroll', function () { if (tip.classList.contains('show')) hideTip(); }, { passive: true });
  heroStage.addEventListener('click', function (e) {
    if (reduce) return;
    for (var i = 0; i < N; i++) {                       // a click sends a ripple through the sky
      var dx = px[i] - e.clientX, dy = py[i] - e.clientY, d = Math.sqrt(dx * dx + dy * dy) || 1;
      if (d < 260) { var p = (1 - d / 260) * 9; vx[i] += dx / d * p; vy[i] += dy / d * p; }
    }
  });

  /* ================= the step text: numbers, KPIs, slider ================= */
  function fillNumbers() {
    var map = {
      roomGrowth: S.roomGrowth.toFixed(1) + '%', revpar: baht(S.revpar), comm: bahtShort(S.comm),
      commPct: S.commPct.toFixed(1) + '%', otaShare: Math.round(S.otaShare) + '%',
      nights: fmt(N), pileNights: fmt(pileTotal), occ: cur.occ.toFixed(1) + '%', occPrev: prev.occ.toFixed(1) + '%',
      topComm: CH.slice().sort(function (a, b) { return b.rev * b.comm - a.rev * a.comm; })[0].name
    };
    document.querySelectorAll('[data-v]').forEach(function (el) { el.textContent = map[el.getAttribute('data-v')]; });
    var k = document.getElementById('kpis');
    if (k) {
      var items = [
        ['RevPAR', baht(cur.revpar), (cur.revpar / prev.revpar - 1) * 100, '%'],
        [t('Occupancy', 'อัตราเข้าพัก'), cur.occ.toFixed(1) + '%', cur.occ - prev.occ, ' pt'],
        ['ADR', baht(cur.adr), (cur.adr / prev.adr - 1) * 100, '%']
      ];
      k.innerHTML = items.map(function (it) {
        return '<div class="kpi"><div class="k">' + it[0] + '</div><div class="v">' + it[1] + '</div><div class="d ' + (it[2] >= 0 ? 'up' : 'down') + '">' + (it[2] >= 0 ? '+' : '') + it[2].toFixed(1) + it[3] + '</div></div>';
      }).join('');
    }
    var er = document.getElementById('echo-rows');
    if (er) er.innerHTML = '<table class="data-table"><thead><tr><th>channel</th><th>revenue</th><th>commission</th></tr></thead><tbody>' +
      CH.slice().sort(function (a, b) { return b.rev * b.comm - a.rev * a.comm; }).map(function (c) {
        return '<tr><td>' + c.name + '</td><td>' + fmt(c.rev) + '</td><td>' + fmt(c.rev * c.comm / 100) + '</td></tr>';
      }).join('') + '</tbody></table>';
    var tb = document.getElementById('trend-table');
    if (tb) tb.innerHTML = '<table class="data-table"><thead><tr><th>' + t('Month', 'เดือน') + '</th><th>' + t('Rooms sold', 'ห้องที่ขาย') + '</th><th>' + t('Year before', 'ปีก่อน') + '</th><th>RevPAR</th></tr></thead><tbody>' +
      cur.rows.map(function (r, i) { return '<tr><td>' + monName(+r.m.slice(5, 7) - 1) + ' ' + r.m.slice(0, 4) + '</td><td>' + fmt(r.sold) + '</td><td>' + fmt(prev.rows[i].sold) + '</td><td>' + baht(r.room / r.avail) + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  var range = document.getElementById('shift');
  function decide() {
    if (!range) return;
    shift = +range.value / 100;
    var saved = otaRev * shift * (otaRate - PERK);
    document.getElementById('shift-out').textContent = range.value + '%';
    document.getElementById('save-out').textContent = baht(Math.round(saved / 1000) * 1000);
    var reco = document.getElementById('reco');
    if (+range.value === 0) {
      reco.textContent = t('Doing nothing keeps paying ' + bahtShort(comm) + ' a year in commission, and it grows with revenue.',
        'ถ้าไม่ทำอะไร ก็ต้องจ่ายค่าคอม ' + bahtShort(comm) + ' ต่อปีต่อไป และจะโตตามรายได้');
    } else {
      reco.textContent = t('Brief for the owner: offer returning guests a direct-booking perk worth about 3% (breakfast or late check-out), and track direct share every month. At ' + range.value + '% moved, the hotel keeps ' + bahtShort(saved) + ' a year.',
        'สรุปให้เจ้าของ: ให้ของแถมสำหรับแขกเก่าที่จองตรง มูลค่าราว 3% (อาหารเช้าหรือเช็กเอาต์ช้า) แล้วติดตาม direct share ทุกเดือน ถ้าย้ายได้ ' + range.value + '% โรงแรมจะเก็บเงินไว้ได้ ' + bahtShort(saved) + ' ต่อปี');
    }
    if (SW) { buildLeak(6, SW, SH, shift); if (Math.round(state) === 6) lastLabelState = -1; }
  }
  if (range) range.addEventListener('input', function () { decide(); NB.earn('slider'); });
  document.querySelectorAll('.table-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var w = document.getElementById(b.getAttribute('data-table'));
      b.setAttribute('aria-expanded', w.classList.toggle('open'));
    });
  });

  // step highlight + the story star
  var activeStep = -1;
  function markSteps() {
    var s = Math.round(state) - 1;
    if (s === activeStep) return;
    activeStep = s;
    steps.forEach(function (el, k) { el.classList.toggle('on', k === s); });
    if (s === steps.length - 1) NB.earn('story');
    if (s === 4) revealEcho();
    var live = document.getElementById('stage-live');
    if (live && s >= 0) live.textContent = steps[s].getAttribute('data-describe-' + NB.lang()) || '';
  }
  var echoBox = document.getElementById('echo-mini'), echoShown = false;
  function revealEcho() {
    if (!echoBox || echoShown) return;
    echoShown = true;
    echoBox.classList.add('thinking');
    setTimeout(function () { echoBox.classList.remove('thinking'); echoBox.classList.add('done'); }, reduce ? 0 : 1100);
  }
  setInterval(markSteps, 200);

  /* hero counter: 0 → 7,169 */
  var counter = document.getElementById('nights-count');
  if (counter) {
    if (reduce) counter.textContent = fmt(N);
    else {
      var cs0 = null;
      requestAnimationFrame(function tick(ts) { if (cs0 === null) cs0 = ts; var p = Math.min(1, (ts - cs0) / 2400); counter.textContent = fmt(N * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); });
    }
  }

  /* ================= boot ================= */
  fillNumbers();
  layout();
  decide();
  requestAnimationFrame(frame);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { layout(); }, 120); });
  document.addEventListener('nb:lang', function () { fillNumbers(); decide(); layout(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); });
})();
