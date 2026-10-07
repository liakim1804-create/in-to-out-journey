const CONFIG = Object.freeze({ brand: "MOMEN", totalMinutes: 780 });
const FLIGHT_STAGES = Object.freeze(["BOARD", "ENJOY", "REST", "PREPARE", "TRAVEL"]);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapReady = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

document.querySelectorAll("[data-brand]").forEach((node) => { node.textContent = CONFIG.brand; });

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function setMode(mode, userInitiated = false) {
  if (!["enjoy", "rest", "work"].includes(mode)) return;
  $$("[data-mode]").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  $$("[data-mode-card]").forEach((card) => card.classList.toggle("is-active", card.dataset.modeCard === mode));
}

// 탭을 눌러도 스크롤 연동은 유지한다 — 그 모드 구간으로 스크롤을 옮겨 준다(한 번 누르면 스크롤이 멈추던 잠금 제거)
const MODE_AT = { enjoy: .16, rest: .5, work: .84 };
$$("[data-mode]").forEach((button) => button.addEventListener("click", () => {
  const mode = button.dataset.mode;
  setMode(mode);
  const sec = $("#mode");
  if (!sec || !gsapReady || reducedMotion) return;
  const y = sec.offsetTop + (sec.offsetHeight - innerHeight) * MODE_AT[mode];
  if (window.lenis) window.lenis.scrollTo(y, { duration: .8 }); else scrollTo({ top: y, behavior: "smooth" });
}));

const dialog = $(".film-dialog");
$("[data-open-film]")?.addEventListener("click", () => dialog.showModal());
$("[data-close-film]")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
$(".meal-toast button")?.addEventListener("click", (event) => event.currentTarget.closest(".meal-toast").remove());

function updateFlightProgress() {
  const marker = scrollY + innerHeight * .42;
  const currentSection = $$('[data-stage]').filter((section) => section.offsetTop <= marker).at(-1);
  if (currentSection && FLIGHT_STAGES.includes(currentSection.dataset.stage)) updateActiveStage(currentSection.dataset.stage);
  else if (!currentSection) updateActiveStage(null); // 인트로 구간에서는 메뉴 강조를 끈다
}

function updateActiveStage(stage) {
  $$("[data-stage-link]").forEach((link) => link.classList.toggle("is-active", link.dataset.stageLink === stage));
}

if (gsapReady && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  // #overview 인터랙션은 motion.js에서 (단어 점등)

  ScrollTrigger.create({
    trigger: "#mode", start: "top top", end: "bottom bottom", scrub: true,
    onUpdate: ({ progress }) => {
      setMode(progress < .335 ? "enjoy" : progress < .665 ? "rest" : "work");
    }
  });
}

addEventListener("scroll", updateFlightProgress, { passive: true });
updateFlightProgress();

const SLEEP_STEPS = [
  { label: "밝음", kicker: "WIND DOWN", time: "22:40", description: "영화와 독서를 위한 편안한 밝기", meal: "허용", light: "40%" },
  { label: "취침", kicker: "READY TO SLEEP", time: "23:15", description: "콘텐츠를 닫고 주변 빛을 낮춥니다", meal: "미루기", light: "12%" },
  { label: "깊은 수면", kicker: "DEEP SLEEP", time: "01:20", description: "도착 90분 전까지 모든 알림을 멈춥니다", meal: "끔", light: "0%" },
  { label: "기상", kicker: "GOOD MORNING", time: "06:00", description: "새벽빛과 함께 부드럽게 깨웁니다", meal: "아침", light: "18%" }
];

function setSleepStep(index, userInitiated = false) {
  const step = SLEEP_STEPS[index];
  if (!step) return;
  $$("[data-sleep]").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.sleep) === index));
  $("#sleep-kicker").textContent = step.kicker;
  $("#sleep-time").textContent = step.time;
  $("#sleep-label").textContent = step.label;
  $("#sleep-description").textContent = step.description;
  $("#meal-status").textContent = step.meal;
  $("#light-status").textContent = step.light;
  $(".sleep-visual").style.filter = `brightness(${1 - index * .18})`;
  $(".sleep-moon").style.transform = `translate(${index * -7}px, ${index * 5}px) scale(${1 - index * .07})`;
  if (userInitiated) $(".sleep-console").dataset.manual = "true";
}

$$("[data-sleep]").forEach((button) => button.addEventListener("click", () => setSleepStep(Number(button.dataset.sleep), true)));

