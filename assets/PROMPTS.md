# Generation prompts

Every prompt included: `photorealistic, cinematic, cool blue-black night tone, no brown or sepia cast, subtle film grain, 16:9`.

## Runway

Low, centered view down a wet airport runway at night; a clean unbranded white wide-body aircraft faces the camera with landing lights on; control tower, hangars, mountain silhouette, clouds and faint stars; runway centerline leading to the aircraft; warm color only in actual lights; no logos, text, people, watermark, illustration or orange wash.

## Overhead pass

Unbranded white passenger aircraft lifting off directly over the camera at night; symmetrical underbody, retracting landing gear, tiny navigation lights and runway streaks below; dramatic but physically plausible aviation photography; no logo, text, people or fantasy aircraft.

## Window approach

Exterior close view of an unbranded passenger fuselage at night; softly lit cabin windows recede diagonally; one centered window is brighter and suitable for a camera push-in; cold navy metal, warm light only inside the windows; no text or whole-image amber overlay.

## Cabin and seat screen

Passenger window-seat view inside a premium economy cabin at night; real seatback monitor on the center-right with a clean dark-blue blank screen for UI compositing; aircraft window on the left with midnight clouds; realistic materials, no people, text or airline branding.

## Dawn window

Real passenger-aircraft window during blue hour before sunrise; high-altitude clouds, pale blue-gray horizon and faint wing edge; open sky for copy; cool navy-to-blue-gray light, no orange sunrise, text or heavy HDR.

## Paris and phone

Early blue-hour Paris street near the Seine with Eiffel Tower in the distance; an anatomically correct hand holds a modern unbranded phone with a clean blank screen in the lower-right quarter; calm, cool natural light; no readable signs, crowds, logos, text, watermark or distorted fingers.

## IFE seatback monitor

No new generation. Derived from the "Cabin and seat screen" image above (seatback monitor on the center-right, clean dark-blue blank screen), cropped to the seat shell with the screen cut out. Tone check: cool blue-black, no brown cast.

## Neutral-warm scene transitions

Five additional full-bleed photographs were created for BOARD, ENJOY, REST, PREPARE and LANDING. The visual rule is neutral charcoal, graphite and deep navy with only faint champagne warmth in real practical lights, reflections, the horizon and city lights; interface typography and controls stay neutral. All cabin frames are completely empty: no people, faces, hands or silhouettes.

- BOARD: empty long-haul cabin before boarding, subdued warm-gray ceiling and aisle lights against deep navy windows.
- ENJOY: empty seat and softly glowing seatback screen, headphones resting on the armrest.
- REST: empty reclined seat prepared with a pillow and dark blanket beside night windows.
- PREPARE: aircraft wing above layered clouds with a narrow muted peach-gray predawn horizon.
- LANDING: aerial Paris blue hour with restrained warm-white city lights along the Seine.

## Airport arrival scene

`scenes/landing-airport.webp` and its mobile crop `scenes/landing-airport-m.webp` are a generated airport-apron scene for the IN TO OUT landing copy. The image shows an empty modern terminal façade and restrained gate/apron depth at blue hour, with dark uncluttered space on the left for Korean headline copy. It uses charcoal, slate-blue and only faint practical warm lights; no people, readable signage, airline marks, logos or text. Avoid dramatic lighting, orange washes and dense airport activity.

## IN TO OUT JOURNEY message section

Two 3:2 photographs were generated with the Codex built-in image generation tool, then given a second lighting pass using the supplied aircraft-at-twilight references as mood and color references only. Both final frames use the same 45% horizon height and low-saturation blue-gray / warm-gray grading. They contain no text, logos or people.

- `message/in.webp`: first-person window-seat cabin at quiet twilight, oval window and switched-off monitor, lighter charcoal interior, calm right blend edge.
- `message/out.webp`: Paris rooftops at airy blue-hour dawn, distant Eiffel Tower and Seine, calm left blend edge.

Final grading instruction: preserve scene geometry and horizon; lift exposure and shadow detail; use clean slate blue, graphite, warm gray and a thin muted coral-gray horizon; avoid emphasized light, saturated cobalt, orange/yellow wash, brown, sepia and HDR.

## Cabin-class seatback shell mockups

Built-in ImageGen was used in transparent-background mode. Economy was generated as the master; Premium and Business were precise-object edits of the preceding member so camera height, orthographic front view, 3:2 framing and cool studio light stay consistent.

- Economy: compact cool-light-gray matte seatback shell surrounding a 13.3-inch landscape display; thin dark bezel, USB detail and centered tray latch; blank `#2A2E36` screen; transparent background; no shadow, UI, text, logo, brand, people or warm cast.
- Premium: preserve the Economy camera, light and design language; enlarge the display to 15.6 inches, widen the shell, slim the bezel and refine the neutral-metal latch; keep the blank screen and transparent background.
- Business: preserve the Premium camera, light and design language; enlarge the display to 18 inches, use the widest soft-satin cool-light-gray shell, very thin bezel and a minimal neutral-metal lower accent; keep the blank screen and transparent background.

Shared negative instruction: no brown, beige, cream, yellow or amber cast; no floor or baked shadow; no white cutout halo; no glossy AI-smooth plastic; no perspective or lighting change between classes.
