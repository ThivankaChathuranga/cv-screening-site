// Default links. After deploying, edit public/links.json (or links.json in the
// built dist folder) - no rebuild needed.
export const LINKS = {
  demo: 'https://YOUR-APP.streamlit.app',
  github: 'https://github.com/YOUR-USERNAME/cv-screening-nlp',
  linkedin: 'https://www.linkedin.com/in/YOUR-PROFILE',
}

// Brand palette (also mirrored as CSS variables in styles.css)
export const COLORS = {
  bg: '#04060b',
  blue: '#4f8cff',
  cyan: '#5ef2ff',
  violet: '#9b7bff',
  mint: '#3dffb0', // shortlist
  amber: '#ffb547', // review
  coral: '#ff5d6c', // reject
  paper: '#f4f2ec',
}

/** Load links.json next to index.html, if present, and merge it into LINKS. */
export async function loadLinks() {
  try {
    const res = await fetch('./links.json', { cache: 'no-store' })
    if (res.ok) Object.assign(LINKS, await res.json())
  } catch {
    /* keep defaults */
  }
}
