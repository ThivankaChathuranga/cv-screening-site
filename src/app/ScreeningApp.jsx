import { useEffect, useMemo, useRef, useState } from 'react'
import { analyseJob, EDU_NAMES } from '../engine/screen.js'
import { SKILL_TAXONOMY } from '../engine/skills.js'
import { readFile, ACCEPT } from './readFile'
import { useScreener } from './useScreener'
import './app.css'

const SAMPLES = import.meta.glob('../sample/*.txt', { query: '?raw', import: 'default', eager: true })
const sample = (name) => SAMPLES[`../sample/${name}.txt`]
const SAMPLE_JOBS = {
  hr_executive: 'HR Executive',
  data_analyst: 'Data Analyst',
  process_engineer: 'Process Engineer',
  quality_engineer: 'Quality Engineer',
}
const BAND_ICON = { Shortlist: '✓', Review: '!', Reject: '✕' }
const STATUS = { met: ['✓', 'Met'], partial: ['~', 'Partial'], missing: ['✕', 'Missing'] }
const COMPONENTS = [
  ['requirements', 'Requirements', 35], ['skills', 'Skills', 25], ['semantic', 'Meaning match', 15],
  ['keywords', 'Keyword match', 10], ['experience', 'Experience', 10], ['education', 'Education', 5],
]
const prettyName = (s) => {
  const n = s.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  return n.charAt(0).toUpperCase() + n.slice(1)
}

function Ring({ value, band, size = 64 }) {
  const color = { Shortlist: 'var(--mint)', Review: 'var(--amber)', Reject: 'var(--coral)' }[band]
  return (
    <div className="ring" style={{ '--size': `${size}px`, '--deg': `${value * 3.6}deg`, '--c': color }}>
      <div><b>{Math.round(value)}</b></div>
    </div>
  )
}

function Chips({ items, kind, onRemove }) {
  if (!items?.length) return <span className="muted">None</span>
  return (
    <div className="chips">
      {items.map((s) => (
        <span key={s} className={`chip chip--${kind}`}>
          {s}
          {onRemove && <button aria-label={`Remove ${s}`} onClick={() => onRemove(s)}>×</button>}
        </span>
      ))}
    </div>
  )
}

function SkillEditor({ label, skills, setSkills, kind }) {
  const [value, setValue] = useState('')
  const add = () => {
    const v = value.trim().toLowerCase()
    if (v && !skills.includes(v)) setSkills([...skills, v])
    setValue('')
  }
  return (
    <div className="field">
      <label>{label}</label>
      <Chips items={skills} kind={kind} onRemove={(s) => setSkills(skills.filter((x) => x !== s))} />
      <div className="add-skill">
        <input
          list="skill-list"
          value={value}
          placeholder="Add a skill…"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <button className="mini" onClick={add} disabled={!value.trim()}>Add</button>
      </div>
    </div>
  )
}

