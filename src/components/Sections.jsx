import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LINKS } from '../config'

const REQS = [
  { s: 'met', req: 'Manage end-to-end recruitment', ev: 'Managed recruitment for machine operators and staff roles' },
  { s: 'met', req: 'Labour law compliance (EPF, ETF, gratuity)', ev: 'Ensured compliance with the Shop and Office Act, EPF and ETF' },
  { s: 'partial', req: '3+ years of HR experience', ev: 'HR Executive, apparel manufacturing (2024 – present)' },
  { s: 'missing', req: 'CIPM qualification', ev: null, nice: true },
]
const SIGNALS = [
  ['Requirements', 35], ['Skills', 25], ['Meaning match', 15], ['Keyword match', 10], ['Experience', 10], ['Education', 5],
]
const STATS = [
  { v: 0.97, d: 3, label: 'NDCG@5', note: 'best CVs at the top' },
  { v: 1.0, d: 2, label: 'Precision@3', note: 'top 3 all relevant' },
  { v: 0.992, d: 3, label: 'AUC', note: 'relevant vs. not relevant' },
  { v: 100, d: 0, suffix: '%', label: 'Shortlist precision', note: 'every shortlisted CV was a fit' },
]
const MARK = { met: '✓', partial: '~', missing: '✕' }

function Eyebrow({ n, children }) {
  return (
    <div className="eyebrow">
      {n && <span className="eyebrow__n">{n}</span>}
      {children}
    </div>
  )
}

function Split({ children }) {
  // Lines that rise into view (3D perspective) during the intro
  return (
    <span className="line-mask">
      <span data-intro>{children}</span>
    </span>
  )
}

