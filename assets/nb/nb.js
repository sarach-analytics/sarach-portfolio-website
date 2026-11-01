/* Site shell: header, footer, TH/EN, line icons, North Stars, contact forms. */
(function () {
  'use strict';

  var FORM_URL = 'https://script.google.com/macros/s/AKfycbxlSIEmI4CZ3hd9-LlyZBTOeCrcJtVNZu82CGeODS5xlYWHJP-op5aEYOoYL5H-Qn1S/exec';
  var EMAIL = 'sarach.northbear+consulting@gmail.com';

  /* ---------- storage that never throws ---------- */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode: fine */ }
  }

  /* ---------- icons (Lucide-style line icons) ---------- */
  var P = {
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-down': '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    circle: '<circle cx="12" cy="12" r="9"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h8"/><path d="M8 17h5"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>'
  };
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[name] || '') + '</svg>';
  }
  function paintIcons(root) {
    (root || document).querySelectorAll('i[data-i]').forEach(function (el) {
      el.outerHTML = icon(el.getAttribute('data-i'), el.className);
    });
  }

  /* little Great Bear mark for the wordmark */
  var MARK = '<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="#DCE3FF"><circle cx="4" cy="22" r="1.8"/><circle cx="9" cy="20" r="1.8"/><circle cx="13.5" cy="21.5" r="1.8"/><circle cx="17" cy="24" r="1.8"/><circle cx="17.5" cy="29" r="1.8"/><circle cx="24" cy="29.5" r="1.8"/><circle cx="25" cy="23.5" r="1.8"/></g><g stroke="#DCE3FF" stroke-width="1" fill="none" opacity=".55"><path d="M4 22 9 20 13.5 21.5 17 24 17.5 29 24 29.5 25 23.5 17 24"/></g><path d="M25 23.5 27 6" stroke="#F0B93E" stroke-width="1" stroke-dasharray="1.5 2"/><polygon fill="#F0B93E" points="27 1 28.2 4.3 31.6 4.4 28.9 6.5 29.9 9.8 27 7.8 24.1 9.8 25.1 6.5 22.4 4.4 25.8 4.3"/></svg>';

  /* ---------- language ---------- */
  function lang() { return document.documentElement.classList.contains('th') ? 'th' : 'en'; }
  function applyLang(l) {
    var root = document.documentElement;
    root.classList.toggle('th', l === 'th');
    root.setAttribute('lang', l);
    document.querySelectorAll('[data-ph-en]').forEach(function (el) {
      el.setAttribute('placeholder', el.getAttribute('data-ph-' + l) || el.getAttribute('data-ph-en'));
    });
    document.querySelectorAll('option[data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + l) || el.getAttribute('data-en');
    });
    var t = document.querySelector('meta[name="title-' + l + '"]');
    if (t) document.title = t.content;
    document.querySelectorAll('.lang-btn .lang-label').forEach(function (b) { b.textContent = l === 'th' ? 'EN' : 'TH'; });
    document.dispatchEvent(new CustomEvent('nb:lang', { detail: l }));
  }
  function t(en, th) { return lang() === 'th' ? th : en; }

  /* ---------- North Stars (collectibles) ---------- */
  var STARS = [
    { id: 'story', en: 'Read the data story to the end', th: 'อ่าน data story จนจบ', href: 'index.html#story' },
    { id: 'slider', en: 'Make the decision with the slider', th: 'ลองตัดสินใจด้วยแถบเลื่อน', href: 'index.html#decide' },
    { id: 'echo', en: 'Ask Echo a question', th: 'ถามคำถาม Echo', href: 'playground.html#echo' },
    { id: 'chart', en: 'Finish Spot the misleading chart', th: 'เล่นเกมจับผิดกราฟจนจบ', href: 'playground.html#spot' },
    { id: 'metric', en: 'Finish Pick the metric', th: 'เล่นเกมเลือก metric จนจบ', href: 'playground.html#metric' },
    { id: 'health', en: 'Run the data health check', th: 'ตรวจสุขภาพข้อมูลของคุณ', href: 'playground.html#health' }
  ];
  function got() { return load('nb-stars', []); }
  function renderStars() {
    var have = got();
    document.querySelectorAll('.star-count .n').forEach(function (n) { n.textContent = have.length + '/' + STARS.length; });
    var list = document.getElementById('stars-list');
    if (list) {
      list.innerHTML = STARS.map(function (s) {
        var ok = have.indexOf(s.id) > -1;
        return '<li class="' + (ok ? 'got' : '') + '">' + icon('star') + '<a href="' + s.href + '"><span class="en">' + s.en + '</span><span class="th">' + s.th + '</span></a></li>';
      }).join('');
    }
    document.querySelectorAll('[data-star]').forEach(function (el) {
      el.classList.toggle('got', have.indexOf(el.getAttribute('data-star')) > -1);
    });
  }
  function earn(id) {
    var have = got();
    if (have.indexOf(id) > -1) return false;
    have.push(id);
    save('nb-stars', have);
    renderStars();
    document.querySelectorAll('.star-count').forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
    var s = STARS.filter(function (x) { return x.id === id; })[0];
    if (have.length === STARS.length) {
      toast(t('All 6 North Stars found. You know how I work now.', 'เก็บครบ 6 ดวงแล้ว ตอนนี้คุณรู้แล้วว่าผมทำงานยังไง'));
    } else {
      toast(t('North Star found', 'เจอ North Star แล้ว') + ' (' + have.length + '/' + STARS.length + '): ' + t(s.en, s.th));
    }
    return true;
  }

  var toastTimer;
  function toast(text) {
    var el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.innerHTML = icon('star') + '<span></span>';
    el.querySelector('span').textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3600);
  }

  /* ---------- header + footer ---------- */
  var NAV = [
    ['work', 'projects.html', 'Work', 'ผลงาน'],
    ['play', 'playground.html', 'Playground', 'ลองเล่น'],
    ['learn', 'courses.html', 'Learn', 'คอร์ส'],
    ['hire', 'services.html', 'Work with me', 'จ้างงาน'],
    ['writing', 'blog.html', 'Writing', 'บทความ'],
    ['about', 'about.html', 'About', 'เกี่ยวกับผม']
  ];
  function header(page) {
    var links = NAV.map(function (n) {
      return '<a href="' + n[1] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '><span class="en">' + n[2] + '</span><span class="th">' + n[3] + '</span></a>';
    }).join('');
    return '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="wrap header-in">' +
      '<a class="wordmark" href="index.html" aria-label="Sarach Sriklab, home">' + MARK + '<span>Sarach Sriklab</span></a>' +
      '<nav class="nav" id="site-nav" aria-label="Main">' + links + '</nav>' +
      '<div class="header-tools">' +
      '<button class="pill-btn star-count" type="button" aria-expanded="false" aria-controls="stars-pop">' + icon('star') + '<span class="n">0/6</span><span class="sr-only">North Stars found</span></button>' +
      '<button class="pill-btn lang-btn" type="button" aria-label="Switch language / เปลี่ยนภาษา">' + icon('globe') + '<span class="lang-label">TH</span></button>' +
      '<button class="pill-btn menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">' + icon('menu') + '<span class="sr-only">Menu</span></button>' +
      '</div></div>' +
      '<div class="stars-pop" id="stars-pop" role="dialog" aria-label="North Stars">' +
      '<h2 class="h4"><span class="en">Six North Stars are hidden on this site</span><span class="th">มี North Star ซ่อนอยู่ 6 ดวงในเว็บนี้</span></h2>' +
      '<p class="small muted"><span class="en">Each one is something to try, not something to read.</span><span class="th">แต่ละดวงคือสิ่งที่ต้องลองทำ ไม่ใช่แค่อ่าน</span></p>' +
      '<ul id="stars-list"></ul></div></header>';
  }
  function footer() {
    var links = NAV.map(function (n) { return '<li><a href="' + n[1] + '"><span class="en">' + n[2] + '</span><span class="th">' + n[3] + '</span></a></li>'; }).join('');
    return '<footer class="site-footer"><div class="wrap">' +
      '<div class="footer-cta"><h2><span class="en">Let\'s find the one number your business should steer by.</span><span class="th">มาหาตัวเลขเดียวที่ธุรกิจของคุณควรใช้นำทางกัน</span></h2>' +
      '<div class="btn-row"><a class="btn" href="services.html#start"><span class="en">Start with a short call</span><span class="th">เริ่มจากคุยสั้น ๆ</span></a>' +
      '<a class="btn ghost" href="playground.html"><span class="en">Try the Playground</span><span class="th">ไปลองเล่น</span></a></div></div>' +
      '<div class="footer-grid">' +
      '<div><a class="wordmark" href="index.html">' + MARK + '<span>Sarach Sriklab</span></a>' +
      '<p class="muted small" style="margin-top:12px;max-width:40ch"><span class="en">Data analyst who works alongside AI. The person behind NorthBear, a data and AI education and consulting brand.</span><span class="th">Data Analyst ที่ทำงานคู่กับ AI และเป็นคนเบื้องหลัง NorthBear แบรนด์สอนและรับงานด้าน data และ AI</span></p>' +
      '<div class="social"><a href="https://github.com/sarach-analytics" aria-label="GitHub">' + icon('github') + '</a><a href="https://www.linkedin.com/in/sarach-sriklab-b1669715a/" aria-label="LinkedIn">' + icon('linkedin') + '</a><a href="https://medium.com/@srlk" aria-label="Medium">' + icon('pen') + '</a><a href="mailto:' + EMAIL + '" aria-label="Email">' + icon('mail') + '</a></div></div>' +
      '<div><h2 class="h4"><span class="en">Site</span><span class="th">เมนู</span></h2><ul>' + links + '</ul></div>' +
      '<div><h2 class="h4"><span class="en">Get in touch</span><span class="th">ติดต่อ</span></h2><ul>' +
      '<li><a href="index.html#contact"><span class="en">Send a message</span><span class="th">ส่งข้อความ</span></a></li>' +
      '<li><a href="mailto:' + EMAIL + '">' + EMAIL.replace('+', '+<wbr>') + '</a></li>' +
      '<li><a href="images/sarach-sriklab-resume.pdf"><span class="en">Download CV (PDF)</span><span class="th">ดาวน์โหลด CV (PDF)</span></a></li></ul></div>' +
      '</div>' +
      '<div class="footer-base"><span>&copy; ' + new Date().getFullYear() + ' Sarach Sriklab</span><span><span class="en">Charts on this site use Phra Nang House, a fictional hotel dataset.</span><span class="th">กราฟในเว็บนี้ใช้ข้อมูล Phra Nang House ซึ่งเป็นโรงแรมสมมติ</span></span></div>' +
      '</div></footer>';
  }

  /* ---------- forms (same Google Sheet as before) ---------- */
  function bindForm(form, opts) {
    opts = opts || {};
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      if (msg) { msg.className = 'form-msg'; msg.textContent = t('Sending...', 'กำลังส่ง...'); }
      var data = new FormData(form);
      if (opts.extra) Object.keys(opts.extra).forEach(function (k) { if (!data.get(k)) data.set(k, opts.extra[k]); });
      fetch(FORM_URL, { method: 'POST', body: data })
        .then(function () {
          if (msg) { msg.className = 'form-msg ok'; msg.textContent = opts.ok ? t(opts.ok[0], opts.ok[1]) : t('Thanks. I reply within two working days.', 'ขอบคุณครับ ผมจะตอบกลับภายใน 2 วันทำการ'); }
          form.reset(); applyLang(lang());
        })
        .catch(function () {
          if (msg) { msg.className = 'form-msg err'; msg.textContent = t('That did not send. Email me instead: ', 'ส่งไม่สำเร็จ ส่งอีเมลหาผมแทนได้ที่ ') + EMAIL; }
        })
        .then(function () { if (btn) btn.disabled = false; });
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    var h = document.getElementById('nb-header');
    if (h) h.outerHTML = header(h.getAttribute('data-page'));
    var f = document.getElementById('nb-footer');
    if (f) f.outerHTML = footer();
    paintIcons();

    var hdr = document.querySelector('.site-header');
    function onScroll() { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.addEventListener('click', function () { var l = lang() === 'th' ? 'en' : 'th'; save('nb-lang', l); applyLang(l); });
    });
    var menuBtn = document.querySelector('.menu-btn'), nav = document.getElementById('site-nav');
    if (menuBtn && nav) menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open);
      menuBtn.innerHTML = icon(open ? 'x' : 'menu') + '<span class="sr-only">Menu</span>';
    });
    var starBtn = document.querySelector('.star-count'), pop = document.getElementById('stars-pop');
    if (starBtn && pop) {
      starBtn.addEventListener('click', function (e) { e.stopPropagation(); var open = pop.classList.toggle('open'); starBtn.setAttribute('aria-expanded', open); });
      document.addEventListener('click', function (e) { if (!pop.contains(e.target)) { pop.classList.remove('open'); starBtn.setAttribute('aria-expanded', 'false'); } });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { pop.classList.remove('open'); starBtn.setAttribute('aria-expanded', 'false'); } });
    }
    document.querySelectorAll('form[data-nb-form]').forEach(function (f) {
      var kind = f.getAttribute('data-nb-form');
      if (kind === 'waitlist') bindForm(f, { extra: { ProjectType: 'Blueprint waitlist', Timeline: 'Launch', Message: 'Notify me when the Blueprint launches.' }, ok: ['You are on the list. I will email you on launch day.', 'ลงชื่อแล้วครับ วันเปิดตัวผมจะส่งอีเมลไปบอก'] });
      else bindForm(f);
    });
    renderStars();
    applyLang(load('nb-lang', 'en') === 'th' ? 'th' : 'en');
  }

  window.NB = { icon: icon, paintIcons: paintIcons, earn: earn, toast: toast, lang: lang, t: t, load: load, save: save, EMAIL: EMAIL };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
