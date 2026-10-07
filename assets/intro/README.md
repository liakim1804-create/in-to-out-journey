# Intro sequence

`frame_0001.webp`–`frame_0090.webp` are the desktop 1920×1080 sequence. The matching `m/` set is 960×540 for mobile. Frames are WebP quality 80 and are loaded progressively: frame 1 first, frames 2–20 next, then the rest coarse-to-fine.

| Frames | Progress | Scene |
|---|---:|---|
| 0001–0032 | 0–35% | Night runway, frontal aircraft, increasing push-in |
| 0033–0050 | 35–55% | Lift-off and underbody pass |
| 0051–0068 | 55–75% | Exterior fuselage and window approach |
| 0069–0081 | 75–90% | Dark cabin and seat display |
| 0082–0090 | 90–100% | Cabin hold for the DOM headline |

The images were generated with the built-in image generator, then color-matched to cool black, navy and blue-gray. Warm color is retained only in physical landing, cabin and window lights. Prompts are recorded in `../PROMPTS.md`.

`js/intro-config.js` contains the frame count, paths, preload count, scroll length, timing bands, crop focal points and brand constant.

If a replacement `intro.mp4` is supplied, `scripts/extract-frames.sh` can rebuild both frame sets when ffmpeg is available. The image sequence takes priority over video.
