// Text utilities: PII masking, cleaning, CV sections, evidence units,
// years of experience and education level. A port of the Python engine.

// ---------------------------------------------------------------- PII masking
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/g
const PHONE = /(\+?\d[\d\s\-()]{7,}\d)/g
const URL_RE = /(https?:\/\/\S+|www\.\S+|linkedin\.com\/\S+)/gi
const DOB = /(date of birth|dob|birthday)\s*[:-]?\s*[\w\s,/.-]{4,20}/gi
const AGE = /\bage\s*[:-]?\s*\d{2}\b/gi
const NIC = /\b(\d{9}[vVxX]|\d{12})\b/g // Sri Lankan NIC formats
const PERSONAL = /^(gender|sex|marital status|religion|nationality|civil status)\s*[:-].*$/gim
const GENDER = /\b(he|she|him|her|his|hers|mr|mrs|ms|miss|male|female|husband|wife)\b\.?/gi

export function maskPII(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length && lines[0].trim().split(/\s+/).length <= 5 && !/\d/.test(lines[0])) lines[0] = '[NAME]'
  return lines
    .join('\n')
    .replace(EMAIL, '[EMAIL]')
    .replace(URL_RE, '[URL]')
    .replace(NIC, '[ID]')
    .replace(PHONE, '[PHONE]')
    .replace(DOB, '[DOB]')
    .replace(AGE, '[AGE]')
    .replace(PERSONAL, '[PERSONAL]')
    .replace(GENDER, '')
}

export function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/\[(name|email|url|id|phone|dob|age|personal)\]/g, ' ')
    .replace(/[^a-z0-9+#.\s/-]/g, ' ')
    .replace(/(?<!\w)\.|\.(?!\w)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ---------------------------------------------------------------- sections
const SECTION_ALIASES = {
  summary: ['profile', 'summary', 'about', 'about me', 'professional summary', 'career objective', 'objective', 'personal statement', 'overview'],
  experience: ['experience', 'work experience', 'employment history', 'employment', 'professional experience', 'career history', 'work history', 'relevant experience'],
  skills: ['skills', 'technical skills', 'key skills', 'core skills', 'core competencies', 'competencies', 'tools', 'skills & tools'],
  education: ['education', 'qualifications', 'academic qualifications', 'professional qualifications', 'education & qualifications', 'education and qualifications', 'certifications', 'training'],
  projects: ['projects', 'key projects', 'achievements', 'key achievements'],
}
const HEADER = new Map(Object.entries(SECTION_ALIASES).flatMap(([s, a]) => a.map((x) => [x, s])))

function headerOf(line) {
  const key = line.toLowerCase().replace(/[^a-z& ]/g, '').trim()
  return key.split(/\s+/).length <= 4 && HEADER.has(key) ? HEADER.get(key) : null
}

export function splitSections(text) {
  const out = { header: [] }
  let cur = 'header'
  for (const line of text.split(/\r?\n/)) {
    const sec = line.trim() ? headerOf(line.trim()) : null
    if (sec) {
      cur = sec
      out[cur] = out[cur] || []
      continue
    }
    ;(out[cur] = out[cur] || []).push(line)
  }
  const res = {}
  for (const [k, v] of Object.entries(out)) {
    const t = v.join('\n').trim()
    if (t) res[k] = t
  }
  return res
}

const BULLET = /^\s*(?:[-•*·▪●◦–]|\d+[.)])\s*/

export function evidenceUnits(text, minWords = 3) {
  const units = []
  for (let line of text.split(/\r?\n/)) {
    line = line.replace(BULLET, '').trim()
    if (!line || headerOf(line)) continue
    for (const s of line.split(/(?<=[a-z0-9)])\.\s+(?=[A-Z])/)) {
      if (s.trim().split(/\s+/).length >= minWords) units.push(s.trim())
    }
  }
  return units
}

// ---------------------------------------------------------------- experience
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 }
const MON = '(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?'
const RANGE = new RegExp(
  `(?:${MON}\\s+)?((?:19|20)\\d{2})\\s*(?:-|–|—|to|until)\\s*(?:(?:${MON}\\s+)?((?:19|20)\\d{2})|(present|current|now|date|today|ongoing))`,
  'gi'
)
const STATED = /(\d{1,2}(?:\.\d)?)\s*\+?\s*(?:years?|yrs?)\b/gi
const month = (tok, def) => (tok ? MONTHS[tok.slice(0, 3).toLowerCase()] || def : def)

