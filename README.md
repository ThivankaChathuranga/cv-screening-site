# CV Screening with NLP: 3D showcase website

An interactive WebGL showcase for the [CV Screening with NLP](https://github.com/YOUR-USERNAME/cv-screening-nlp) project. Scrolling tells the story of how the engine works, entirely in real-time 3D:

| Section | 3D scene |
|---|---|
| Hero | A glass AI core (real light transmission, chromatic aberration) with a noise-animated neural core and orbiting rings. 10 CV documents orbit it, and particles stream into the core. Hover a CV to see its score, click to spin it, click the core for a pulse, drag to spin the orbit. |
| 01 Blind by default | The CVs line up and a scanning beam sweeps across them, redacting names, photos and contact details. |
| 02–03 Embeddings | The CVs are pulled into the core. The camera flies into a 2,600-point embedding cloud that organises itself into job-family clusters, with the job description linked to its nearest matches. |
| 04 Ranked, with reasons | Glass towers rise from a reflective floor in score order, with neon edges coloured by decision band and real-time shadows. |
| 05–06 Results & privacy | Animated metrics, and the masked CVs return to orbit the core "shield". |
| CTA | A high overview shot of the whole journey. |

## Try it: the screening app inside the site

The **Try it** buttons open a full-screen app that screens real CVs:

1. **Describe the position:** type a title and paste or upload the job description (PDF / Word / TXT). The tool detects the requirements, must-have and nice-to-have skills, minimum years and education, and you can edit all of them.
2. **Add the CVs:** drag and drop any number of PDF, Word (.docx) or TXT files.
3. **Screen:** each CV gets a 0–100 fit score, a Shortlist / Review / Reject band, a score breakdown, flags (e.g. *skills listed without work evidence*), and a requirement checklist that quotes the CV sentence supporting each requirement. Results export to CSV.

There are also four built-in sample jobs with 20 fictional CVs, plus blind screening and candidate codes.

**Everything runs in the visitor's browser.** Files are read locally (pdf.js, mammoth), and the scoring engine is a JavaScript port of the Python project running in a Web Worker. The language model (`all-MiniLM-L6-v2`, ~23 MB, quantised) runs with transformers.js / WebAssembly. It downloads once from Hugging Face and is then cached by the browser. If it can't load, the app automatically uses keyword mode. **No CV ever leaves the computer.**

Accuracy of the JavaScript engine on the 80 labelled CV–job pairs, in keyword mode (`node scripts/evaluate.mjs`): **NDCG@5 0.957 · P@3 1.00 · MRR 1.00 · AUC 0.988 · 100% shortlist precision**. The Python version scores 0.970 / 1.00 / 1.00 / 0.992 on the same set. The model mode should score higher.

## Tech

- **Three.js + React Three Fiber + Drei:** `MeshTransmissionMaterial`, `MeshReflectorMaterial`, `ContactShadows`, procedural `Environment` with `Lightformer`s (no HDR downloads), `Sparkles`, `Html`, `Line`, `Edges`
- **Custom GLSL shaders:** simplex-noise core, GPU particle stream on Bézier paths, embedding cloud that morphs from random positions into clusters
- **@react-three/postprocessing:** bloom (mipmap), vignette, film grain, ACES tone mapping
- **GSAP ScrollTrigger + Lenis:** smooth scrolling, scrubbed sticky sections, count-up stats, preloader and curtain transitions
- **Screening engine (src/engine):** PII masking, section and date-range parsing, JD parser, TF-IDF identical to scikit-learn's, sentence embeddings, requirement-evidence matching, calibrated scores
- **Cinematic camera:** Catmull-Rom spline through one shot per section, damped, with pointer parallax and portrait-screen framing

### Performance

- `PerformanceMonitor` drops to a lighter quality tier automatically: no transmission or reflector, fewer particles, lower pixel ratio.
- Off-screen stages are hidden, and phones get fewer objects.
- All particle motion runs on the GPU.
- Respects `prefers-reduced-motion`.
- Fonts are bundled, so no external requests.

## Put it online (free, no coding)

The ready-to-host site is in the **`dist`** folder.

1. Edit **`dist/links.json`** with your real links (live demo, GitHub, LinkedIn).
2. Go to **https://app.netlify.com/drop** and drag the `dist` folder onto the page.
3. You get a live URL in seconds. Sign in to keep it and to rename it (e.g. `thivanka-cv-screening.netlify.app`).

Vercel and GitHub Pages also work. The build uses relative paths, so `dist` can be hosted from any folder. The `dist` folder is about 31 MB because it includes the WebAssembly runtime for the language model. Visitors only download that file when they use the AI model.

## Develop locally

Requires [Node.js 20+](https://nodejs.org).

```bash
npm install                     # .npmrc skips native install scripts (not needed in the browser)
npm run dev                     # http://localhost:5173
npm run build                   # outputs dist/
node scripts/evaluate.mjs       # accuracy of the JS engine on the labelled samples
```

Links can also be changed in `public/links.json` before building. Colours live in `src/config.js` and `src/styles.css`.

## Structure

```
src/
├── App.jsx                 Canvas, pointer/drag, intro sequence
├── state.js                Shared scroll/pointer state read by the 3D scene
├── useSmoothScroll.js      Lenis + GSAP ScrollTrigger
├── app/                    Screening app UI, file readers, worker hook
├── engine/                 Screening engine (JS port of the Python package) + worker
├── sample/                 4 sample JDs, 20 fictional CVs, labels
├── components/             Sections, Nav, Preloader, Curtain (DOM layer)
└── three/                  Experience, CameraRig, AICore, Documents,
                            DataStream, EmbeddingSpace, RankingTowers, shaders
```

All candidates shown are fictional. © 2026 Thivanka Chathuranga, MIT licence.
