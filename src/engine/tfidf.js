// TF-IDF with the same settings as the Python version (scikit-learn):
// English stop words, 1-2 grams, sublinear tf, smooth idf, L2 normalisation.
import { STOP_WORDS } from './stopwords.js'
import { cleanText } from './text.js'

const TOKEN = /\b[a-z0-9][a-z0-9+#./-]*[a-z0-9+#]\b|\b[a-z0-9]\b/g

export function tokenize(text, ngram = [1, 2]) {
  const words = (cleanText(text).match(TOKEN) || []).filter((w) => !STOP_WORDS.has(w))
  const out = []
  if (ngram[0] <= 1) out.push(...words)
  if (ngram[1] >= 2) for (let i = 0; i < words.length - 1; i++) out.push(words[i] + ' ' + words[i + 1])
  return out
}

/** Fit TF-IDF on documents; returns sparse L2-normalised vectors (Map term->weight). */
export function fitTransform(docs, { ngram = [1, 2], maxDf = 1 } = {}) {
  const tokenized = docs.map((d) => tokenize(d, ngram))
  const n = docs.length
  const df = new Map()
  tokenized.forEach((toks) => new Set(toks).forEach((t) => df.set(t, (df.get(t) || 0) + 1)))
  const maxCount = maxDf < 1 ? maxDf * n : n
  const idf = new Map()
  for (const [t, c] of df) if (c <= maxCount) idf.set(t, Math.log((1 + n) / (1 + c)) + 1)
  const vecs = tokenized.map((toks) => {
    const tf = new Map()
    toks.forEach((t) => idf.has(t) && tf.set(t, (tf.get(t) || 0) + 1))
    const v = new Map()
    let norm = 0
    for (const [t, c] of tf) {
      const w = (1 + Math.log(c)) * idf.get(t)
      v.set(t, w)
      norm += w * w
    }
    norm = Math.sqrt(norm) || 1
    for (const [t, w] of v) v.set(t, w / norm)
    return v
  })
  return { vecs, idf }
}

export function cosineSparse(a, b) {
  if (a.size > b.size) [a, b] = [b, a]
  let s = 0
  for (const [t, w] of a) {
    const o = b.get(t)
    if (o) s += w * o
  }
  return s
}

/** Similarity of the JD (doc 0) to each CV, like the Python TfidfMatcher. */
export function tfidfScores(jd, cvs) {
  const docs = [jd, ...cvs]
  const { vecs } = fitTransform(docs, { maxDf: docs.length >= 5 ? 0.9 : 1 })
  return vecs.slice(1).map((v) => cosineSparse(vecs[0], v))
}

export function topTerms(jd, cv, k = 6) {
  const { vecs } = fitTransform([jd, cv])
  const out = []
  for (const [t, w] of vecs[0]) {
    const o = vecs[1].get(t)
    if (o) out.push([t, w * o])
  }
  return out.sort((a, b) => b[1] - a[1]).slice(0, k).map(([t]) => t)
}
