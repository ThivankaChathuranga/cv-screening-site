// Sentence embeddings in the browser.
//
// "neural":  all-MiniLM-L6-v2 via transformers.js (ONNX / WebAssembly) - the same
//            model as the Python version, so the same calibration applies.
//            Downloaded once (~23 MB, quantised) and cached by the browser.
// "lexical": offline fallback using TF-IDF vectors fitted on the batch.
import { fitTransform, cosineSparse, tokenize } from './tfidf.js'

export const MODEL_ID = 'Xenova/all-MiniLM-L6-v2'

export class Encoder {
  constructor() {
    this.mode = 'lexical'
    this.extractor = null
    this.cache = new Map()
    this.idf = null
  }

  get isNeural() {
    return this.mode === 'neural'
  }

  get label() {
    return this.isNeural ? 'all-MiniLM-L6-v2 (in-browser)' : 'Keyword mode (offline fallback)'
  }

  /** Try to load the neural model. Resolves to true on success. */
  async loadNeural(onProgress) {
    if (this.extractor) return true
    try {
      const { pipeline, env } = await import('@huggingface/transformers')
      env.allowLocalModels = false
      this.extractor = await pipeline('feature-extraction', MODEL_ID, {
        dtype: 'q8',
        progress_callback: (p) => {
          if (p.status === 'progress' && p.file?.endsWith('.onnx')) onProgress?.(p.progress / 100)
        },
      })
      this.mode = 'neural'
      return true
    } catch (err) {
      console.warn('Embedding model unavailable, using keyword mode:', err)
      this.mode = 'lexical'
      return false
    }
  }

  /** Lexical mode learns term weights from the current batch. */
  fit(corpus) {
    if (this.isNeural) return
    this.idf = fitTransform(corpus).idf
    this.cache.clear()
  }

  _lexVec(text) {
    const tf = new Map()
    for (const t of tokenize(text)) if (this.idf.has(t)) tf.set(t, (tf.get(t) || 0) + 1)
    const v = new Map()
    let n = 0
    for (const [t, c] of tf) {
      const w = (1 + Math.log(c)) * this.idf.get(t)
      v.set(t, w)
      n += w * w
    }
    n = Math.sqrt(n) || 1
    for (const [t, w] of v) v.set(t, w / n)
    return v
  }

  /** Encode texts (cached). onProgress(fraction) is called for neural batches. */
  async encode(texts, onProgress) {
    const todo = [...new Set(texts)].filter((t) => !this.cache.has(t))
    if (todo.length) {
      if (this.isNeural) {
        const B = 32
        for (let i = 0; i < todo.length; i += B) {
          const batch = todo.slice(i, i + B)
          const out = await this.extractor(batch, { pooling: 'mean', normalize: true })
          const arr = out.tolist()
          batch.forEach((t, k) => this.cache.set(t, Float32Array.from(arr[k])))
          onProgress?.(Math.min(1, (i + B) / todo.length))
        }
      } else {
        todo.forEach((t) => this.cache.set(t, this._lexVec(t)))
      }
    }
    return texts.map((t) => this.cache.get(t))
  }

  sim(a, b) {
    if (this.isNeural) {
      let s = 0
      for (let i = 0; i < a.length; i++) s += a[i] * b[i]
      return s
    }
    return cosineSparse(a, b)
  }
}
