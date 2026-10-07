# Asset credits

No third-party stock assets are used in the deployed page.

All source photographs were created with the Codex built-in image generation tool for this project on 2026-10-06. The 90-frame desktop and mobile intro sequences are derived from generated source frames. The additional BOARD, ENJOY, REST, PREPARE and LANDING scenes are original generated photographs with no directly visible people. The only external resources loaded at runtime are the Inter/Archivo/Pretendard web fonts and the GSAP, ScrollTrigger and Lenis libraries from their public CDNs.

`scenes/landing-airport.webp` and `scenes/landing-airport-m.webp` are also original images generated with the Codex built-in image generation tool for this project. They replace the prior Paris image behind the IN TO OUT landing copy and contain no people, branding, readable signage or third-party source pixels.

The `assets/message/` IN and OUT photographs were also generated with the Codex built-in image generation tool. Two user-supplied aircraft-at-twilight screenshots were used only as color and exposure references; no pixels from those references are shipped in the site.

## IFE seatback monitor (cabin section)

`ife/seatback-monitor.webp` (+ `.png`) is cut out of `scenes/cabin.webp` — the photorealistic cabin frame generated earlier for this project (see above). The seatback shell and monitor bezel were masked to transparency outside the seat outline, the screen area was cut out as a transparent hole (filled by CSS with a blank cool-gray screen), and the lower edge fades out. No external stock was used.

## Cabin-class shell mockups

`mockup/economy.webp`, `mockup/premium.webp` and `mockup/business.webp` plus their mobile variants were newly generated with the Codex built-in ImageGen tool. The user-provided KrisWorld screenshot was used only as a structural reference for the seatback-shell / monitor / tray-latch relationship; no logo, UI, text, airline-specific design or source pixels are included in the shipped assets. All six WebP files retain generated transparency.

## Flight map

`map/globe-day.jpg` is an orthographic globe rendered from NASA's "Blue Marble" cloud-and-land composite (Land_ocean_ice_cloud_hires.jpg, NASA Earth Observatory / Reto Stöckli, public domain, via Wikimedia Commons) on a generated starfield. Lighting, atmosphere glow and the projection were produced locally for this project.
