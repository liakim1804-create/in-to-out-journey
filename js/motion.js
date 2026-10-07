/* 추가 인터랙션 — Apple 제품 페이지의 스크롤 문법을 참고했다.
   모두 스크롤에 묶이거나(scrub) 위로 올라가면 되감기므로(reverse) 몇 번을 오르내려도 다시 재생된다 */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── 맨 위로 버튼 — 첫 화면을 지나면 나타난다 ─────────────
  const top = $(".to-top");
  if (top) {
    let ticking = false;
    const sync = () => {
      ticking = false;
      top.classList.toggle("is-visible", scrollY > innerHeight * 0.9);
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(sync); } }, { passive: true });
    sync();
    top.addEventListener("click", (event) => {
      event.preventDefault();
      if (window.lenis) window.lenis.scrollTo(0, { duration: 1.6 });
      else scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      $(".intro-hero__title")?.setAttribute("tabindex", "-1");
      setTimeout(() => $(".intro-hero__title")?.focus({ preventScroll: true }), reduce ? 0 : 1600);
    });
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const back = { toggleActions: "play none none reverse" };

  // 1. 섹션 제목 — 화면에 들어오면 아래에서 떠오르고, 위로 벗어나면 가라앉는다
  $$("#features-title, #benefits-title, #cabins-title, #booking-title").forEach((el) => {
    gsap.from(el, { y: 64, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", ...back } });
  });

  // 2. 제목 아래 한 줄 — 제목보다 조금 늦게
  $$(".booking-copy > p, .marketing-heading label, .marketing-heading select").forEach((el) => {
    gsap.from(el, { y: 28, opacity: 0, duration: .9, delay: .12, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", ...back } });
  });

  // 3. 사진은 들어오며 살짝 줌아웃 (스크롤에 묶임)
  $$(".bento-tile--photo img, .welcome img").forEach((img) => {
    img.classList.add("is-scrubbed");
    gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "center 55%", scrub: true } });
  });

  // 6. 비교표 — 줄마다 차례로
  if ($(".comparison-table tbody tr")) {
    gsap.from(".comparison-table tbody tr", { y: 24, opacity: 0, stagger: .08, duration: .6, ease: "power2.out", scrollTrigger: { trigger: ".comparison-table", start: "top 85%", ...back } });
  }

  // 7. 객실 — 토글 · 목업 · 말풍선이 가볍게 페이드 업 (위로 벗어나면 되감김)
  if ($(".ife")) {
    gsap.timeline({ scrollTrigger: { trigger: ".ife", start: "top 85%", ...back } })
      .from(".ife .cabin-tabs", { y: 20, opacity: 0, duration: .5, ease: "power2.out" })
      .from(".ife-view", { y: 40, opacity: 0, duration: .8, ease: "power3.out" }, "-=.25")
      .from(".ife-bubble-wrap", { y: 24, opacity: 0, duration: .6, ease: "power2.out" }, "-=.45");
  }

  // 8. 예약 — 검색창과 버튼이 차례로, 뒤의 빛은 스크롤만큼 떠오른다
  if ($(".flight-search")) {
    gsap.timeline({ scrollTrigger: { trigger: ".flight-search", start: "top 90%", ...back } })
      .from(".flight-search", { y: 40, opacity: 0, duration: .8, ease: "power3.out" })
      .from(".booking-actions > *", { y: 16, opacity: 0, stagger: .1, duration: .5, ease: "power2.out" }, "-=.3");
  }
  if ($(".booking-glow")) {
    gsap.fromTo(".booking-glow", { yPercent: 25, scale: .85 }, { yPercent: -10, scale: 1.05, ease: "none", scrollTrigger: { trigger: "#booking", start: "top bottom", end: "bottom top", scrub: true } });
  }

  // 9. 기능 갤러리 — 화면에 보일 때만 자동 재생 (Apple 갤러리처럼)
  if ($("#features") && typeof window.startFeatureCarousel === "function") {
    ScrollTrigger.create({
      trigger: "#features", start: "top 70%", end: "bottom 30%",
      onToggle: (self) => {
        if (self.isActive) window.startFeatureCarousel();
        else if (typeof featureTimer !== "undefined") clearInterval(featureTimer); // main.js의 타이머
      },
    });
  }

  // 10. 스크롤 연출이 없던 섹션 — 같은 문법(아래에서 떠오름, 위로 벗어나면 되감김)으로 통일
  const rise = (targets, trigger, extra = {}) => {
    const els = $$(targets);
    if (!els.length) return;
    gsap.from(els, { y: 48, opacity: 0, duration: 1, ease: "power3.out", stagger: .12, scrollTrigger: { trigger: $(trigger) || els[0], start: "top 80%", ...back }, ...extra });
  };
  rise(".overview-shot__stack", ".overview-shot", { scale: .96, y: 64 });
  rise("#concept .concept-head h2, #concept .gallery", "#concept");

  ScrollTrigger.refresh();
})();