let featureIndex = 0;
let featureTimer = null;
let featureUserPaused = false;
function setFeature(index, userInitiated = false) {
  featureIndex = index;
  $$("[data-feature-slide]").forEach((slide) => {
    const active = Number(slide.dataset.featureSlide) === index;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  $$("[data-feature]").forEach((button) => {
    const active = Number(button.dataset.feature) === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    const indicator = $("i", button);
    indicator.style.animation = "none";
    void indicator.offsetWidth;
    indicator.style.animation = active && !featureUserPaused ? "featureTimer 4s linear forwards" : "none";
    if (active && featureUserPaused) indicator.style.width = "100%";
  });
  if (userInitiated) {
    featureUserPaused = true;
    clearInterval(featureTimer);
  }
}

function startFeatureCarousel() {
  clearInterval(featureTimer);
  if (reducedMotion || featureUserPaused) return;
  featureTimer = setInterval(() => setFeature((featureIndex + 1) % 5), 4000);
}
$$("[data-feature]").forEach((button) => button.addEventListener("click", () => setFeature(Number(button.dataset.feature), true)));
// 자동 넘김은 섹션이 화면에 들어왔을 때 첫 카드부터 시작하고, 벗어나면 멈춘다
(() => {
  const carousel = $(".feature-carousel");
  if (!carousel) return;
  let started = false;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!started) { started = true; setFeature(0); }
      startFeatureCarousel();
    } else {
      clearInterval(featureTimer);
    }
  }, { threshold: 0.5 }).observe(carousel);
})();


function setupStarfield() {
  const canvas = $("#starfield");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  let stars = [];
  let animationFrame = null;
  let visible = false;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from({ length: Math.min(120, Math.round(rect.width / 9)) }, () => ({
      x: Math.random() * rect.width, y: Math.random() * rect.height, r: Math.random() * 1.2 + .2, phase: Math.random() * Math.PI * 2
    }));
  };
  const draw = (time = 0) => {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    stars.forEach((star) => {
      context.globalAlpha = .18 + (Math.sin(time * .0008 + star.phase) + 1) * .22;
      context.fillStyle = "#e4e4e4";
      context.beginPath(); context.arc(star.x, star.y, star.r, 0, Math.PI * 2); context.fill();
    });
    if (visible && !reducedMotion) animationFrame = requestAnimationFrame(draw);
  };
  resize(); draw();
  addEventListener("resize", resize, { passive: true });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(animationFrame);
    if (visible && !reducedMotion) animationFrame = requestAnimationFrame(draw);
  }, { threshold: .05 }).observe(canvas);
}
setupStarfield();

if (gsapReady && !reducedMotion) {

  gsap.timeline({ scrollTrigger: { trigger: "#prepare", start: "top top", end: "bottom bottom", scrub: 1 } })
    .fromTo(".prepare-rules", { yPercent: 25, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none" }, .5)
    .to(".prepare-copy", { opacity: .2, yPercent: -24, ease: "none" }, .56)
    .to(".dawn-sky", { filter: "brightness(1.22) saturate(.92)", ease: "none" }, .38);
}


const benefitDialog = $(".benefit-dialog");
$$('[data-benefit]').forEach((button) => button.addEventListener("click", () => {
  $("#benefit-dialog-title").textContent = button.dataset.benefit;
  $("#benefit-dialog-copy").textContent = button.dataset.benefitCopy;
  benefitDialog.showModal();
}));
$("[data-close-benefit]")?.addEventListener("click", () => benefitDialog.close());
benefitDialog?.addEventListener("click", (event) => { if (event.target === benefitDialog) benefitDialog.close(); });

// 객실 등급(IFE 목업 · 설명 말풍선)은 js/cabin.js에서

const bookingMessage = $(".booking-message");
$(".flight-search")?.addEventListener("submit", (event) => {
  event.preventDefault();
  bookingMessage.textContent = "선택한 여행지의 항공편을 준비했습니다. 실제 예약 연결 전의 인터랙션 목업입니다.";
});
$("[data-reserve]")?.addEventListener("click", () => { bookingMessage.textContent = "MOMEN 예약 여정이 준비되었습니다."; });
$("[data-preload]")?.addEventListener("click", () => { bookingMessage.textContent = "탑승 전 콘텐츠 보관함이 열렸습니다."; });
$(".phone-screen > button")?.addEventListener("click", (event) => {
  event.currentTarget.textContent = "안내 중 · 시내 방면";
  event.currentTarget.disabled = true;
});



if (gsapReady && !reducedMotion) {
  gsap.timeline({ scrollTrigger: { trigger: "#landing", start: "top top", end: "bottom bottom", scrub: 1 } })
    .to(".landing-copy", { opacity: 0, yPercent: -25, ease: "none" }, 0)
    .to(".landing-flare", { opacity: 1, scale: 3.4, ease: "none" }, .15)
    .to(".landing-frame", { "--landing-fade": 1, ease: "none" }, .3); // 고정이 풀리는 순간 흰색이 끝나도록 짧게

  gsap.fromTo(".quotes figure", { y: 45, opacity: 0 }, { y: 0, opacity: 1, stagger: .14, duration: .8, ease: "power2.out", scrollTrigger: { trigger: ".quotes", start: "top 82%", toggleActions: "play none none reverse" } });
  gsap.fromTo(".benefit-rail article", { y: 42, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .7, ease: "power2.out", scrollTrigger: { trigger: ".benefit-rail", start: "top 82%", toggleActions: "play none none reverse" } });
}
