// 정적 버전 인터랙션: 스크롤 등장 · IN/OUT 캐러셀 · 색상 복사
(() => {
  document.documentElement.classList.add("js");

  // 스크롤 등장
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

  // IN / OUT 캐러셀
  const root = document.getElementById("modes");
  if (root) {
    const slides = window.__SLIDES__;
    const viewport = root.querySelector(".mode__viewport");
    const track = root.querySelector(".mode__track");
    const figs = [...root.querySelectorAll(".mode__slide")];
    const dots = [...root.querySelectorAll(".mode__dots button")];
    const text = root.querySelector(".mode__text");
    let index = 0, start = null, drag = 0, moved = false;

    const render = () => {
      track.style.setProperty("--i", index);
      track.style.setProperty("--drag", drag + "px");
      viewport.classList.toggle("is-dragging", drag !== 0);
      figs.forEach((f, i) => { f.classList.toggle("is-active", i === index); f.setAttribute("aria-hidden", String(i !== index)); });
      dots.forEach((d, i) => { d.classList.toggle("is-active", i === index); d.setAttribute("aria-selected", String(i === index)); });
    };
    const go = (next) => {
      next = Math.max(0, Math.min(slides.length - 1, next));
      if (next !== index) {
        index = next;
        const s = slides[index];
        text.innerHTML = `<div class="mode__swap"><p class="caption caption--light">${s.group}</p><h2 class="display display--regular">${s.title}</h2><p class="body mode__body">${s.body}</p></div>`;
      }
      render();
    };

    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    figs.forEach((f, i) => f.addEventListener("click", () => { if (!moved) go(i); }));
    viewport.addEventListener("pointerdown", (e) => { start = e.clientX; moved = false; viewport.setPointerCapture(e.pointerId); });
    viewport.addEventListener("pointermove", (e) => {
      if (start === null) return;
      const dx = e.clientX - start;
      if (Math.abs(dx) > 4) moved = true;
      const atEdge = (index === 0 && dx > 0) || (index === slides.length - 1 && dx < 0);
      drag = atEdge ? dx / 3 : dx;
      render();
    });
    const end = () => {
      if (start === null) return;
      const d = drag; start = null; drag = 0;
      if (d <= -60) go(index + 1); else if (d >= 60) go(index - 1); else render();
    };
    viewport.addEventListener("pointerup", end);
    viewport.addEventListener("pointercancel", end);
    viewport.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(index + 1); if (e.key === "ArrowLeft") go(index - 1); });
  }

  // 색상 카드 클릭 → HEX 복사
  document.querySelectorAll(".guide__colors button").forEach((btn) => {
    const label = btn.querySelectorAll("span")[1];
    const hex = label.textContent;
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(hex); label.textContent = "COPIED"; setTimeout(() => (label.textContent = hex), 1400); } catch {}
    });
  });
})();