export function Sections({ onExternal, onTry }) {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sticky sections: each card is scrubbed in and out at its own scroll point
      gsap.utils.toArray('[data-stage]').forEach((sec) => {
        const cards = sec.querySelectorAll('[data-in]')
        if (!cards.length) return
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        })
        tl.set({}, {}, 1) // timeline spans 0..1
        cards.forEach((card) => {
          const tIn = parseFloat(card.dataset.in)
          const tOut = card.dataset.out ? parseFloat(card.dataset.out) : null
          tl.fromTo(
            card,
            { autoAlpha: 0, y: 90, rotateX: 18, scale: 0.96 },
            { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 0.12, ease: 'power2.out' },
            tIn
          )
          if (tOut != null) {
            tl.to(card, { autoAlpha: 0, y: -70, rotateX: -12, scale: 0.97, duration: 0.1, ease: 'power2.in' }, tOut)
          }
          card.querySelectorAll('[data-bar]').forEach((bar, i) => {
            tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.12, ease: 'power3.out' }, tIn + 0.04 + i * 0.015)
          })
          card.querySelectorAll('[data-req]').forEach((row, i) => {
            tl.fromTo(row, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.06 }, tIn + 0.05 + i * 0.03)
          })
        })
      })

      // Count-up numbers
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count)
        const dec = parseInt(el.dataset.dec || '0', 10)
        const suffix = el.dataset.suffix || ''
        const obj = { v: 0 }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () =>
            gsap.to(obj, {
              v: end,
              duration: 1.8,
              ease: 'expo.out',
              onUpdate: () => (el.textContent = obj.v.toFixed(dec) + suffix),
            }),
          onLeaveBack: () => {
            obj.v = 0
            el.textContent = (0).toFixed(dec) + suffix
          },
        })
      })

      // Simple rise-in for non-sticky blocks
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 70, rotateX: 14 },
          {
            autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
          }
        )
      })

      // Hero copy drifts away as the camera starts to move
      gsap.to('.hero__inner', {
        yPercent: -30, autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      {/* HERO */}
      <section className="hero" data-stage="hero" id="top">
        <div className="hero__inner">
          <div data-intro-wrap className="line-mask"><span data-intro><Eyebrow>Open-source NLP · Explainable · Blind by default</Eyebrow></span></div>
          <h1 className="display">
            <Split>Read every CV</Split>
            <Split>like your <em>best</em></Split>
            <Split>recruiter would.</Split>
          </h1>
          <div className="line-mask">
            <p data-intro className="lead">
              An AI screening engine that matches CVs to a job description requirement by requirement, and shows the evidence behind every score.
            </p>
          </div>
          <div className="line-mask">
            <div data-intro className="hero__ctas">
              <button className="btn btn--primary" onClick={onTry}>Try it with your CVs <span>→</span></button>
              <button className="btn btn--ghost glass" onClick={() => onExternal(LINKS.github, { newTab: true })}>View source</button>
            </div>
          </div>
        </div>
        <div className="hero__hint">
          <span>Drag to spin · Hover a CV · Click the core</span>
          <i className="scroll-cue" />
        </div>
      </section>

      {/* BLIND SCREENING */}
      <section className="stage stage--scan" data-stage="scan" id="how">
        <div className="sticky">
          <article className="card glass card--left" data-in="0.02" data-out="0.5">
            <Eyebrow n="01">Blind by default</Eyebrow>
            <h2>Personal details vanish before scoring begins.</h2>
            <p>Names, photos, contact details, NIC numbers, age, gender and marital status are masked first. The score can only see skills and experience.</p>
            <div className="chips">
              {['Name', 'Photo', 'Email', 'Phone', 'NIC', 'Age', 'Gender'].map((c) => (
                <span key={c} className="chip chip--redact">{c}</span>
              ))}
            </div>
          </article>
          <article className="card glass card--right" data-in="0.58" data-out="0.93">
            <Eyebrow n="02">Structure, not text</Eyebrow>
            <h2>Every CV becomes evidence.</h2>
            <p>Each CV is split into sections and sentences. Years of experience come from real date ranges, with overlapping jobs merged. Education level is read, not guessed.</p>
          </article>
        </div>
      </section>

      {/* EMBEDDINGS */}
      <section className="stage stage--embed" data-stage="embed">
        <div className="sticky">
          <article className="card glass card--left" data-in="0.06" data-out="0.9">
            <Eyebrow n="03">Meaning, not keywords</Eyebrow>
            <h2>Every sentence becomes a point in 384-dimensional space.</h2>
            <p>
              A sentence-embedding model (<code>all-MiniLM-L6-v2</code>) places similar ideas close together. <q>Talent acquisition</q> lands next to <q>recruitment</q>, though they share no words.
            </p>
            <div className="note"><span className="dot dot--mint" /> The job description (bright star) links to its nearest CVs</div>
          </article>
        </div>
      </section>

      {/* RANKING + EXPLAINABILITY */}
      <section className="stage stage--rank" data-stage="rank" id="explain">
        <div className="sticky">
          <article className="card glass card--left card--wide" data-in="0.04" data-out="0.94">
            <Eyebrow n="04">Ranked, with reasons</Eyebrow>
            <h2>A fit score you can defend.</h2>
            <div className="reqs">
              <div className="reqs__head">Requirement checklist · <b>Candidate C04</b> <span className="badge badge--shortlist">Shortlist · 82</span></div>
              {REQS.map((r) => (
                <div key={r.req} className={`req req--${r.s}`} data-req>
                  <span className="req__mark">{MARK[r.s]}</span>
                  <div>
                    <div className="req__text">{r.req}{r.nice && <em> nice-to-have</em>}</div>
                    {r.ev && <div className="req__ev">“{r.ev}”</div>}
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="card glass card--right card--narrow" data-in="0.3" data-out="0.94">
            <Eyebrow>Six signals</Eyebrow>
            {SIGNALS.map(([k, w]) => (
              <div key={k} className="signal">
                <div className="signal__row"><span>{k}</span><b>{w}%</b></div>
                <div className="signal__track"><i data-bar style={{ width: `${w / 35 * 100}%` }} /></div>
              </div>
            ))}
          </article>
        </div>
      </section>

      {/* RESULTS */}
      <section className="stage stage--results" data-stage="results" id="results">
        <div className="results">
          <div data-reveal>
            <Eyebrow n="05">Measured, not claimed</Eyebrow>
            <h2 className="h2-xl">Tested on 80 labelled CV–job pairs.</h2>
          </div>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat glass" key={s.label} data-reveal>
                <div className="stat__v" data-count={s.v} data-dec={s.d} data-suffix={s.suffix || ''}>0</div>
                <div className="stat__l">{s.label}</div>
                <div className="stat__n">{s.note}</div>
              </div>
            ))}
          </div>
          <p className="fine" data-reveal>
            vs. the previous keyword hybrid: NDCG@5 0.954 → 0.970, AUC 0.980 → 0.992. Includes hard cases: a keyword-stuffed CV, synonym-only CVs and an overqualified manager. A small, self-built test set: a sanity check, not a guarantee.
          </p>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="stage stage--privacy" data-stage="privacy" id="privacy">
        <div className="privacy">
          <div data-reveal>
            <Eyebrow n="06">Responsible by design</Eyebrow>
            <h2 className="h2-xl">Built for fair hiring.</h2>
          </div>
          <div className="pillars">
            {[
              ['A person decides', 'The tool ranks and explains. Every hiring decision stays with a human reviewer.'],
              ['Nothing is stored', 'CVs are read in memory and the model runs locally. Candidate data never leaves the machine.'],
              ['Bias-aware', 'Blind screening, candidate codes for panels, and flags for gaps. Follows data-protection law such as Sri Lanka’s PDPA.'],
            ].map(([t, d], i) => (
              <div className="pillar glass" key={t} data-reveal>
                <span className="pillar__n">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="stage stage--cta" data-stage="cta">
        <div className="cta">
          <h2 className="display display--cta" data-reveal>Screen your CVs<br />right here.</h2>
          <p className="lead cta__lead" data-reveal>Paste a job description, drop in CVs, get a ranked shortlist with evidence. It all runs in your browser, so no CV is ever uploaded.</p>
          <div className="hero__ctas" data-reveal>
            <button className="btn btn--primary" onClick={onTry}>Try it now <span>→</span></button>
            <button className="btn btn--ghost glass" onClick={() => onExternal(LINKS.demo, { newTab: true })}>Python app</button>
            <button className="btn btn--ghost glass" onClick={() => onExternal(LINKS.github, { newTab: true })}>GitHub</button>
            <button className="btn btn--ghost glass" onClick={() => onExternal(LINKS.linkedin, { newTab: true })}>LinkedIn</button>
          </div>
          <div className="stack" data-reveal>
            {['Python', 'scikit-learn', 'Sentence embeddings', 'fastembed', 'Streamlit', 'Three.js', 'React Three Fiber', 'GSAP'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <footer className="footer glass">
          <div>
            <b>Thivanka Chathuranga</b>
            <span>BSc (Hons) Data Science</span>
          </div>
          <span>© 2026 Thivanka Chathuranga · MIT licence</span>
        </footer>
      </section>
    </div>
  )
}
