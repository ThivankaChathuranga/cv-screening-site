// Runs screening off the main thread so the page (and 3D) stays responsive.
import { Encoder } from './encoder.js'
import { screen } from './screen.js'

const encoder = new Encoder()
let modelTried = false

self.onmessage = async ({ data }) => {
  const { id, payload } = data
  const progress = (p) => self.postMessage({ id, type: 'progress', ...p })
  try {
    if (payload.useModel && !modelTried) {
      modelTried = true
      progress({ stage: 'Loading language model (first time only)', value: 0 })
      await encoder.loadNeural((f) => progress({ stage: 'Downloading language model', value: f * 0.9 }))
    }
    const result = await screen({ ...payload, encoder, onProgress: progress })
    self.postMessage({ id, type: 'result', result })
  } catch (err) {
    self.postMessage({ id, type: 'error', message: err?.message || String(err) })
  }
}