export function yearsFromDateRanges(text, today = new Date()) {
  const nowM = today.getFullYear() * 12 + today.getMonth() + 1
  const iv = []
  for (const m of text.matchAll(RANGE)) {
    const [, m1, y1, m2, y2, now] = m
    const start = +y1 * 12 + month(m1, 1)
    const end = now ? nowM - 1 : +y2 * 12 + month(m2, 12)
    if (start <= end && end <= nowM + 1) iv.push([start, end])
  }
  if (!iv.length) return null
  iv.sort((a, b) => a[0] - b[0])
  let total = 0
  let [cs, ce] = iv[0]
  for (const [s, e] of iv.slice(1)) {
    if (s <= ce + 1) ce = Math.max(ce, e)
    else {
      total += ce - cs + 1
      ;[cs, ce] = [s, e]
    }
  }
  total += ce - cs + 1
  return Math.round((total / 12) * 10) / 10
}

export function yearsStated(text) {
  const f = [...text.matchAll(STATED)].map((m) => parseFloat(m[1])).filter((n) => n < 50)
  return f.length ? Math.max(...f) : null
}

export function cvYears(sections) {
  const work = Object.entries(sections).filter(([k]) => k !== 'education').map(([, v]) => v).join('\n')
  const ranges = yearsFromDateRanges(sections.experience || work)
  const stated = yearsStated(['header', 'summary', 'experience'].map((k) => sections[k] || '').join('\n'))
  const vals = [ranges, stated].filter((v) => v != null)
  return vals.length ? Math.max(...vals) : null
}

export function requiredYears(text) {
  const vals = [...text.matchAll(/(\d{1,2})\s*(?:\+|-\s*\d{1,2}|to\s*\d{1,2})?\s*(?:years?|yrs?)/gi)]
    .map((m) => parseFloat(m[1]))
    .filter((n) => n > 0 && n < 30)
  return vals.length ? Math.min(...vals) : null
}

// ---------------------------------------------------------------- education
export const EDU_LEVELS = [
  [5, 'PhD', /\bph\.?\s?d\b|doctorate/i],
  [4, "Master's", /\bmaster'?s?\b|\bm\.?\s?sc\b|\bmba\b|\bm\.?\s?eng\b|postgraduate|post-graduate/i],
  [3, "Bachelor's", /\bbachelor'?s?\b|\bb\.?\s?sc\b|\bb\.?\s?eng\b|\bbba\b|\bb\.?\s?com\b|\bll\.?\s?b\b|\bdegree\b|\bgraduate\b|\bb\.?a\b|\bbeng\b/i],
  [2, 'HND / Higher Diploma', /\bhnd\b|higher national diploma|higher diploma|advanced diploma/i],
  [1, 'Diploma / Certificate', /\bdiploma\b|\bcertificate\b|\bnvq\b/i],
]
export const EDU_NAMES = Object.fromEntries(EDU_LEVELS.map(([l, n]) => [l, n]))

export const educationLevels = (text) => EDU_LEVELS.filter(([, , re]) => re.test(text)).map(([l]) => l)

export function cvEducation(sections) {
  const levels = educationLevels(sections.education || Object.values(sections).join('\n'))
  return levels.length ? Math.max(...levels) : null
}

export function educationFit(required, has) {
  if (required == null) return 1
  if (has == null) return 0.3
  if (has >= required) return 1
  return has === required - 1 ? 0.5 : 0
}
