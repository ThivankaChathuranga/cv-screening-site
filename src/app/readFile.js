// Read PDF, Word (.docx) and text files in the browser. Nothing is uploaded.

let pdfjs
async function getPdfjs() {
  if (!pdfjs) {
    pdfjs = await import('pdfjs-dist')
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  }
  return pdfjs
}

async function readPdf(buffer) {
  const lib = await getPdfjs()
  const doc = await lib.getDocument({ data: new Uint8Array(buffer) }).promise
  const pages = []
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p)
    const content = await page.getTextContent()
    // Rebuild lines from text items using their vertical position
    const lines = []
    let current = []
    let lastY = null
    for (const item of content.items) {
      if (!('str' in item)) continue
      const y = Math.round(item.transform[5])
      if (lastY !== null && Math.abs(y - lastY) > 2 && current.length) {
        lines.push(current.join(' '))
        current = []
      }
      if (item.str.trim()) current.push(item.str.trim())
      lastY = y
      if (item.hasEOL && current.length) {
        lines.push(current.join(' '))
        current = []
        lastY = null
      }
    }
    if (current.length) lines.push(current.join(' '))
    pages.push(lines.join('\n'))
  }
  return pages.join('\n\n')
}

async function readDocx(buffer) {
  const mammoth = (await import('mammoth/mammoth.browser.js')).default
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer })
  return value.replace(/\n{3,}/g, '\n\n')
}

export async function readFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const buffer = await file.arrayBuffer()
  if (ext === 'pdf') return readPdf(buffer)
  if (ext === 'docx') return readDocx(buffer)
  if (ext === 'txt' || ext === 'md') return new TextDecoder().decode(buffer)
  throw new Error('Unsupported file type')
}

export const ACCEPT = '.pdf,.docx,.txt'