/* 디자인 컨셉 갤러리 — 이전·다음 버튼, 점, 현재 카드 표시 (가로 스와이프·트랙패드는 기본 스크롤) */
(function () {
  "use strict";
  const g = document.querySelector("[data-gallery]");
  if (!g) return;
  const track = g.querySelector("[data-gallery-track]");
  const items = [...g.querySelectorAll("[data-gallery-item]")];
  const dots = [...g.querySelectorAll("[data-gallery-dot]")];
  const prev = g.querySelector("[data-gallery-prev]");
  const next = g.querySelector("[data-gallery-next]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = -1;
  // 이전·다음·점 — 스냅 지점으로 부드럽게 이동 (손으로 밀 때는 브라우저 기본 스크롤 + CSS 스냅, apple.com 갤러리와 같은 방식)
  const go = (i) => {
    i = Math.max(0, Math.min(items.length - 1, i));
    track.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };
  const sync = () => {
    const base = items[0].offsetLeft;
    let i = 0, best = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.offsetLeft - base - track.scrollLeft); if (d < best) { best = d; i = k; } });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) i = items.length - 1;
    if (i === current) return;
    current = i;
    items.forEach((it, k) => it.classList.toggle("is-current", k === i));
    dots.forEach((d, k) => { d.classList.toggle("is-active", k === i); d.setAttribute("aria-selected", String(k === i)); });
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === items.length - 1;
  };
  let t = 0;
  track.addEventListener("scroll", () => { cancelAnimationFrame(t); t = requestAnimationFrame(sync); }, { passive: true });
  addEventListener("resize", () => { current = -1; sync(); });
  prev?.addEventListener("click", () => go(current - 1));
  next?.addEventListener("click", () => go(current + 1));
  dots.forEach((d, k) => d.addEventListener("click", () => go(k)));
  track.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(current + 1); if (e.key === "ArrowLeft") go(current - 1); });

  // 트랙패드 가로 스와이프는 브라우저 기본 스크롤(관성·스냅)에 맡긴다.
  // 가로로 시작한 제스처는 Lenis가 건드리지 않게 하고(intro.js의 virtualScroll이 이 필터를 부른다),
  // 가로 제스처는 브라우저가 트랙에 고정(스크롤 래칭)하므로 세로로 새지 않는다.
  let axis = null, sx = 0, sy = 0, idle = 0;
  window.momenWheelFilter = ({ event, deltaX, deltaY }) => {
    if (event.type !== "wheel" || !track.contains(event.target)) return true;
    clearTimeout(idle);
    idle = setTimeout(() => { axis = null; sx = sy = 0; }, 160); // 관성 꼬리까지 한 제스처
    if (!deltaX && !deltaY) return true; // 값 없는 입력으로는 축을 정하지 않는다
    sx += deltaX; sy += deltaY;
    const ax = Math.abs(sx), ay = Math.abs(sy);
    if (!axis) axis = ax > ay * 1.2 ? "x" : "y"; // 가로가 확실할 때만 가로 — 애매하면 세로(페이지 스크롤)
    else if (axis === "y" && ax > 16 && ax > ay * 2) axis = "x"; // 세로로 시작했어도 가로가 확실해지면
    else if (axis === "x" && ay > 16 && ay > ax * 2) axis = "y"; // 가로로 잘못 잡혔어도 세로가 분명하면 페이지로
    return axis !== "x"; // false면 Lenis가 이 이벤트를 그냥 지나친다
  };
  track.tabIndex = 0;
  sync();
})();

/* 콘셉트 선언(#overview) — 단어가 스크롤만큼 부드럽게 켜진다 */
(function () {
  "use strict";
  const sec = document.querySelector("#overview");
  if (!sec || !window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const words = [...sec.querySelectorAll(".word-reveal span")];
  const clamp = (v) => Math.min(1, Math.max(0, v));
  let cur = 0, target = 0;
  const render = (p) => {
    // 단어: 앞 60% 구간에서 하나씩 겹치며 켜진다 (0.18 → 1)
    const wp = clamp(p / 0.6) * (words.length + 1.5);
    words.forEach((w, i) => { const k = clamp(wp - i); w.style.opacity = (0.18 + 0.82 * k).toFixed(3); });
  };
  ScrollTrigger.create({ trigger: sec.querySelector("#overview-title"), start: "top 85%", end: "bottom 45%", onUpdate: (self) => { target = self.progress; }, onRefresh: (self) => { target = self.progress; } });
  gsap.ticker.add(() => { const prev = cur; cur += (target - cur) * 0.18; if (Math.abs(target - cur) < 0.0005) cur = target; if (cur !== prev || !render.done) { render(cur); render.done = true; } });
})();


/* 벤토 마지막 타일 — 스크롤하면 화면을 꽉 채운다. 고정 구간의 앞 55%에서 커지고 나머지는 꽉 찬 채로 머문다 */
(function () {
  "use strict";
  const box = document.querySelector("[data-bento-expand]");
  if (!box || !window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ease = (t) => 1 - Math.pow(1 - t, 2); // 시작은 빠르게, 화면에 닿을 때 부드럽게
  const set = (self) => {
    const p = ease(Math.min(1, self.progress / 0.55));
    box.style.setProperty("--p", p.toFixed(4));
    box.classList.toggle("is-full", p > 0.9); // 버튼은 다 보일 때만 누를 수 있게
  };
  ScrollTrigger.create({ trigger: box, start: "top top", end: "bottom bottom", onUpdate: set, onRefresh: set });
})();

/* 시작 화면 — 섹션에 들어오면 선택된 모드 카드가 1.5초마다 옆으로 넘어간다. 벗어나면 멈추고 다시 들어오면 이어간다 */
(function () {
  "use strict";
  const fig = document.querySelector("[data-start-cycle]");
  if (!fig || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const imgs = [...fig.querySelectorAll("img")];
  let i = 0, timer = 0;
  const show = (k) => {
    const prev = i; i = k % imgs.length;
    imgs.forEach((im, n) => { im.classList.toggle("is-prev", n === prev); im.classList.toggle("is-on", n === i); });
  };
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting) timer = setInterval(() => show(i + 1), 1500);
  }, { threshold: 0.5 }).observe(fig);
})();
