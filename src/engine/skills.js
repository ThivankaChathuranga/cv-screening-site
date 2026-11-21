// Skill taxonomy with synonyms + evidence weighting (port of skills.py)
export const SKILL_TAXONOMY = {
  // Data / tech
  python: ['python'],
  sql: ['sql', 'mysql', 'postgresql', 'postgres', 't-sql', 'sql server'],
  r: ['r programming', 'rstudio', '\\b(?<=, )r(?=[,.\\s])', '\\br(?=, )'],
  excel: ['excel', 'spreadsheets', 'vlookup', 'pivot tables?'],
  'power bi': ['power bi', 'powerbi'],
  tableau: ['tableau'],
  'machine learning': ['machine learning', 'machine-learning', '\\bml\\b', 'scikit-learn', 'sklearn'],
  'deep learning': ['deep learning', 'neural networks?', 'tensorflow', 'pytorch', 'keras'],
  nlp: ['nlp', 'natural language processing', 'text mining', 'spacy', 'nltk', 'transformers'],
  statistics: ['statistics', 'statistical', 'hypothesis testing', 'regression', 'a/b test'],
  'data visualization': ['data visuali[sz]ation', 'dashboards?', 'matplotlib', 'seaborn', 'plotly'],
  pandas: ['pandas', 'numpy'],
  cloud: ['aws', 'azure', 'gcp', 'google cloud'],
  etl: ['etl', 'data pipelines?', 'airflow', 'data warehouse', 'data warehousing'],
  erp: ['erp', 'sap', 'oracle ebs', 'dynamics 365'],
  forecasting: ['forecasting', 'forecasts?', 'time series'],
  git: ['git', 'github', 'gitlab'],
  // HR
  recruitment: ['recruitment', 'recruiting', 'recruiter', 'talent acquisition', 'hiring', 'sourcing candidates', 'headhunting', 'interviewing candidates'],
  'labour law': ['labou?r laws?', 'employment law', 'shop and office', 'wages board', 'industrial disputes act', 'epf', 'etf', 'gratuity', 'statutory compliance'],
  payroll: ['payroll', 'salary processing', 'salary administration', 'salary inputs?'],
  onboarding: ['onboarding', 'induction', 'orientation programmes?'],
  'compensation & benefits': ['compensation', 'benefits administration', 'c&b', 'salary surveys?', 'reward management'],
  'employee relations': ['domestic inquir(?:y|ies)', 'joint council', 'worker complaints', 'trade unions?', 'employee relations', 'industrial relations', 'grievance', 'disciplinary'],
  'performance management': ['performance management', 'kpis?', 'appraisals?', 'performance reviews?'],
  'training & development': ['training', 'skills training', 'training and development', 'training & development', 'learning and development', 'l&d', 'training needs analysis'],
  hris: ['hris', 'sap successfactors', 'successfactors', 'workday', 'hr information system'],
  'employee engagement': ['employee engagement', 'engagement surveys?', 'welfare', 'staff engagement', 'employee experience'],
  cipm: ['cipm', 'cipd', 'shrm'],
  // Electronics manufacturing / engineering
  smt: ['smt', 'surface[- ]mount', 'pick and place', 'pick-and-place', 'reflow'],
  'pcb assembly': ['pcba?', 'pcb assembly', 'printed circuit'],
  'lean manufacturing': ['lean', 'kaizen', '5s', 'six sigma', 'green belt', 'black belt', 'value stream', 'continuous improvement'],
  'quality systems': ['iso 9001', 'iatf 16949', 'iso 13485', 'quality management system', '\\bqms\\b'],
  'root cause analysis': ['root cause', '8d', 'fishbone', '5 whys', 'fmea'],
  'ipc standards': ['ipc-a-610', 'ipc a 610', 'ipc-j-std-001', 'ipc standards?'],
  'esd control': ['\\besd\\b', 'electrostatic discharge'],
  autocad: ['autocad', 'solidworks', 'cad'],
  'process engineering': ['process engineering', 'process improvement', 'process optimi[sz]ation'],
  // Soft skills (lower weight)
  communication: ['communication', 'presentation skills', 'stakeholder'],
  leadership: ['leadership', 'team lead', 'led a team', 'supervis\\w*'],
  'problem solving': ['problem solving', 'problem-solving', 'analytical'],
}

export const SOFT_SKILLS = new Set(['communication', 'leadership', 'problem solving'])
export const EVIDENCE_WEIGHT = { experience: 1, projects: 1, summary: 0.9, header: 0.9, education: 1, skills: 0.5 }

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function withCustomSkills(custom = []) {
  const tax = { ...SKILL_TAXONOMY }
  for (const name of custom) {
    const key = String(name).trim().toLowerCase()
    if (key && !tax[key]) tax[key] = [escapeRe(key)]
  }
  return tax
}

const cache = new WeakMap()
function compile(tax) {
  if (cache.has(tax)) return cache.get(tax)
  const out = Object.entries(tax).map(([skill, forms]) => {
    const parts = forms.map((f) => (f.startsWith('\\b') ? f : `(?<![\\w])${f}(?![\\w])`))
    return [skill, new RegExp(parts.join('|'), 'i')]
  })
  cache.set(tax, out)
  return out
}

export function extractSkills(text, tax = SKILL_TAXONOMY) {
  const found = new Set()
  for (const [skill, re] of compile(tax)) if (re.test(text)) found.add(skill)
  return found
}

/** skill -> evidence strength (1 = used in work, 0.5 = only listed) */
export function skillEvidence(sections, tax) {
  const strength = {}
  for (const [sec, text] of Object.entries(sections)) {
    const w = EVIDENCE_WEIGHT[sec] ?? 0.9
    for (const s of extractSkills(text, tax)) strength[s] = Math.max(strength[s] || 0, w)
  }
  return strength
}

export function weightedSkillScore(must, nice, ev, mustAny = []) {
  const items = [...must].map((s) => [1, ev[s] || 0])
  for (const g of mustAny) items.push([1, Math.max(...[...g].map((s) => ev[s] || 0))])
  for (const s of nice) items.push([SOFT_SKILLS.has(s) ? 0.25 : 0.5, ev[s] || 0])
  if (!items.length) return 0
  return items.reduce((a, [w, e]) => a + w * e, 0) / items.reduce((a, [w]) => a + w, 0)
}
