/* 오프닝 인트로 — 야간 정면 이륙 → 창문 진입 → 기내.
   assets/intro/의 실사 이미지 시퀀스를 우선 사용하고, intro.mp4가 있으면 영상으로 대체한다. */
(function () {
  "use strict";
  const CFG = window.INTRO_CONFIG;
  const intro = document.querySelector(".intro");
  if (!CFG || !intro) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, [a, b]) => clamp((p - a) / (b - a));
  const html = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const SEQUENCE = CFG.INTRO_MODE === "sequence";
  if (reduce) html.classList.add("is-reduced");
  // 시퀀스 모드에서만 인트로 전용 내비를 쓰고 사이트 내비를 숨긴다
  if (SEQUENCE) html.classList.add("intro-seq", "intro-active");

  const stage = $(".intro__stage", intro);
  const canvas = $(".intro__canvas", intro);
  const endCanvas = $(".intro__canvas--end", intro);
  const ctx = canvas.getContext("2d", { alpha: false });
  const ui = {
    invite: $(".intro__invite", intro),
    copy: $(".intro__copy", intro),
    cue: $(".intro__cue", intro),
    bloom: $(".intro__bloom", intro),
    flare: $(".intro__flare", intro),
    fade: $(".intro__fade", intro),
    skip: $(".intro-skip"),
  };
  const PH = CFG.PHASES;

  // ── 브랜드·언어 ────────────────────────────────────────────
  $$("[data-brand]").forEach((el) => { el.textContent = CFG.BRAND; });
  let lang = "ko";
  let words = [];
  function buildWords() {
    const text = CFG.COPY[lang].copy;
    ui.copy.setAttribute("aria-label", text);
    ui.copy.textContent = "";
    words = text.split(" ").map((w, i, all) => {
      const s = document.createElement("span");
      s.textContent = w;
      s.setAttribute("aria-hidden", "true");
      ui.copy.append(s);
      if (i < all.length - 1) ui.copy.append(" ");
      return s;
    });
  }
  function setLang(next) {
    lang = next;
    $$("[data-intro-i18n]").forEach((el) => { el.textContent = CFG.COPY[lang][el.dataset.introI18n]; });
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    buildWords();
    paintDom(cur);
  }
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  // 햄버거 메뉴 — 내비를 뺀 쇼잉 모드에서는 요소가 없으므로 건너뛴다
  const menu = $(".intro-menu");
  const menuBtn = $(".intro-nav__menu");
  if (menu && menuBtn) {
    const toggleMenu = (open) => {
      menu.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menu.inert = !open;
      if (open) menu.querySelector("a")?.focus();
    };
    menu.inert = true;
    menuBtn.addEventListener("click", () => toggleMenu(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) toggleMenu(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) { toggleMenu(false); menuBtn.focus(); } });
  }

  // 필름 그레인 (어두운 그라데이션의 밴딩을 흩뜨린다)
  (function grain() {
    const g = document.createElement("canvas");
    g.width = g.height = 160;
    const c = g.getContext("2d");
    const img = c.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    c.putImageData(img, 0, 0);
    stage.style.setProperty("--grain", `url(${g.toDataURL()})`);
  })();

  // ── 캔버스 ────────────────────────────────────────────────
  let W = 0, H = 0, DPR = 1, mobile = false;
  function size(cv, c) {
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function resize() {
    DPR = Math.min(CFG.DPR_MAX, devicePixelRatio || 1);
    W = stage.clientWidth;
    H = stage.clientHeight;
    mobile = W < CFG.MOBILE_BREAKPOINT;
    size(canvas, ctx);
    if (endCanvas) size(endCanvas, endCanvas.getContext("2d"));
    dirty = true;
    if (reduce) drawReduced();
  }

  // object-fit: cover + 기준점 크롭
  function drawCover(c, img, alpha = 1) {
    const iw = img.videoWidth || img.width, ih = img.videoHeight || img.height;
    if (!iw || !ih) return;
    const [fx, fy] = mobile ? CFG.FOCAL.mobile : CFG.FOCAL.desktop;
    const s = Math.max(W / iw, H / ih);
    const dw = iw * s, dh = ih * s;
    c.globalAlpha = alpha;
    c.drawImage(img, (W - dw) * fx, (H - dh) * fy, dw, dh);
    c.globalAlpha = 1;
  }

  // ── 렌더러 ────────────────────────────────────────────────
  async function exists(url) {
    try { const r = await fetch(url, { method: "HEAD", cache: "no-store" }); return r.ok; } catch { return false; }
  }

  function sequence(pathFn) {
    const N = CFG.INTRO_FRAME_COUNT;
    const frames = new Array(N).fill(null);
    const load = async (i) => {
      if (frames[i]) return;
      try {
        const r = await fetch(pathFn(i + 1));
        if (!r.ok) return;
        frames[i] = await createImageBitmap(await r.blob());
        dirty = true;
      } catch { /* 빠진 프레임은 가까운 프레임으로 대신한다 */ }
    };
    const run = async (list, n) => {
      let k = 0;
      await Promise.all(Array.from({ length: n }, async () => { while (k < list.length) await load(list[k++]); }));
    };
    // 거친 간격부터 채워서 아직 안 온 프레임도 가까운 프레임으로 메운다
    const coarseToFine = (from) => {
      const seen = new Set(), out = [];
      for (const step of [16, 8, 4, 2, 1]) for (let i = from; i < N; i += step) if (!seen.has(i)) { seen.add(i); out.push(i); }
      return out;
    };
    const ready = (async () => {
      await load(0);
      if (reduce) { await load(N - 1); return; }
      await run(Array.from({ length: Math.min(CFG.PRIORITY_FRAMES, N) - 1 }, (_, i) => i + 1), 6);
      run(coarseToFine(CFG.PRIORITY_FRAMES), 4);
    })();
    const nearest = (i) => {
      if (frames[i]) return frames[i];
      for (let d = 1; d < N; d++) { if (frames[i - d]) return frames[i - d]; if (frames[i + d]) return frames[i + d]; }
      return null;
    };
    return {
      ready,
      draw(c, p) {
        const f = clamp(p) * (N - 1);
        const i0 = Math.floor(f), i1 = Math.min(N - 1, i0 + 1), k = f - i0;
        const a = nearest(i0), b = nearest(i1);
        if (!a) return;
        c.fillStyle = "#0c0f14";
        c.fillRect(0, 0, W, H);
        drawCover(c, a);
        if (b && b !== a && k > 0.02) drawCover(c, b, k); // 프레임 사이 보간
      },
      animated: false,
    };
  }

  function video(src) {
    const v = document.createElement("video");
    Object.assign(v, { src, muted: true, playsInline: true, preload: "auto" });
    const ready = new Promise((res) => v.addEventListener("loadeddata", res, { once: true }));
    let want = 0;
    return {
      ready,
      draw(c, p) {
        if (v.duration) {
          want = clamp(p) * (v.duration - 0.05);
          if (!v.seeking && Math.abs(v.currentTime - want) > 0.02) v.currentTime = want;
        }
        c.fillStyle = "#0c0f14";
        c.fillRect(0, 0, W, H);
        drawCover(c, v);
      },
      animated: true,
    };
  }

  const unavailable = {
    ready: Promise.resolve(),
    draw(c) { c.fillStyle = "#0c0f14"; c.fillRect(0, 0, W, H); },
    animated: false,
  };

  let renderer = null;
  async function pickRenderer() {
    const mobilePath = mobile && (await exists(CFG.FRAME_PATH_MOBILE(1)));
    if (mobilePath) return sequence(CFG.FRAME_PATH_MOBILE);
    if (await exists(CFG.FRAME_PATH(1))) return sequence(CFG.FRAME_PATH);
    if (CFG.VIDEO_PATH && (await exists(CFG.VIDEO_PATH))) return video(CFG.VIDEO_PATH);
    return unavailable;
  }

  // ── DOM 오버레이 ──────────────────────────────────────────
  function paintDom(p) {
    if (reduce) return;
    ui.invite.style.opacity = String(1 - clamp(seg(p, PH.roll) / 0.5));
    ui.cue.style.opacity = String(1 - clamp(p / 0.03));
    // 창문 진입: 앰버 빛이 번졌다가 가라앉는다
    const w = seg(p, PH.window), cab = seg(p, PH.cabin);
    const bloom = p < PH.window[1] ? Math.pow(clamp((w - 0.4) / 0.6), 2) * 0.5 : 0.5 * (1 - clamp(cab / 0.2));
    ui.bloom.style.opacity = bloom.toFixed(3);
    ui.flare.style.opacity = (Math.sin(Math.PI * clamp((w - 0.45) / 0.55)) * 0.6).toFixed(3);
    // 끝부분은 다음 섹션의 차가운 블랙으로 완전히 녹인다
    ui.fade.style.opacity = clamp((cab - 0.2) / 0.8).toFixed(3);
    // 핵심 카피: 단어 단위 dim → bright
    const c = seg(p, PH.copy);
    ui.copy.style.opacity = c > 0 ? "1" : "0";
    words.forEach((s, i) => { s.style.opacity = (0.14 + 0.86 * clamp(c * (words.length + 1) - i - 0.4)).toFixed(3); });
    ui.skip?.classList.toggle("is-hidden", p >= 0.995);
  }

  // ── 스크롤 · 렌더 루프 ────────────────────────────────────
  let target = 0, cur = 0, dirty = true, visible = true, st = null, lenis = null;
  const t0 = performance.now();

  function frame() {
    if (!visible || !renderer) return;
    const prev = cur;
    cur += (target - cur) * CFG.SMOOTHING;
    if (Math.abs(target - cur) < 0.0002) cur = target;
    if (renderer.animated || dirty || cur !== prev) {
      renderer.draw(ctx, cur, (performance.now() - t0) / 1000);
      dirty = false;
    }
    paintDom(cur);
  }

  function drawReduced() {
    if (!renderer) return;
    renderer.draw(ctx, 0, 0);
    if (endCanvas) renderer.draw(endCanvas.getContext("2d"), 1, 0);
    words.forEach((s) => { s.style.opacity = "1"; });
  }

  const introEnd = () => (st ? st.end : intro.offsetTop + intro.offsetHeight - innerHeight);
  ui.skip?.addEventListener("click", () => {
    const y = introEnd() + 2;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    $("#overview")?.setAttribute("tabindex", "-1");
    setTimeout(() => $("#overview")?.focus({ preventScroll: true }), reduce ? 0 : 1400);
  });

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) dirty = true; }, { threshold: 0 }).observe(intro);

  // 스크롤 구조는 즉시 만든다 — 아래 섹션들의 ScrollTrigger가 인트로 고정 길이를 알고 계산되도록
  function setupScroll() {
    if (reduce || !hasGsap) {
      // 시퀀스 대신 첫 장면 → 마지막 장면을 페이드로만 바꾼다
      html.classList.add("is-reduced");
      const onScroll = () => {
        const r = intro.getBoundingClientRect();
        intro.classList.toggle("is-end", -r.top > (intro.offsetHeight - innerHeight) * 0.5);
        html.classList.toggle("intro-active", r.bottom > innerHeight * 0.5);
        ui.skip?.classList.toggle("is-hidden", r.bottom <= innerHeight + 2);
      };
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return;
    }
    initLenis();
    st = ScrollTrigger.create({
      trigger: intro,
      start: "top top",
      end: () => `+=${(innerHeight * CFG.INTRO_LENGTH_VH) / 100}`,
      pin: true,
      scrub: true,
      refreshPriority: 10,
      invalidateOnRefresh: true,
      onUpdate: (self) => { target = self.progress; },
      onLeave: () => html.classList.remove("intro-active"),
      onEnterBack: () => html.classList.add("intro-active"),
    });
    target = cur = st.progress;
    gsap.ticker.add(frame);
  }

  function initLenis() {
    gsap.registerPlugin(ScrollTrigger);
    if (!window.Lenis || lenis) return;
    // Lenis와 GSAP ticker를 하나의 rAF 루프로
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, virtualScroll: (d) => (window.momenWheelFilter ? window.momenWheelFilter(d) : true) }); // 갤러리 가로 스와이프는 기본 스크롤에 맡긴다 (motion.js)
    window.lenis = lenis; // 맨 위로 버튼 등 다른 스크립트가 같은 스크롤을 쓴다
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    html.style.scrollBehavior = "auto";
  }

  // 히어로 모드 — 창문 히어로
  // 로딩: 벽이 살짝 다가오며 블라인드가 올라간 뒤 로고가 흐림에서 또렷하게 나타난다 (그동안 스크롤을 잠근다)
  // 스크롤: 기내 벽이 창문 중심으로 커지며 화면 밖으로 빠지고, 밤하늘만 남는다
  function setupHero() {
    const hero = $(".intro-hero", intro);
    if (!hero) return;
    const el = {
      sky: $(".wh-sky", hero), cabin: $(".wh-cabin", hero),
      shade: $(".wh-shade", hero), logo: $(".wh-logo", hero), vignette: $(".wh-vignette", hero), fade: $(".wh-fade", hero),
    };
    if (reduce || !hasGsap) return;
    initLenis();
    html.classList.add("intro-hero-motion");

    const ZOOM = 4; // 끝에서 창문 배율 — 유리가 화면 폭을 넉넉히 넘고 창틀이 모두 빠지는 값
    const s = { p: 0, settle: 1.05, shade: 0, logo: 0 };
    function render() {
      const p = s.p;
      // 배율을 지수로 키워야 다가가는 속도가 일정하게 느껴진다
      el.cabin.style.transform = `scale(${(s.settle * Math.pow(ZOOM, p)).toFixed(4)})`;
      el.sky.style.transform = `scale(${(1.04 + 0.1 * p).toFixed(4)})`;
      el.shade.style.transform = `translateY(${(-92 * s.shade).toFixed(2)}%)`;
      el.logo.style.opacity = s.logo.toFixed(3);
      el.logo.style.filter = s.logo < 1 ? `blur(${((1 - s.logo) * 18).toFixed(2)}px)` : "none";
      el.logo.style.transform = `translate(-50%, -50%) scale(${(1 + 0.08 * (1 - s.logo) + 0.1 * p).toFixed(4)})`;
      el.vignette.style.opacity = (1 - 0.5 * p).toFixed(3);
      el.fade.style.opacity = clamp((p - 0.72) / 0.28).toFixed(3);
    }
    render();

    ScrollTrigger.create({
      trigger: hero, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: (self) => { s.p = self.progress; render(); },
      onRefresh: (self) => { s.p = self.progress; render(); },
    });

    // 로딩 연출 — 새로고침해도 늘 맨 위 히어로에서, 매번 같은 길이로 시작한다
    // 브라우저와 ScrollTrigger 둘 다 이전 위치를 되돌리므로, 기억을 지우고 로드가 끝난 뒤에도 한 번 더 맨 위로
    ScrollTrigger.clearScrollMemory("manual");
    const toTop = () => { scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true, force: true }); };
    toTop();
    addEventListener("load", () => { toTop(); ScrollTrigger.refresh(); }, { once: true });
    addEventListener("pageshow", (e) => { if (e.persisted) location.reload(); }); // 뒤로 가기 캐시로 돌아와도 처음부터
    lenis?.stop();
    const imgs = [...hero.querySelectorAll("img")];
    Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()))).then(() => {
      const io = "power3.inOut";
      gsap.timeline({ delay: 0.6, onUpdate: render, onComplete: () => lenis?.start() })
        .to(s, { settle: 1, duration: 2.6, ease: "power2.out" }, 0)
        .to(s, { shade: 1, duration: 1.8, ease: io }, 0.5)
        .to(s, { logo: 1, duration: 1.4, ease: "power2.out" }, 1.6); // 흐림은 로고 글자에만
    });
  }

  // 낮(도착 이후) 판정 — 메뉴로 앞 섹션에 바로 점프해도 밤으로 돌아오도록 스크롤 위치로 매번 다시 정한다
  (function dayWatch() {
    const proof = document.querySelector("#landing ~ section[data-theme=\"light\"]"); // 착륙 다음 첫 흰 섹션
    const landing = document.querySelector("#landing");
    if (!proof) return;
    let ticking = false;
    const check = () => {
      ticking = false;
      // 착륙 섹션이 흰색으로 거의 바뀐 시점(고정 구간의 마지막 35%)부터 낮으로 — 밤의 비네팅이 흰 화면에 회색 띠로 남지 않게
      const l = landing?.getBoundingClientRect();
      const landingWhite = l && l.bottom - innerHeight < (l.height - innerHeight) * 0.35;
      // 착륙 전에 끼어 있는 흰 섹션(좌석 비교)도 화면 가운데를 덮는 동안은 낮으로
      const lightInView = [...document.querySelectorAll('section[data-theme="light"]')].some((el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5; });
      document.body.classList.toggle("grounded", proof.getBoundingClientRect().top < innerHeight * 0.66 || !!landingWhite || lightInView);
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    addEventListener("resize", check);
    check();
  })();

  async function start() {
    if (!SEQUENCE) { setupHero(); return; }
    buildWords();
    resize();
    addEventListener("resize", resize);
    setupScroll();
    const picked = await pickRenderer();
    intro.dataset.renderer = picked === unavailable ? "unavailable" : picked.animated ? "video" : "sequence";
    await picked.ready;
    renderer = picked;
    dirty = true;
    if (reduce || !hasGsap) drawReduced();
  }

  start();
})();
