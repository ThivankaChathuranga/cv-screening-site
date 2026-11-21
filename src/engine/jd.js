// Job description -> structured profile (port of jd_parser.py)
import { educationLevels, requiredYears } from './text.js'
import { SOFT_SKILLS, extractSkills } from './skills.js'

const NICE = /prefer|advantage|\ba plus\b|\bis a plus\b|\bplus\b|desirable|nice to have|bonus|ideally|would be an asset|good to have|beneficial/i
const NICE_SECTION = /nice to have|preferred|desirable|good to have|bonus/i
const REQ_SECTION = /responsibilit|requirement|qualification|duties|what you.?ll do|what we.?re looking|skills|experience|key tasks|the role|you will|must have|essential|competenc/i
const BULLET = /^\s*(?:[-•*·▪●◦–\uf0b7\uf0a7]|\d+[.)])\s+/
const NOISE = /sample document|testing only|^page \d+$|^(strictly )?confidential$/i
const TITLE_PREFIX = /^(job description|job title|position|role|vacancy)\s*[:\-–—]\s*/i

/** Any short heading line, e.g. "Position Summary", "Application Criteria". */
function isAnyHeader(line) {
  const t = line.trim().replace(/:$/, '')
  return !BULLET.test(line) && t.split(/\s+/).length <= 4 && /^[A-Z]/.test(t) && !/[.,;|]/.test(t) && !/\d/.test(t)
}

function isHeader(line) {
  const stripped = line.trim().replace(/:$/, '')
  return (
    (line.trim().endsWith(':') || stripped.split(/\s+/).length <= 4) &&
    !BULLET.test(line) &&
    (REQ_SECTION.test(stripped) || NICE_SECTION.test(stripped))
  )
}

export function parseJD(text, title = '', tax) {
  const lines = text
    .replace(/\s+[•▪●◦\uf0b7\uf0a7]\s+/g, '\n• ')
    .split(/\r?\n/)
    .map((l) => l.replace(/\s*Page \d+\s*$/i, ''))
    .filter((l) => l.trim() && !NOISE.test(l.trim()))
  if (!title) {
    const t = lines.find((l) => TITLE_PREFIX.test(l.trim())) || lines[0]
    if (t && t.split(/\s+/).length <= 10 && !BULLET.test(t)) title = t.trim().replace(TITLE_PREFIX, '')
  }

  const structured = lines.some((l) => BULLET.test(l)) || lines.some(isHeader)
  let candidates = []
  if (structured) {
    let nice = false
    let inReq = false
    for (const l of lines) {
      if (isHeader(l)) {
        nice = NICE_SECTION.test(l)
        inReq = true
        continue
      }
      if (isAnyHeader(l)) {
        // a section that is not about requirements (summary, how to apply...)
        inReq = false
        nice = false
        continue
      }
      if (inReq || (BULLET.test(l) && !lines.some(isHeader))) candidates.push([l.replace(BULLET, '').trim(), nice])
    }
  } else {
    candidates = lines.join(' ').split(/(?<=[.!?;])\s+/).map((s) => [s.trim(), false])
  }

  const requirements = []
  for (const [raw, niceSection] of candidates) {
    for (let part of raw.split(/;\s*|,?\s+(?=(?:preferably|ideally)\b)/)) {
      part = part.trim().replace(/^[\s.]+|[\s.]+$/g, '')
      if (part.split(/\s+/).length < 3 && !extractSkills(part, tax).size) continue
      requirements.push({
        text: part,
        kind: niceSection || NICE.test(part) ? 'nice' : 'must',
        skills: extractSkills(part, tax),
        years: requiredYears(part),
      })
    }
  }

  const isOr = (r) => r.skills.size >= 2 && /\bor\b|\//.test(r.text)
  const mustText = [title, ...requirements.filter((r) => r.kind === 'must' && !isOr(r)).map((r) => r.text)].join(' ')
  const mustSkills = extractSkills(mustText, tax)
  const mustAny = []
  for (const r of requirements) {
    if (r.kind !== 'must' || !isOr(r)) continue
    const group = new Set([...r.skills].filter((s) => !SOFT_SKILLS.has(s)))
    const overlaps = [...group].some((s) => mustSkills.has(s))
    const dup = mustAny.some((g) => g.size === group.size && [...g].every((s) => group.has(s)))
    if (group.size && !overlaps && !dup) mustAny.push(group)
  }
  const anySkills = new Set(mustAny.flatMap((g) => [...g]))
  const niceSkills = new Set()
  for (const r of requirements) if (r.kind === 'nice') r.skills.forEach((s) => !mustSkills.has(s) && !anySkills.has(s) && niceSkills.add(s))
  for (const s of mustSkills) if (SOFT_SKILLS.has(s)) {
    niceSkills.add(s)
    mustSkills.delete(s)
  }

  const yrs = requirements.filter((r) => r.kind === 'must' && r.years).map((r) => r.years)
  const edu = requirements.filter((r) => r.kind === 'must').flatMap((r) => educationLevels(r.text))
  return {
    title,
    text,
    requirements,
    mustSkills,
    niceSkills,
    mustAny,
    requiredYears: yrs.length ? Math.min(...yrs) : null,
    requiredEducation: edu.length ? Math.min(...edu) : null,
  }
}
