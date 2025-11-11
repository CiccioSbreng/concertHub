// frontend/src/lib/api.js
const BASE = 'http://localhost:4000'

function qs(obj) {
  const u = new URLSearchParams()
  Object.entries(obj).forEach(([k,v]) => {
    if (v !== undefined && v !== null && v !== '') u.append(k, String(v))
  })
  return u.toString()
}

// util per date (input type="date" → UTC richiesto da Ticketmaster)
export const toUtcStart = d => d ? `${d}T00:00:00Z` : undefined
export const toUtcEnd   = d => d ? `${d}T23:59:59Z` : undefined

export async function searchEvents({ city, keyword, size = 12, page = 0, start, end }) {
  const url = `${BASE}/api/ticketmaster/events?${qs({ city, keyword, size, page, start, end })}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}
