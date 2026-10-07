/* 객실 등급 섹션 설정 — 카피·스펙과 생성 목업 좌표는 여기에서 관리한다. */
window.CABIN_CONFIG = Object.freeze({
  // 목업 크기: 패널 우측 영역 기준 Economy 60% → Premium 70% → Business 80%
  MAX_WIDTH: 0.8,
  BASE_INCH: 18,

  // 전환 — Apple '보다 자세히 들여다보기' 실측 (docs/closer-look-notes.md)
  MOCK_MS: 600,
  MOCK_EASE: "cubic-bezier(0.34, 1.32, 0.64, 1)",
  FADE_MS: 420,
  CLOSE_MS: 300,
  OPEN_DELAY_MS: 250,

  // screen의 x/y/w/h/radius는 1536×1024 원본 이미지 대비 %.
  // radius는 원본 이미지 너비 대비 비율이며 JS가 화면 레이어 기준 값으로 변환한다.
  CABINS: {
    economy: {
      label: "Economy",
      inch: 13.3,
      title: "필요한 만큼, 온전하게.",
      body: "모든 좌석에서 같은 경험을 이어갑니다.",
      specs: [["디스플레이", "13.3″ 4K"], ["수면 모드", "4단계"], ["도착 연동", "포함"], ["개인 공간", "79cm"]],
      mockup: {
        src: "assets/mockup/economy.webp",
        mobile: "assets/mockup/m/economy.webp",
        size: [1536, 1024],
        screen: { x: 23.763, y: 16.309, w: 52.539, h: 44.922, radius: 0.781 },
      },
    },
    premium: {
      label: "Premium",
      inch: 15.6,
      title: "조금 더 넓게, 조금 더 깊게.",
      body: "더 큰 화면에서 콘텐츠에 몰입합니다.",
      specs: [["디스플레이", "15.6″ 4K"], ["수면 모드", "4단계"], ["도착 연동", "포함"], ["개인 공간", "96cm"]],
      mockup: {
        src: "assets/mockup/premium.webp",
        mobile: "assets/mockup/m/premium.webp",
        size: [1536, 1024],
        screen: { x: 20.052, y: 14.941, w: 59.896, h: 48.340, radius: 0.781 },
      },
    },
    business: {
      label: "Business",
      inch: 18,
      title: "가장 넓은 화면, 가장 조용한 시간.",
      body: "비행 전체가 하나의 스크린이 됩니다.",
      specs: [["디스플레이", "18″ 4K OLED"], ["수면 모드", "4단계"], ["도착 연동", "포함"], ["개인 공간", "약 200cm"]],
      mockup: {
        src: "assets/mockup/business.webp",
        mobile: "assets/mockup/m/business.webp",
        size: [1536, 1024],
        screen: { x: 17.969, y: 13.770, w: 64.258, h: 50.781, radius: 0.781 },
      },
    },
  },
});
