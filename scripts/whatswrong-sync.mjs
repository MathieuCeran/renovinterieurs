#!/usr/bin/env node
/*
 * WhatsWrong sync: saves the published articles, pages, redirects and images
 * inside the site's own repository. The site reads only these files, so it
 * never depends on WhatsWrong to display anything, and keeps everything whatever
 * happens to the WhatsWrong account (cancelled, deleted) or to the service.
 *
 * No dependency. Run by a scheduled job (GitHub Actions, GitLab CI, cron):
 *   WW_API_KEY=ww_… WW_BLOG_BASE=https://www.example.com/blog node scripts/whatswrong-sync.mjs
 *
 * The rule: a failed or suspicious answer NEVER erases what the site holds.
 *
 * Options (environment variables):
 *   WW_BLOG_BASE           your blog address; several languages: comma separated
 *   WW_API_BASE            default https://www.whatswrong.io
 *   WW_CONTENT_FILE        default whatswrong/content.json
 *   WW_IMAGES_DIR          default public/whatswrong
 *   WW_IMAGES_URL          default /whatswrong
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const API_BASE = (process.env.WW_API_BASE || 'https://www.whatswrong.io').replace(/\/+$/, '')
const KEY = process.env.WW_API_KEY || process.env.WHATSWRONG_API_KEY
const BLOG_BASES = (process.env.WW_BLOG_BASE || '')
  .split(',')
  .map((base) => base.trim())
  .filter(Boolean)
const FILE = process.env.WW_CONTENT_FILE || 'whatswrong/content.json'
const IMAGES_DIR = process.env.WW_IMAGES_DIR || 'public/whatswrong'
const IMAGES_URL = (process.env.WW_IMAGES_URL || '/whatswrong').replace(/\/+$/, '')

const API_TIMEOUT_MS = 60_000
const IMAGE_TIMEOUT_MS = 45_000
const MAX_IMAGE_BYTES = 15 * 1024 * 1024
// SVG stays on its original address: served from the site, it could run scripts.
const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
}

/* Nothing to do this time: the files stay as they are, and the job stays green. */
function keepCopy(reason) {
  console.log(`Content kept, nothing changed: ${reason}`)
  process.exit(0)
}

async function readSaved() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'))
  } catch {
    return null
  }
}

async function fetchContent() {
  const query = BLOG_BASES.map((base) => `base=${encodeURIComponent(base)}`).join('&')
  try {
    const response = await fetch(`${API_BASE}/api/v1/sync${query === '' ? '' : `?${query}`}`, {
      headers: { Authorization: `Bearer ${KEY}` },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    })
    if (!response.ok) {
      keepCopy(`the API answered ${response.status}.`)
    }
    const body = await response.json()
    if (
      !Array.isArray(body.articles) ||
      !Array.isArray(body.pages) ||
      !Array.isArray(body.redirects)
    ) {
      keepCopy('unexpected answer from the API.')
    }
    return body
  } catch (error) {
    keepCopy(`the API could not be read (${error.message}).`)
  }
}

const countItems = (saved) => saved.articles.length + saved.pages.length

/* One article removed on purpose follows through; a list that empties or
 * loses more than half of what it held is treated as a problem. */
function refuseSuspiciousLoss(previous, next) {
  if (previous === null) {
    return
  }
  const before = countItems(previous)
  const after = countItems(next)
  if (before > 0 && after === 0) {
    keepCopy(`the API returned nothing while the site holds ${before} items.`)
  }
  if (before >= 4 && after < before / 2) {
    keepCopy(`the API returned ${after} items while the site holds ${before}.`)
  }
}

/* Every image address of the content on another host than the site. */
function imageUrls(text, domain) {
  const found = new Set()
  const patterns = [
    /<img\b[^>]*?\bsrc=\\?"(https:\/\/[^"\\\s]+)/gi,
    /"cover":\s*"(https:\/\/[^"\\\s]+)/g,
    /(https:\/\/[^"'\\\s<>()]+?\.(?:jpe?g|png|webp|avif|gif)(?:\?[^"'\\\s<>()]*)?)/gi,
  ]
  const site = domain.replace(/^www\./, '')
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      try {
        const host = new URL(match[1]).hostname.replace(/^www\./, '')
        if (host !== site) {
          found.add(match[1])
        }
      } catch {
        // Not an address: left as it is.
      }
    }
  }
  return [...found]
}

async function existingImage(hash) {
  const names = await fs.readdir(IMAGES_DIR).catch(() => [])
  return names.find((name) => name.startsWith(`${hash}.`)) ?? null
}

/* The local name of an image, downloaded once; null if it cannot be copied. */
async function copyImage(url) {
  const hash = createHash('sha256').update(url).digest('hex').slice(0, 20)
  const existing = await existingImage(hash)
  if (existing !== null) {
    return existing
  }
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) })
    const type = (response.headers.get('content-type') ?? '').split(';')[0].trim()
    const extension = EXTENSIONS[type]
    if (!response.ok || extension === undefined) {
      console.log(`Image not copied (${response.status}, ${type}): ${url}`)
      return null
    }
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.length > MAX_IMAGE_BYTES) {
      console.log(`Image too large, not copied: ${url}`)
      return null
    }
    await fs.mkdir(IMAGES_DIR, { recursive: true })
    const name = `${hash}${extension}`
    await fs.writeFile(path.join(IMAGES_DIR, name), bytes)
    return name
  } catch (error) {
    console.log(`Image not copied (${error.message}): ${url}`)
    return null
  }
}

/* Same content, same file: the job only commits when something changed. */
function stable(content) {
  const byKey = (key) => (a, b) => String(a[key]).localeCompare(String(b[key]))
  return JSON.stringify(
    {
      version: 1,
      domain: content.domain,
      articles: [...content.articles].sort(byKey('id')),
      pages: [...content.pages].sort(byKey('path')),
      redirects: [...content.redirects].sort(byKey('from')),
    },
    null,
    1,
  )
}

async function removeUnusedImages(used) {
  const names = await fs.readdir(IMAGES_DIR).catch(() => [])
  await Promise.all(
    names
      .filter((name) => !used.has(name))
      .map((name) => fs.rm(path.join(IMAGES_DIR, name), { force: true })),
  )
}

if (!KEY) {
  keepCopy('WW_API_KEY is not set.')
}

const content = await fetchContent()
refuseSuspiciousLoss(await readSaved(), content)

let text = stable(content)
const used = new Set()
for (const url of imageUrls(text, content.domain ?? '')) {
  const name = await copyImage(url)
  if (name !== null) {
    used.add(name)
    text = text.replaceAll(url, `${IMAGES_URL}/${name}`)
  }
}

// Written whole, then swapped: a crash never leaves half a file.
await fs.mkdir(path.dirname(FILE), { recursive: true })
await fs.writeFile(`${FILE}.tmp`, `${text}\n`)
await fs.rename(`${FILE}.tmp`, FILE)
await removeUnusedImages(used)
console.log(
  `Content saved: ${content.articles.length} articles, ${content.pages.length} pages, ` +
    `${content.redirects.length} redirects, ${used.size} images.`,
)