export function ScreeningApp({ open, onClose }) {
  const root = useRef()
  const fileInput = useRef()
  const jdInput = useRef()
  const { run, progress } = useScreener()

  const [title, setTitle] = useState('')
  const [jd, setJd] = useState('')
  const [must, setMust] = useState([])
  const [nice, setNice] = useState([])
  const [minYears, setMinYears] = useState(0)
  const [minEdu, setMinEdu] = useState(0)
  const [cvs, setCvs] = useState([]) // {id, name, text, words, error}
  const [dragging, setDragging] = useState(false)
  const [blind, setBlind] = useState(true)
  const [codes, setCodes] = useState(false)
  const [useModel, setUseModel] = useState(true)
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [showReqs, setShowReqs] = useState(false)

  // Re-analyse the JD as it changes and pre-fill the editable job settings
  const job = useMemo(() => (jd.trim() ? analyseJob(jd) : null), [jd])
  useEffect(() => {
    if (!job) return
    setMust([...job.mustSkills].sort())
    setNice([...job.niceSkills].sort())
    setMinYears(job.requiredYears || 0)
    setMinEdu(job.requiredEducation || 0)
  }, [job])

  // Escape closes the app
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const addFiles = async (files) => {
    const list = [...files].filter((f) => /\.(pdf|docx|txt)$/i.test(f.name))
    const read = await Promise.all(
      list.map(async (f) => {
        try {
          const text = await readFile(f)
          const words = text.split(/\s+/).filter(Boolean).length
          return { id: `${f.name}-${f.size}`, name: prettyName(f.name), text, words, error: words < 30 ? 'No readable text (scanned image?)' : '' }
        } catch {
          return { id: `${f.name}-${f.size}`, name: prettyName(f.name), text: '', words: 0, error: 'Could not read this file' }
        }
      })
    )
    setCvs((prev) => {
      const seen = new Set(prev.map((c) => c.id))
      return [...prev, ...read.filter((c) => !seen.has(c.id))]
    })
    setResult(null)
  }

  const loadSample = (key = 'hr_executive') => {
    setTitle(SAMPLE_JOBS[key])
    setJd(sample(key))
    const files = Object.keys(SAMPLES).filter((k) => /\/cv\d+_/.test(k)).sort()
    setCvs(
      files.map((k) => {
        const text = SAMPLES[k]
        const file = k.split('/').pop()
        return { id: file, name: prettyName(file.replace(/^cv\d+_/, '')), text, words: text.split(/\s+/).length, error: '' }
      })
    )
    setResult(null)
    setSelected(null)
  }

  const readyCvs = cvs.filter((c) => !c.error)
  const canRun = job && readyCvs.length && !progress

  const start = async () => {
    setError('')
    setSelected(null)
    try {
      const res = await run({
        jdText: jd,
        title,
        cvs: readyCvs.map((c) => ({ id: c.id, name: c.name, text: c.text })),
        overrides: { mustSkills: must, niceSkills: nice, requiredYears: minYears, requiredEducation: minEdu },
        blind,
        useModel,
      })
      res.rows.forEach((r, i) => (r.code = `C${String(i + 1).padStart(2, '0')}`))
      setResult(res)
      root.current?.querySelector('.app__results')?.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e.message)
    }
  }

  const exportCsv = () => {
    const head = ['Rank', 'Candidate', 'Fit score', 'Decision', 'Requirements met', 'Years', 'Education', 'Must-haves found', 'Must-haves missing', 'Flags']
    const lines = result.rows.map((r) =>
      [r.rank, codes ? r.code : r.name, r.fit, r.band, r.reqMet, r.years ?? '', r.education, r.mustMatched.join('; '), r.mustMissing.join('; '), r.flags.join('; ')]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `cv-ranking-${(title || 'position').replace(/\W+/g, '-').toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const label = (r) => (codes ? r.code : r.name)
  const counts = result ? Object.fromEntries(['Shortlist', 'Review', 'Reject'].map((b) => [b, result.rows.filter((r) => r.band === b).length])) : null
  const sel = result && selected ? result.rows.find((r) => r.id === selected) : null
  const det = sel ? result.details[sel.id] : null

  return (
    <div className={`app ${open ? 'is-open' : ''}`} ref={root} aria-hidden={!open} data-lenis-prevent>
      <datalist id="skill-list">{Object.keys(SKILL_TAXONOMY).map((s) => <option key={s} value={s} />)}</datalist>
      <header className="app__bar">
        <div className="app__title">
          <span className="app__logo">cv<span>/</span>nlp</span>
          <span className="app__sep" />
          Screen CVs
        </div>
        <div className="app__bar-right">
          <span className="pill"><i className="dot dot--mint" /> Runs in your browser · nothing is uploaded</span>
          <button className="app__close" onClick={onClose} aria-label="Close">×</button>
        </div>
      </header>

      <div className="app__body">
        {/* ---------------- Inputs ---------------- */}
        <section className="app__inputs">
          <div className="panel">
            <div className="panel__head">
              <span className="step">1</span>
              <h3>Describe the position</h3>
              <div className="sample-menu">
                <span className="muted">Try a sample:</span>
                {Object.entries(SAMPLE_JOBS).map(([k, v]) => (
                  <button key={k} className="mini mini--ghost" onClick={() => loadSample(k)}>{v}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Position title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. HR Executive" />
            </div>
            <div className="field">
              <div className="field__row">
                <label>Job description</label>
                <button className="mini mini--ghost" onClick={() => jdInput.current.click()}>Upload JD file</button>
                <input
                  ref={jdInput}
                  type="file"
                  accept={ACCEPT}
                  hidden
                  onChange={async (e) => {
                    const f = e.target.files[0]
                    if (f) setJd(await readFile(f).catch(() => ''))
                    e.target.value = ''
                  }}
                />
              </div>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={8}
                placeholder="Paste duties, required skills, qualifications and experience. Bullet points work best."
              />
            </div>

            {job && (
              <div className="detected">
                <div className="detected__title">
                  What the tool found <span className="muted">· edit if needed, candidates are scored against this</span>
                </div>
                <SkillEditor label="Must-have skills" skills={must} setSkills={setMust} kind="must" />
                {job.mustAny.length > 0 && (
                  <p className="hint">Also required, any one of: {job.mustAny.map((g) => [...g].join(' or ')).join('; ')}</p>
                )}
                <SkillEditor label="Nice-to-have skills" skills={nice} setSkills={setNice} kind="nice" />
                <div className="grid2">
                  <div className="field">
                    <label>Minimum years of experience</label>
                    <input type="number" min="0" max="40" step="0.5" value={minYears} onChange={(e) => setMinYears(+e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Minimum education</label>
                    <select value={minEdu} onChange={(e) => setMinEdu(+e.target.value)}>
                      <option value={0}>No minimum</option>
                      {Object.entries(EDU_NAMES).sort((a, b) => a[0] - b[0]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <button className="link" onClick={() => setShowReqs((s) => !s)}>
                  {showReqs ? '▾' : '▸'} {job.requirements.length} requirements detected ({job.requirements.filter((r) => r.kind === 'must').length} must-have)
                </button>
                {showReqs && (
                  <ul className="req-list">
                    {job.requirements.map((r, i) => (
                      <li key={i}><span className={`tag tag--${r.kind}`}>{r.kind === 'must' ? 'Must' : 'Nice'}</span>{r.text}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel__head">
              <span className="step">2</span>
              <h3>Add the CVs</h3>
            </div>
            <div
              className={`drop ${dragging ? 'is-drag' : ''}`}
              onDragOver={(e) => (e.preventDefault(), setDragging(true))}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                addFiles(e.dataTransfer.files)
              }}
              onClick={() => fileInput.current.click()}
              role="button"
              tabIndex={0}
            >
              <div className="drop__icon">⬆</div>
              <b>Drag & drop CVs here</b>
              <span>or click to browse · PDF, Word (.docx) or TXT · any number</span>
              <input ref={fileInput} type="file" accept={ACCEPT} multiple hidden onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
            </div>
            {cvs.length > 0 && (
              <div className="files">
                <div className="files__head">
                  <span>{readyCvs.length} CV{readyCvs.length === 1 ? '' : 's'} ready</span>
                  <button className="link" onClick={() => (setCvs([]), setResult(null))}>Clear all</button>
                </div>
                <ul>
                  {cvs.map((c) => (
                    <li key={c.id} className={c.error ? 'is-error' : ''}>
                      <span className="files__name">{c.name}</span>
                      <span className="files__meta">{c.error || `${c.words} words`}</span>
                      <button aria-label="Remove" onClick={() => setCvs(cvs.filter((x) => x.id !== c.id))}>×</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="toggles">
              <label className="toggle"><input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} /><i />Blind screening (hide personal details)</label>
              <label className="toggle"><input type="checkbox" checked={codes} onChange={(e) => setCodes(e.target.checked)} /><i />Show candidates as codes</label>
              <label className="toggle"><input type="checkbox" checked={useModel} onChange={(e) => setUseModel(e.target.checked)} /><i />Use AI language model (~23 MB, first time)</label>
            </div>
          </div>

          <button className="btn btn--primary run" disabled={!canRun} onClick={start}>
            {progress ? `${progress.stage}… ${Math.round(progress.value * 100)}%` : `Screen ${readyCvs.length || ''} CVs`.replace('  ', ' ')}
            {progress && <i className="run__bar" style={{ transform: `scaleX(${progress.value})` }} />}
          </button>
          {!job && <p className="hint center">Add a job description to start, or try a sample above.</p>}
          {error && <p className="error">{error}</p>}
        </section>

        {/* ---------------- Results ---------------- */}
        <section className="app__results">
          {!result && (
            <div className="empty">
              <div className="empty__orb" />
              <h3>Your ranking appears here</h3>
              <p>Each CV gets a 0–100 fit score, a decision band, and the sentence from the CV that proves each requirement.</p>
            </div>
          )}

          {result && !sel && (
            <>
              <div className="res-head">
                <div>
                  <div className="eyebrow">Results</div>
                  <h2>{title || result.job.title || 'Position'}</h2>
                  <div className="muted small">Model: {result.model}</div>
                </div>
                <button className="mini" onClick={exportCsv}>⬇ Export CSV</button>
              </div>
              <div className="counts">
                {['Shortlist', 'Review', 'Reject'].map((b) => (
                  <div key={b} className={`count count--${b.toLowerCase()}`}>
                    <b>{counts[b]}</b><span>{BAND_ICON[b]} {b}</span>
                  </div>
                ))}
              </div>
              <ol className="ranking">
                {result.rows.map((r) => (
                  <li key={r.id}>
                    <button className="row" onClick={() => setSelected(r.id)}>
                      <span className="row__rank">#{r.rank}</span>
                      <Ring value={r.fit} band={r.band} size={52} />
                      <span className="row__main">
                        <span className="row__name">{label(r)}</span>
                        <span className="row__meta">
                          Requirements {r.reqMet} · {r.years != null ? `${r.years} yrs` : 'yrs n/a'} · {r.education}
                        </span>
                        {r.mustMissing.length > 0 && <span className="row__gap">Missing: {r.mustMissing.slice(0, 3).join(', ')}</span>}
                      </span>
                      <span className={`badge badge--${r.band.toLowerCase()}`}>{BAND_ICON[r.band]} {r.band}</span>
                      <span className="row__go">→</span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}

          {sel && (
            <div className="detail">
              <button className="link back" onClick={() => setSelected(null)}>← All candidates</button>
              <div className="detail__head">
                <Ring value={sel.fit} band={sel.band} size={96} />
                <div>
                  <div className="muted small">Rank #{sel.rank}</div>
                  <h2>{label(sel)}</h2>
                  <span className={`badge badge--${sel.band.toLowerCase()}`}>{BAND_ICON[sel.band]} {sel.band}</span>
                  <div className="muted small" style={{ marginTop: 8 }}>
                    Requirements met {sel.reqMet} · {sel.years != null ? `${sel.years} years` : 'experience n/a'} · {sel.education}
                  </div>
                </div>
              </div>

              <div className="bars">
                {COMPONENTS.map(([k, name, w]) => (
                  <div key={k} className="bar">
                    <span>{name} <em>{w}%</em></span>
                    <div className="bar__track"><i style={{ width: `${sel.components[k]}%` }} /></div>
                    <b>{sel.components[k]}</b>
                  </div>
                ))}
              </div>

              {sel.flags.map((f) => <div key={f} className="flag">⚠ {f}</div>)}

              <div className="grid3">
                <div><label>Must-haves found</label><Chips items={sel.mustMatched} kind="ok" /></div>
                <div><label>Must-haves missing</label><Chips items={sel.mustMissing} kind="miss" /></div>
                <div><label>Nice-to-haves found</label><Chips items={sel.niceMatched} kind="nice" /></div>
              </div>

              <h3 className="sub">Requirement checklist</h3>
              <p className="muted small">Each requirement, with the sentence from the CV that supports it.</p>
              <div className="checklist">
                {det.requirements.map((q, i) => (
                  <div key={i} className={`check check--${q.status}`}>
                    <span className="check__mark">{STATUS[q.status][0]}</span>
                    <div>
                      <div className="check__text">
                        {q.requirement}
                        <span className="tag">{q.kind === 'must' ? 'Must-have' : 'Nice-to-have'}</span>
                      </div>
                      {q.evidence && q.status !== 'missing' && <div className="check__ev">“{q.evidence}”</div>}
                    </div>
                  </div>
                ))}
              </div>
              <details className="cvtext">
                <summary>CV text the model scored{blind ? ' (personal details hidden)' : ''}</summary>
                <pre>{det.text}</pre>
              </details>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
