// Evaluate the in-browser engine on the labelled sample set (Node, keyword mode).
// Usage: node scripts/evaluate.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { screen } from '../src/engine/screen.js'
import { Encoder } from '../src/engine/encoder.js'

const dir = new URL('../src/sample/', import.meta.url).pathname
const files = readdirSync(dir)
const jds = files.filter((f) => /^(data_analyst|hr_executive|process_engineer|quality_engineer)\.txt$/.test(f))
const cvs = files.filter((f) => f.startsWith('cv')).map((f) => ({ id: f.replace('.txt', ''), text: readFileSync(join(dir, f), 'utf8') }))
const labels = readFileSync(join(dir, 'labels.csv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split(','))

const ndcg = (rels, k = 5) => {
  const dcg = (r) => r.slice(0, k).reduce((a, x, i) => a + (2 ** x - 1) / Math.log2(i + 2), 0)
  const ideal = dcg([...rels].sort((a, b) => b - a))
  return ideal ? dcg(rels) / ideal : 0
}
const auc = (scores, rel) => {
  const pos = scores.filter((_, i) => rel[i]), neg = scores.filter((_, i) => !rel[i])
  let s = 0
  for (const p of pos) for (const n of neg) s += p > n ? 1 : p === n ? 0.5 : 0
  return s / (pos.length * neg.length)
}

const enc = new Encoder()
const res = []
const bands = []
for (const f of jds) {
  const job = f.replace('.txt', '')
  const rel = Object.fromEntries(labels.filter((l) => l[0] === job).map((l) => [l[1], +l[2]]))
  const out = await screen({ jdText: readFileSync(join(dir, f), 'utf8'), cvs, encoder: enc })
  const rels = out.rows.map((r) => rel[r.id])
  res.push({
    job,
    ndcg: ndcg(rels),
    p3: rels.slice(0, 3).filter((x) => x >= 2).length / 3,
    mrr: 1 / (rels.findIndex((x) => x >= 3) + 1),
    auc: auc(out.rows.map((r) => r.fit), out.rows.map((r) => rel[r.id] >= 2)),
  })
  out.rows.forEach((r) => bands.push([r.band, rel[r.id]]))
  console.log(job.padEnd(17), out.rows.slice(0, 5).map((r) => `${r.id}:${r.fit}`).join('  '))
}
const avg = (k) => (res.reduce((a, r) => a + r[k], 0) / res.length).toFixed(3)
console.log(`\nAverage  NDCG@5 ${avg('ndcg')}  P@3 ${avg('p3')}  MRR ${avg('mrr')}  AUC ${avg('auc')}   (${enc.label})`)
const short = bands.filter(([b]) => b === 'Shortlist')
console.log(`Shortlist precision ${(short.filter(([, r]) => r >= 2).length / short.length * 100).toFixed(0)}% | strong fits shortlisted ${(bands.filter(([b, r]) => r === 3 && b === 'Shortlist').length / bands.filter(([, r]) => r === 3).length * 100).toFixed(0)}% | irrelevant rejected ${(bands.filter(([b, r]) => r === 0 && b === 'Reject').length / bands.filter(([, r]) => r === 0).length * 100).toFixed(0)}%`)
