// Extract PDFs the same way the browser app does (pdf.js) and screen every JD x CV.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { screen, analyseJob } from '../src/engine/screen.js'
import { Encoder } from '../src/engine/encoder.js'
import { maskPII } from '../src/engine/text.js'

const dir = process.argv[2]
async function pdfText(file) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)) }).promise
  const pages = []
  for (let p = 1; p <= doc.numPages; p++) {
    const content = await (await doc.getPage(p)).getTextContent()
    const lines = []; let cur = []; let lastY = null
    for (const it of content.items) {
      if (!('str' in it)) continue
      const y = Math.round(it.transform[5])
      if (lastY !== null && Math.abs(y - lastY) > 2 && cur.length) { lines.push(cur.join(' ')); cur = [] }
      if (it.str.trim()) cur.push(it.str.trim())
      lastY = y
      if (it.hasEOL && cur.length) { lines.push(cur.join(' ')); cur = []; lastY = null }
    }
    if (cur.length) lines.push(cur.join(' '))
    pages.push(lines.join('\n'))
  }
  return pages.join('\n\n')
}
const files = readdirSync(dir).sort()
const jds = files.filter((f) => f.startsWith('JD'))
const cvs = []
for (const f of files.filter((f) => f.startsWith('CV'))) cvs.push({ id: f.replace('.pdf', ''), text: await pdfText(join(dir, f)) })
if (process.argv[3] === 'show') {
  console.log(cvs[0].text, '\n---MASKED---\n', maskPII(cvs[0].text).slice(0, 400))
  const jt = await pdfText(join(dir, jds[0])); console.log('\n---JD---\n', jt)
  const j = analyseJob(jt); console.log(j.title, [...j.mustSkills], [...j.niceSkills], j.requiredYears, j.requiredEducation, j.requirements.map((r) => r.kind + ': ' + r.text))
  process.exit()
}
const enc = new Encoder()
for (const f of jds) {
  const out = await screen({ jdText: await pdfText(join(dir, f)), cvs, encoder: enc })
  console.log(f.padEnd(38), out.rows.map((r) => `${r.id.slice(3, 8)}:${r.fit}/${r.band[0]}`).join('  '), '| must:', out.job.mustSkills.join(','))
}
