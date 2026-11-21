// Job description -> structured profile (port of jd_parser.py)
import { educationLevels, requiredYears } from './text.js'
import { SOFT_SKILLS, extractSkills } from './skills.js'

const NICE = /prefer|advantage|\ba plus\b|\bis a plus\b|\bplus\b|desirable|nice to have|bonus|ideally|would be an asset|good to have|beneficial/i
const NICE_SECTION = /nice to have|preferred|desirable|good to have|bonus/i
const REQ_SECTION = /responsibilit|requirement|qualification|duties|what you.?ll do|what we.?re looking|skills|experience|key tasks|the role|you will|must have|essential|competenc/i
const BULLET = /^\s*(?:[-•*·▪●◦–]|\d+[.)])\s+/

function isHeader(line) {
  const stripped = line.trim().replace(/:$/, '')
  return (
    (line.trim().endsWith(':') || stripped.split(/\s+/).length <= 4) &&
    !BULLET.test(line) &&
    (REQ_SECTION.test(stripped) || NICE_SECTION.test(stripped))
  )
}

export function parseJD(text, title = '', tax) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (!title && lines.length && lines[0].split(/\s+/).length <= 10 && !BULLET.test(lines[0])) title = lines[0].trim()

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
      if (BULLET.test(l) || inReq) candidates.push([l.replace(BULLET, '').trim(), nice])
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
