// The screening pipeline (port of screener.py + matchers.py).
import { maskPII, splitSections, evidenceUnits, cvYears, cvEducation, educationFit, educationLevels, EDU_NAMES } from './text.js'
import { SKILL_TAXONOMY, SOFT_SKILLS, extractSkills, skillEvidence, weightedSkillScore, withCustomSkills } from './skills.js'
import { parseJD } from './jd.js'
import { tfidfScores, topTerms } from './tfidf.js'

export const WEIGHTS = { requirements: 0.35, skills: 0.25, semantic: 0.15, keywords: 0.1, experience: 0.1, education: 0.05 }

// Raw cosine -> 0..1. Neural values are the Python ones (all-MiniLM-L6-v2);
// lexical values were tuned on the labelled sample set.
export const CALIBRATION = {
  neural: { document: [0.15, 0.65], requirement: [0.25, 0.6] },
  lexical: { document: [0.03, 0.4], requirement: [0.05, 0.45] },
  tfidf: [0.02, 0.3],
}
export const REQ_MET = 0.7
export const REQ_PARTIAL = 0.4
export const SHORTLIST_AT = 65
export const REVIEW_AT = 45

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const calibrate = (x, [lo, hi]) => clamp01((x - lo) / (hi - lo))
const mean = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1)

/** Parse a JD with optional user-added skills. */
export function analyseJob(jdText, title = '', customSkills = []) {
  return parseJD(jdText, title, withCustomSkills(customSkills))
}

/**
 * Screen CVs against a JD.
 * @param {object} p  { jdText, title, cvs: [{id, text}], encoder, overrides, blind, onProgress }
 */
