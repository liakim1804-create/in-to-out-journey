/* 인트로 설정 — 실사 에셋이 들어오면 여기 숫자와 경로만 맞추면 된다 */
window.INTRO_CONFIG = Object.freeze({
  BRAND: "MOMEN", // 서비스명. 내비 글자 로고와 [data-brand]에 들어간다

  // 인트로 방식
  // "hero"     — 실사 에셋 전: 마케팅 페이지식 히어로(헤드라인 + 스크롤하면 커지는 활주로 이미지)
  // "sequence" — 실사 에셋 준비 후: 아래 프레임/영상으로 야간 이륙 시퀀스를 스크롤 재생
  INTRO_MODE: "hero", // 히어로 이미지는 index.html의 .intro-hero__frame <picture>에서 바꾼다

  // 이미지 시퀀스 (기본 방식)
  INTRO_FRAME_COUNT: 90,
  FRAME_PATH: (i) => `assets/intro/frame_${String(i).padStart(4, "0")}.webp`,
  FRAME_PATH_MOBILE: (i) => `assets/intro/m/frame_${String(i).padStart(4, "0")}.webp`,
  PRIORITY_FRAMES: 20, // 먼저 받을 프레임 수

  // 영상 방식 (선택) — 시퀀스가 없고 이 파일이 있으면 사용
  // 히어로 모드에서는 정지 이미지 한 장만 사용한다. 존재하지 않는 이전 영상 경로는
  // 남겨두지 않아 불필요한 요청이나 혼동을 만들지 않는다.
  VIDEO_PATH: null,

  // 스크롤 길이 — 인트로가 고정되는 스크롤 거리 (vh)
  INTRO_LENGTH_VH: 260,

  // 장면 구간 (진행도 0–1). 프레임 배분도 이 비율을 따른다
  PHASES: Object.freeze({
    roll: [0, 0.35], // 이륙 활주
    lift: [0.35, 0.55], // 이륙과 머리 위 통과
    window: [0.55, 0.75], // 창문 진입
    cabin: [0.75, 0.9], // 기내 드러남
    copy: [0.9, 1], // 핵심 카피
  }),

  // canvas 크롭 기준점 (0–1). 모바일은 비행기가 하단 중앙에 오도록
  FOCAL: Object.freeze({ desktop: [0.5, 0.6], mobile: [0.5, 0.82] }),
  MOBILE_BREAKPOINT: 768,
  DPR_MAX: 2,
  SMOOTHING: 0.16, // rAF 보간 강도 (0–1, 클수록 즉각적)

  COPY: Object.freeze({
    ko: { invite: "Shall we take off?", copy: "이동의 시간을 나만의 시간으로", skip: "Skip intro" },
    en: { invite: "Shall we take off?", copy: "Make every mile your own time", skip: "Skip intro" },
  }),
});
