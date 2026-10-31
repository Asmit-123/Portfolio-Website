(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var isHome = !!$("#top");
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Boot sequence (home only) ---------- */
  var boot = $("#boot"), typedStarted = false;
  function finishBoot() { boot.classList.add("done"); setTimeout(function () { boot.style.display = "none"; }, 700); startTyped(); }
  (function () {
    if (!boot) return startTyped();
    var seen = false; try { seen = sessionStorage.getItem("booted") === "1"; } catch (e) {}
    if (reduce || seen) { boot.style.display = "none"; return startTyped(); }
    try { sessionStorage.setItem("booted", "1"); } catch (e) {}
    var lines = ["> initializing neural interface...", "> loading vision models........ ok", "> linking projects............ ok", "> welcome, visitor."];
    var log = $("#bootLog"), fill = $("#bootFill"), i = 0;
    (function next() {
      if (i >= lines.length) { fill.style.width = "100%"; return setTimeout(finishBoot, 350); }
      log.textContent += lines[i++] + "\n"; fill.style.width = (i / lines.length * 100) + "%"; setTimeout(next, 330);
    })();
    boot.addEventListener("click", finishBoot);
  })();
  function startTyped() {
    var el = $("#typed"); if (!el || typedStarted) return; typedStarted = true;
    var words = ["AI/ML Engineer", "Computer Vision Developer", "LLM Application Builder", "Robotics & IoT Enthusiast"];
    if (reduce) { el.textContent = words[0]; return; }
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w]; el.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; }
      c += del ? -1 : 1; setTimeout(tick, del ? 35 : 70);
    })();
  }

  /* ---------- Nav ---------- */
  var nav = $("#nav"), menuBtn = $("#menuBtn"), links = $("#navLinks"), progress = $("#progress");
  function closeMenu() { if (!links) return; links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () { var o = links.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(o)); });
    links.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  }
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    if (progress) { var h = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + "%"; }
  }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Lightbox (shared) ---------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbItems = [], lbIdx = 0, lbFrom = null;
  function lbShow() {
    var it = lbItems[lbIdx]; lbImg.src = it.src; lbImg.alt = it.alt || ""; lbCap.textContent = it.cap || "";
    $("#lbPrev").hidden = $("#lbNext").hidden = lbItems.length < 2;
  }
  function lbStep(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; lbShow(); }
  function lbClose() { if (lb.hidden) return; lb.hidden = true; if (lbFrom && lbFrom.focus) lbFrom.focus(); }
  window.Lightbox = { open: function (items, i) { lbItems = items; lbIdx = i || 0; lbFrom = document.activeElement; lbShow(); lb.hidden = false; $("#lbClose").focus(); } };
  if (lb) {
    lb.addEventListener("click", function (e) { if (e.target === lb) lbClose(); });
    $("#lbClose").addEventListener("click", lbClose);
    $("#lbPrev").addEventListener("click", function () { lbStep(-1); });
    $("#lbNext").addEventListener("click", function () { lbStep(1); });
  }

  /* ---------- About photo scroller ---------- */
  var sc = $("#scroller");
  if (sc) (function () {
    var slides = $$(".sc-slide", sc), dotsBox = $("#scDots"), bar = $("#scBar"), count = $("#scCount"), label = $("#scLabel");
    var idx = 0, dragX = null, moved = false, pad = function (n) { return (n < 10 ? "0" : "") + n; };
    slides.forEach(function (s, i) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Show photo " + (i + 1));
      b.addEventListener("click", function (e) { e.stopPropagation(); go(i); }); dotsBox.appendChild(b);
    });
    var dots = $$("button", dotsBox);
    function restartBar() { bar.classList.remove("run"); void bar.offsetWidth; if (!reduce) bar.classList.add("run"); }
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-on", i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle("on", i === idx); d.setAttribute("aria-current", i === idx ? "true" : "false"); });
      count.textContent = pad(idx + 1) + " / " + pad(slides.length); label.textContent = slides[idx].dataset.cap; restartBar();
    }
    $(".prev", sc).addEventListener("click", function (e) { e.stopPropagation(); go(idx - 1); });
    $(".next", sc).addEventListener("click", function (e) { e.stopPropagation(); go(idx + 1); });
    bar.addEventListener("animationend", function () { go(idx + 1); });
    function pause(p) { sc.classList.toggle("paused", p); }
    var hov = false, vis = true;
    function sync() { pause(hov || !vis || document.hidden); }
    sc.addEventListener("mouseenter", function () { hov = true; sync(); });
    sc.addEventListener("mouseleave", function () { hov = false; sync(); });
    sc.addEventListener("focusin", function () { hov = true; sync(); });
    sc.addEventListener("focusout", function () { hov = false; sync(); });
    document.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; sync(); }, { threshold: 0.3 }).observe(sc);
    sc.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") go(idx - 1); if (e.key === "ArrowRight") go(idx + 1); });
    sc.addEventListener("pointerdown", function (e) { dragX = e.clientX; moved = false; });
    sc.addEventListener("pointerup", function (e) {
      if (dragX === null) return; var dx = e.clientX - dragX; dragX = null;
      if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); moved = true; }
    });
    sc.addEventListener("click", function () {
      if (moved) { moved = false; return; }
      window.Lightbox.open(slides.map(function (s) { var im = $("img", s); return { src: im.src, alt: im.alt, cap: im.alt }; }), idx);
    });
    go(0);
  })();

  /* ---------- Scramble, counters ---------- */
  var glyphs = "01<>/\\{}[]#$%&*+=";
  function scramble(el) {
    if (reduce || el.dataset.done) return; el.dataset.done = "1";
    var final = el.textContent, n = final.length, f = 0, total = 22;
    var t = setInterval(function () {
      var out = ""; for (var i = 0; i < n; i++) out += final[i] === " " ? " " : (i < n * f / total ? final[i] : glyphs[Math.floor(Math.random() * glyphs.length)]);
      el.textContent = out; if (++f > total) { clearInterval(t); el.textContent = final; }
    }, 32);
  }
  function fmt(el, v) { return (el.dataset.prefix || "") + v + (el.dataset.suffix || ""); }
  function count(el) {
    el.dataset.counted = "1"; var target = +el.dataset.count;
    if (reduce) { el.textContent = fmt(el, target); return; }
    var start = null, dur = 1400;
    (function step(t) {
      if (start === null) start = t; var p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(el, Math.round(+el.dataset.count * e)); if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* ---------- Reveal, stagger, scroll spy ---------- */
  $$(".chips,.stats,.project-grid,.mini-grid,.skill-grid,.points,.bs-grid").forEach(function (g) {
    g.classList.add("stagger"); $$(":scope > *", g).forEach(function (c, i) { c.style.setProperty("--i", i); });
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return; var s = en.target; s.classList.add("in");
        $$("[data-scramble]", s).forEach(scramble); $$("[data-count]", s).forEach(count); io.unobserve(s);
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (s) { io.observe(s); });
    if (links) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) $$("a", links).forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); }); });
      }, { rootMargin: "-45% 0px -50% 0px" });
      $$("main section[id]").forEach(function (s) { spy.observe(s); });
    }
  } else { $$(".reveal").forEach(function (s) { s.classList.add("in"); }); $$("[data-count]").forEach(count); }
  var heroName = $(".hero [data-scramble]"); if (heroName) setTimeout(function () { scramble(heroName); }, reduce ? 0 : 900);
  var pageTitle = $(".bs-head [data-scramble]"); if (pageTitle) setTimeout(function () { scramble(pageTitle); }, 300);

  /* ---------- Cursor glow + tilt ---------- */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches, mouse = { x: -999, y: -999 }, glow = $("#glow");
  if (fine && !reduce) {
    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (glow) { glow.style.opacity = 1; glow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)"; }
    }, { passive: true });
    $$(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 7) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }
  var copyBtn = $("#copyEmail");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var done = function () { copyBtn.textContent = "copied ✓"; setTimeout(function () { copyBtn.textContent = "copy"; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText("asmit.voyage@gmail.com").then(done, done); else done();
  });

  /* ---------- Live GitHub (repo count + opt-in "More builds") ---------- */
  var GH = "Asmit-123", TOPIC = "portfolio", FEATURED = ["football-tactical-map", "mathforge", "mutual-fund-analyzer"];
  function ghGet(key, url, tf, cb) {
    var now = Date.now();
    try { var c = JSON.parse(localStorage.getItem(key)); if (c && now - c.t < 36e5) return cb(c.d); } catch (e) {}
    fetch(url, { headers: { Accept: "application/vnd.github+json" } }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) { d = tf(d); try { localStorage.setItem(key, JSON.stringify({ t: now, d: d })); } catch (e) {} cb(d); }).catch(function () {});
  }
  var rc = $("#repoCount");
  if (rc) ghGet("gh-user", "https://api.github.com/users/" + GH, function (u) { return { n: u.public_repos }; }, function (u) {
    if (typeof u.n !== "number") return; rc.dataset.count = u.n; if (rc.dataset.counted) rc.textContent = fmt(rc, u.n);
  });
  var more = $("#moreBuilds");
  if (more) ghGet("gh-repos", "https://api.github.com/users/" + GH + "/repos?per_page=100&sort=pushed", function (list) {
    return list.map(function (r) { return { name: r.name, d: r.description, l: r.language, s: r.stargazers_count, u: r.html_url, f: r.fork, t: r.topics || [] }; });
  }, function (list) {
    var picks = list.filter(function (r) { return !r.f && r.t.indexOf(TOPIC) > -1 && FEATURED.indexOf(r.name.toLowerCase()) < 0; });
    if (!picks.length) return;                       // nothing tagged yet: keep the built-in list
    var tinker = $(".tinker", more);
    $$("a.mini", more).forEach(function (a) { a.remove(); });
    picks.forEach(function (r, i) {
      var a = document.createElement("a"); a.className = "mini hud"; a.href = r.u; a.target = "_blank"; a.rel = "noopener"; a.style.setProperty("--i", i);
      var b = document.createElement("b"); b.textContent = r.name.replace(/[-_]/g, " ");
      var p = document.createElement("p"); p.textContent = r.d || "See the repository for details.";
      var s = document.createElement("span"); s.textContent = [r.l, r.s ? "★ " + r.s : ""].filter(Boolean).join(" · ");
      a.appendChild(b); a.appendChild(p); a.appendChild(s); more.insertBefore(a, tinker);
    });
  });

  /* ---------- Quick navigation (Ctrl/Cmd + K) ---------- */
  (function () {
    var pre = isHome ? "" : "index.html";
    var items = [
      ["Home", "go to", pre + "#top"], ["About", "go to", pre + "#about"], ["Experience", "go to", pre + "#experience"], ["Skills", "go to", pre + "#skills"],
      ["Projects", "go to", pre + "#projects"], ["Contact", "go to", pre + "#contact"], ["Gallery", "page", "gallery.html"],
      ["Download resume", "pdf", "assets/Asmit-Bhattacharyya-Resume.pdf", 1], ["GitHub", "open", "https://github.com/Asmit-123", 1],
      ["LinkedIn", "open", "https://www.linkedin.com/in/asmit-bhattacharyya-37742442a", 1], ["Instagram", "open", "https://www.instagram.com/being.sojourner/", 1],
      ["Email me", "mail", "mailto:asmit.voyage@gmail.com"]
    ];
    var box = document.createElement("div"); box.className = "pal"; box.hidden = true;
    box.innerHTML = '<div class="pal-box" role="dialog" aria-modal="true" aria-label="Quick navigation"><input type="text" placeholder="Jump to..." aria-label="Search destinations" autocomplete="off" /><ul role="listbox"></ul></div>';
    document.body.appendChild(box);
    var input = $("input", box), ul = $("ul", box), cur = 0, shown = [], from = null;
    function render() {
      var q = input.value.trim().toLowerCase();
      shown = items.filter(function (it) { return !q || (it[0] + " " + it[1]).toLowerCase().indexOf(q) > -1; }); cur = 0; ul.innerHTML = "";
      if (!shown.length) { ul.innerHTML = '<li class="none">No match</li>'; return; }
      shown.forEach(function (it, i) {
        var li = document.createElement("li"), a = document.createElement("a"); a.href = it[2]; a.setAttribute("role", "option");
        if (it[3]) { a.target = "_blank"; a.rel = "noopener"; }
        a.innerHTML = "<span></span><small></small>"; a.firstChild.textContent = it[0]; a.lastChild.textContent = it[1];
        a.addEventListener("click", close); a.addEventListener("mousemove", function () { mark(i); }); li.appendChild(a); ul.appendChild(li);
      }); mark(0);
    }
    function mark(i) { cur = i; $$("a", ul).forEach(function (a, k) { a.classList.toggle("act", k === i); a.setAttribute("aria-selected", k === i); }); }
    function open() { from = document.activeElement; input.value = ""; render(); box.hidden = false; input.focus(); }
    function close() { if (box.hidden) return; box.hidden = true; if (from && from.focus) from.focus(); }
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); mark(Math.min(cur + 1, shown.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); mark(Math.max(cur - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); var a = $$("a", ul)[cur]; if (a) a.click(); }
    });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA)$/.test((e.target.tagName || ""));
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); box.hidden ? open() : close(); }
      else if (e.key === "/" && !typing && box.hidden && lb && lb.hidden) { e.preventDefault(); open(); }
      else if (e.key === "Escape") { close(); lbClose(); closeMenu(); }
      else if (lb && !lb.hidden && e.key === "ArrowLeft") lbStep(-1);
      else if (lb && !lb.hidden && e.key === "ArrowRight") lbStep(1);
    });
    var pb = $("#paletteBtn"); if (pb) pb.addEventListener("click", open);
  })();

  /* ---------- Neural network background ---------- */
  var cv = $("#net"); if (!cv) return;
  var ctx = cv.getContext("2d"), W, H, dpr, nodes = [], running = true;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); W = cv.width = window.innerWidth * dpr; H = cv.height = window.innerHeight * dpr;
    cv.style.width = window.innerWidth + "px"; cv.style.height = window.innerHeight + "px";
    var n = Math.max(28, Math.min(90, Math.floor(window.innerWidth * window.innerHeight / 18000))); nodes = [];
    for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr, r: (Math.random() * 1.4 + .8) * dpr, v: Math.random() < .22 });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H); var maxD = 150 * dpr, mx = mouse.x * dpr, my = mouse.y * dpr;
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) { ctx.strokeStyle = "rgba(" + (a.v || b.v ? "139,92,246" : "34,211,238") + "," + (1 - d / maxD) * .35 + ")"; ctx.lineWidth = dpr * .8; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      var md = Math.hypot(a.x - mx, a.y - my);
      if (md < 190 * dpr) { ctx.strokeStyle = "rgba(52,211,153," + (1 - md / (190 * dpr)) * .6 + ")"; ctx.lineWidth = dpr; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke(); }
      ctx.fillStyle = a.v ? "rgba(139,92,246,.9)" : "rgba(34,211,238,.85)"; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
    }
  }
  (function loop() { if (running) draw(); requestAnimationFrame(loop); })();
  resize(); window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });
  if (reduce) draw();
})();
