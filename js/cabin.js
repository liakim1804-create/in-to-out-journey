/* 객실 등급 — 생성한 좌석 등받이 쉘을 스케일·크로스페이드하고,
   설명 말풍선은 Apple '보다 자세히 들여다보기'처럼 닫혔다 펼쳐진다. */
(function () {
  "use strict";
  const C = window.CABIN_CONFIG;
  const root = document.querySelector("[data-ife]");
  if (!C || !root) return;

  const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const tabs = [...root.querySelectorAll("[data-cabin]")];
  const mock = root.querySelector("[data-ife-mock]");
  const wrap = root.querySelector("[data-ife-wrap]");
  const bubble = root.querySelector("[data-ife-bubble]");
  const inner = root.querySelector("[data-ife-inner]");

  const makeLayer = () => {
    const layer = document.createElement("div");
    layer.className = "ife-mock__layer";
    layer.innerHTML = `<picture class="ife-mock__picture"><source media="(max-width: 734px)"><img class="ife-mock__frame" alt="" draggable="false" decoding="async"></picture><div class="ife-mock__screen"></div>`;
    mock.appendChild(layer);
    return layer;
  };
  const layers = [makeLayer(), makeLayer()];
  let activeLayer = 0;
  let mockRequest = 0;

  const setLayer = (layer, cabin) => {
    const { src, mobile, screen } = cabin.mockup;
    const image = layer.querySelector("img");
    layer.querySelector("source").srcset = mobile;
    image.src = src;
    layer.style.setProperty("--scr-l", `${screen.x}%`);
    layer.style.setProperty("--scr-t", `${screen.y}%`);
    layer.style.setProperty("--scr-w", `${screen.w}%`);
    layer.style.setProperty("--scr-h", `${screen.h}%`);
    layer.style.setProperty("--scr-radius", `${(screen.radius / screen.w) * 100}%`);
    return image;
  };

  const firstCabin = Object.values(C.CABINS)[0];
  // 비활성 레이어도 실제 이미지를 미리 갖게 해, 빠른 탭 전환 중 빈 이미지를
  // 잠깐 그리는 일을 막는다.
  setLayer(layers[1], firstCabin);
  const waitForImage = (image) => {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => resolve();
      image.addEventListener("load", done, { once: true });
      image.addEventListener("error", done, { once: true });
    });
  };

  mock.style.setProperty("--frame-ratio", `${firstCabin.mockup.size[0]} / ${firstCabin.mockup.size[1]}`);
  root.style.setProperty("--mock-max", String(C.MAX_WIDTH));
  root.style.setProperty("--mock-ms", `${C.MOCK_MS}ms`);
  root.style.setProperty("--mock-fade-ms", `${C.FADE_MS}ms`);
  root.style.setProperty("--mock-ease", C.MOCK_EASE);

  // 등급 전환 시 디코딩 대기로 빈 화면이 생기지 않도록 6개 자산을 미리 가져온다.
  Object.values(C.CABINS).forEach(({ mockup }) => {
    [mockup.src, mockup.mobile].forEach((src) => { const image = new Image(); image.src = src; });
  });

  const html = (c) => `<p class="ife-bubble__text"><strong>${c.title}</strong> ${c.body}</p>
    <dl class="ife-bubble__specs">${c.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;

  // 가장 긴 내용을 기준으로 감싸는 영역을 고정해 목업과 다음 섹션이 흔들리지 않게 한다.
  const measure = (key) => {
    const probe = inner.cloneNode(false);
    probe.className = "ife-bubble__inner is-probe";
    probe.innerHTML = html(C.CABINS[key]);
    bubble.appendChild(probe);
    const height = probe.offsetHeight;
    probe.remove();
    return height;
  };
  const fitWrap = () => { wrap.style.height = `${Math.max(...Object.keys(C.CABINS).map(measure))}px`; };

  const transitionMock = async (c, first) => {
    const request = ++mockRequest;
    mock.style.setProperty("--mock-scale", String(c.inch / C.BASE_INCH));
    mock.dataset.cabin = c.label.toLowerCase();
    if (first) {
      setLayer(layers[activeLayer], c);
      layers[activeLayer].classList.add("is-current");
      return;
    }
    const nextIndex = 1 - activeLayer;
    const previous = layers[activeLayer];
    const next = layers[nextIndex];
    next.classList.remove("is-current");
    const image = setLayer(next, c);
    await waitForImage(image);
    if (request !== mockRequest) return;
    void next.offsetWidth;
    previous.classList.remove("is-current");
    next.classList.add("is-current");
    activeLayer = nextIndex;
  };

  let current = null;
  let timer = 0;
  const select = (key, { focus = false } = {}) => {
    if (key === current || !C.CABINS[key]) return;
    const first = current === null;
    current = key;
    const c = C.CABINS[key];
    tabs.forEach((tab) => {
      const on = tab.dataset.cabin === key;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });
    bubble.setAttribute("aria-labelledby", `cabin-tab-${key}`);
    transitionMock(c, first);

    clearTimeout(timer);
    if (first || reduceQuery.matches) {
      inner.innerHTML = html(c);
      bubble.style.height = `${inner.offsetHeight}px`;
      if (!first) { inner.classList.remove("is-in"); void inner.offsetWidth; }
      inner.classList.add("is-in");
      return;
    }

    inner.classList.remove("is-in");
    bubble.style.height = `${bubble.offsetHeight}px`;
    void bubble.offsetHeight;
    bubble.classList.add("is-closing");
    bubble.style.height = "56px";
    timer = setTimeout(() => {
      inner.innerHTML = html(c);
      bubble.classList.remove("is-closing");
      requestAnimationFrame(() => {
        bubble.style.height = `${inner.offsetHeight}px`;
        inner.classList.add("is-in");
      });
    }, C.CLOSE_MS);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab.dataset.cabin));
    tab.addEventListener("keydown", (event) => {
      const key = event.key;
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) return;
      event.preventDefault();
      const next = key === "Home" ? 0 : key === "End" ? tabs.length - 1 : (index + (key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[next].dataset.cabin, { focus: true });
    });
  });

  if (window.ResizeObserver) {
    new ResizeObserver(() => {
      if (current && !bubble.classList.contains("is-closing")) bubble.style.height = `${inner.offsetHeight}px`;
    }).observe(inner);
  }
  bubble.addEventListener("transitionend", (event) => {
    if (event.propertyName === "height" && current && !bubble.classList.contains("is-closing")) bubble.style.height = `${inner.offsetHeight}px`;
  });
  const relayout = () => {
    fitWrap();
    if (current) bubble.style.height = `${inner.offsetHeight}px`;
  };
  addEventListener("resize", relayout);
  select("economy");
  relayout();
  document.fonts?.ready.then(relayout);
})();
