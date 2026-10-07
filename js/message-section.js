(() => {
  const config = window.MESSAGE_CONFIG;
  if (!config) return;

  const section = document.querySelector(config.section);
  if (!section) return;

  const frame = section.querySelector("[data-message-scene]");
  const inImage = section.querySelector('[data-message-image="in"] img');
  const outImage = section.querySelector('[data-message-image="out"] img');
  const outLayer = section.querySelector('[data-message-image="out"]');
  const inMobile = section.querySelector('[data-message-source="in-mobile"]');
  const outMobile = section.querySelector('[data-message-source="out-mobile"]');
  const monitorStroke = section.querySelector(".journey-message__monitor-stroke");
  const captions = [...section.querySelectorAll(".journey-message__caption")];
  const title = section.querySelector(".journey-message__title");
  const words = [...section.querySelectorAll(".journey-message__title h2 span")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 734px)");
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // 천천히 시작해 천천히 멈춘다

  inImage.src = config.images.in;
  outImage.src = config.images.out;
  inMobile.srcset = config.images.inMobile;
  outMobile.srcset = config.images.outMobile;

  function render(progress) {
    const reveal = range(progress, config.timing.revealStart, config.timing.revealEnd);
    const captionProgress = range(progress, config.timing.captionStart, config.timing.captionEnd);
    const titleProgress = range(progress, config.timing.titleStart, config.timing.titleEnd);

    // 처음엔 왼쪽(기내) 사진이 화면을 꽉 채우고, 스크롤하면 오른쪽(여행지) 사진이 오른쪽 끝에서 밀려 들어와 절반을 채운다
    const r = easeInOut(reveal);
    outLayer.style.clipPath = mobile.matches
      ? `inset(${100 - 50 * r}% 0 0 0)`
      : `inset(0 0 0 ${100 - 50 * r}%)`;

    if (monitorStroke) monitorStroke.style.strokeDashoffset = String(1 - reveal);
    inImage.style.transform = "scale(1.04)"; // 들어온 뒤 다시 움직이지 않게 — 패럴랙스 없음
    // 사진도 오른쪽에서 함께 밀려 들어오는 느낌으로 (경계보다 조금 덜 움직인다)
    outImage.style.transform = mobile.matches
      ? `translate3d(0, ${18 * (1 - r)}%, 0) scale(1.04)`
      : `translate3d(${18 * (1 - r)}%, 0, 0) scale(1.04)`;

    captions.forEach((caption) => {
      caption.style.opacity = String(captionProgress);
      caption.style.transform = `translate3d(0, ${14 * (1 - captionProgress)}px, 0)`;
    });

    // 사진이 다 들어온 뒤에야 제목이 떠오른다 (아래에서 살짝 올라오며)
    const tIn = easeInOut(range(progress, config.timing.titleStart, config.timing.titleStart + config.timing.titleFade));
    title.style.opacity = String(tIn);
    title.style.transform = `translate(-50%, calc(-50% + ${24 * (1 - tIn)}px))`;
    words.forEach((word, index) => {
      const wordProgress = easeInOut(clamp(titleProgress * (words.length + 1) / 2 - index / 2)); // 단어가 겹치며 천천히 밝아진다
      word.style.opacity = String(0.2 + wordProgress * 0.8);
    });
  }

  function renderStatic() {
    render(1);
    inImage.style.transform = "none";
    outImage.style.transform = "none";
  }

  const observer = new IntersectionObserver(([entry]) => {
    section.classList.toggle("is-active", entry.isIntersecting);
  }, { rootMargin: "100% 0px" });
  observer.observe(section);

  if (reduceMotion.matches || typeof window.ScrollTrigger === "undefined") {
    renderStatic();
    return;
  }

  // 스크롤 값을 그대로 쓰지 않고 매 프레임 목표값을 부드럽게 따라간다(히어로와 같은 방식) — 휠 한 칸마다 끊기지 않게
  let target = 0, cur = 0;
  render(0);
  const trigger = window.ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    onUpdate: ({ progress }) => { target = progress; },
    onRefresh: ({ progress }) => { target = cur = progress; render(cur); }
  });
  const tick = () => {
    if (!section.classList.contains("is-active") && Math.abs(target - cur) < 0.0005) return;
    const prev = cur;
    cur += (target - cur) * 0.1;
    if (Math.abs(target - cur) < 0.0005) cur = target;
    if (cur !== prev) render(cur);
  };
  if (window.gsap) window.gsap.ticker.add(tick); else (function loop() { tick(); requestAnimationFrame(loop); })();

  mobile.addEventListener("change", () => render(cur));
  reduceMotion.addEventListener("change", ({ matches }) => {
    if (matches) renderStatic();
    else render(trigger.progress);
  });

  Promise.allSettled([inImage.decode(), outImage.decode()]).then(() => window.ScrollTrigger.refresh());
})();