export async function screen({ jdText, title = '', cvs, encoder, overrides = {}, blind = true, onProgress = () => {} }) {
  const { mustSkills, niceSkills, requiredYears, requiredEducation } = overrides
  const extra = [...(mustSkills || []), ...(niceSkills || [])].filter((s) => !SKILL_TAXONOMY[s])
  const tax = withCustomSkills(extra)
  const job = parseJD(jdText, title, tax)
  if (mustSkills) job.mustSkills = new Set(mustSkills)
  if (niceSkills) job.niceSkills = new Set(niceSkills.filter((s) => !job.mustSkills.has(s)))
  if (requiredYears !== undefined) job.requiredYears = requiredYears || null
  if (requiredEducation !== undefined) job.requiredEducation = requiredEducation || null
  job.requirements.forEach((r) => (r.skills = extractSkills(r.text, tax)))

  const texts = cvs.map((c) => (blind ? maskPII(c.text) : c.text))
  const sections = texts.map(splitSections)
  const units = texts.map((t) => evidenceUnits(t))
  const fullJD = `${job.title}\n${jdText}`
  const kind = encoder.isNeural ? 'neural' : 'lexical'

  onProgress({ stage: 'Reading CVs', value: 0.05 })
  if (!encoder.isNeural) encoder.fit([fullJD, ...texts, ...units.flat(), ...job.requirements.map((r) => r.text)])

  // Encode everything once (cached), reporting progress
  const allTexts = [fullJD, ...texts, ...job.requirements.map((r) => r.text), ...units.flat()]
  const chunks = units.map((u) => chunk(u))
  allTexts.push(...chunks.flat())
  await encoder.encode(allTexts, (f) => onProgress({ stage: 'Understanding meaning', value: 0.1 + f * 0.75 }))

  const keywords = tfidfScores(fullJD, texts).map((x) => calibrate(x, CALIBRATION.tfidf))
  const [jdVec] = await encoder.encode([fullJD])
  const docVecs = await encoder.encode(texts)
  const reqVecs = await encoder.encode(job.requirements.map((r) => r.text))

  const rows = []
  const details = {}
  for (let k = 0; k < cvs.length; k++) {
    onProgress({ stage: 'Scoring', value: 0.85 + (0.15 * k) / cvs.length })
    const id = cvs[k].id
    const chunkVecs = await encoder.encode(chunks[k])
    const chunkSims = chunkVecs.map((v) => encoder.sim(v, jdVec)).sort((a, b) => b - a)
    const semanticRaw = 0.5 * encoder.sim(docVecs[k], jdVec) + 0.5 * mean(chunkSims.slice(0, 3))
    const semantic = calibrate(semanticRaw, CALIBRATION[kind].document)

    const evidence = skillEvidence(sections[k], tax)
    const years = cvYears(sections[k])
    const edu = cvEducation(sections[k])
    const skillsScore = weightedSkillScore(job.mustSkills, job.niceSkills, evidence, job.mustAny)

    const cvUnits = units[k].length ? units[k] : ['']
    const unitVecs = await encoder.encode(cvUnits)
    const unitSkills = cvUnits.map((u) => extractSkills(u, tax))
    const domain = Math.max(skillsScore, semantic)
    const reqs = job.requirements.map((req, i) => {
      const sims = unitVecs.map((v) => encoder.sim(reqVecs[i], v))
      let best = 0
      let bestScore = -Infinity
      sims.forEach((s, j) => {
        const ov = [...req.skills].filter((x) => unitSkills[j].has(x)).length
        if (s + 0.3 * ov > bestScore) {
          bestScore = s + 0.3 * ov
          best = j
        }
      })
      const sem = calibrate(Math.max(...sims), CALIBRATION[kind].requirement)
      let score = sem
      if (req.skills.size) {
        const ev = [...req.skills].map((s) => evidence[s] || 0)
        const hit = /\bor\b|\//.test(req.text) ? Math.max(...ev) : mean(ev)
        score = Math.max(score, 0.9 * hit)
      }
      const eduLv = educationLevels(req.text)
      if (eduLv.length) score = Math.max(score, educationFit(Math.min(...eduLv), edu))
      if (req.years) score = Math.min((years || 0) / req.years, 1) * (0.5 + 0.5 * Math.max(score, domain))
      const ov = [...req.skills].filter((x) => unitSkills[best].has(x)).length
      return {
        requirement: req.text,
        kind: req.kind,
        score: Math.round(score * 1000) / 1000,
        status: score >= REQ_MET ? 'met' : score >= REQ_PARTIAL ? 'partial' : 'missing',
        evidence: sem > 0 || ov > 0 ? cvUnits[best].replace(/\s+/g, ' ').slice(0, 220) : '',
      }
    })
    const w = reqs.map((r) => (r.kind === 'must' ? 1 : 0.5))
    const reqScore = reqs.length ? reqs.reduce((a, r, i) => a + r.score * w[i], 0) / w.reduce((a, b) => a + b, 0) : 0

    const comp = {
      requirements: reqScore,
      skills: skillsScore,
      semantic,
      keywords: keywords[k],
      experience: !job.requiredYears ? 1 : years ? Math.min(years / job.requiredYears, 1) : 0.3,
      education: educationFit(job.requiredEducation, edu),
    }
    const fit = (100 * Object.entries(WEIGHTS).reduce((a, [c, wt]) => a + wt * comp[c], 0)) / Object.values(WEIGHTS).reduce((a, b) => a + b, 0)

    const mustMatched = [...job.mustSkills].filter((s) => s in evidence).sort()
    const mustMissing = [...job.mustSkills].filter((s) => !(s in evidence)).sort()
    for (const g of job.mustAny) {
      const hits = [...g].filter((s) => s in evidence).sort()
      if (hits.length) mustMatched.push(...hits)
      else mustMissing.push([...g].sort().join(' or '))
    }
    const niceMatched = [...job.niceSkills].filter((s) => s in evidence).sort()
    const listedOnly = mustMatched.filter((s) => evidence[s] < 0.8)

    const flags = []
    if (mustMissing.length) flags.push(`Missing must-have: ${mustMissing.join(', ')}`)
    if (job.requiredYears && years != null && years < job.requiredYears) flags.push(`Below required experience (${years} < ${job.requiredYears} yrs)`)
    if (job.requiredYears && years == null) flags.push('Experience period not found')
    if (job.requiredEducation && edu != null && edu < job.requiredEducation) flags.push(`Education below requirement (${EDU_NAMES[edu]})`)
    if (mustMatched.length && listedOnly.length / mustMatched.length >= 0.5) flags.push(`Skills listed without work evidence: ${listedOnly.join(', ')}`)
    if (texts[k].split(/\s+/).length < 40) flags.push('Very little text extracted')

    const met = reqs.filter((r) => r.status === 'met').length
    rows.push({
      id,
      name: cvs[k].name || id,
      fit: Math.round(fit * 10) / 10,
      band: fit >= SHORTLIST_AT ? 'Shortlist' : fit >= REVIEW_AT ? 'Review' : 'Reject',
      reqMet: `${met}/${reqs.length}`,
      components: Object.fromEntries(Object.entries(comp).map(([c, v]) => [c, Math.round(v * 100)])),
      years,
      education: edu ? EDU_NAMES[edu] : '-',
      mustMatched,
      mustMissing,
      niceMatched,
      flags,
      keyTerms: topTerms(fullJD, texts[k]),
    })
    details[id] = { requirements: reqs, text: texts[k] }
  }

  rows.sort((a, b) => b.fit - a.fit)
  rows.forEach((r, i) => (r.rank = i + 1))
  onProgress({ stage: 'Done', value: 1 })
  return {
    rows,
    details,
    job: {
      title: job.title,
      mustSkills: [...job.mustSkills],
      niceSkills: [...job.niceSkills],
      mustAny: job.mustAny.map((g) => [...g]),
      requiredYears: job.requiredYears,
      requiredEducation: job.requiredEducation,
      requirements: job.requirements.map((r) => ({ text: r.text, kind: r.kind })),
    },
    model: encoder.label,
  }
}

function chunk(units, size = 4) {
  const out = []
  for (let i = 0; i < units.length; i += size) out.push(units.slice(i, i + size).join(' '))
  return out.length ? out : ['']
}

export { SOFT_SKILLS, EDU_NAMES }
