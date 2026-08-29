/**
 * Turns the single-file Vite build into a body-only fragment that the Artifact
 * host can wrap in its own document shell.
 *
 *   npm run build:artifact && node scripts/make-artifact.mjs
 *
 * The Artifact runtime supplies <!doctype>, <html>, <head> and <body>, so this
 * strips those and keeps the title, the Google Fonts link (the one external
 * host the Artifact CSP allows), the inlined <style>, the #root div and the
 * inlined <script>.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const src = resolve(root, 'dist-artifact/index.html')
const out = resolve(root, 'dist-artifact/artifact.html')

const html = readFileSync(src, 'utf8')

const pick = (re, label) => {
  const all = [...html.matchAll(re)].map((m) => m[0])
  if (!all.length) throw new Error(`make-artifact: no ${label} found in ${src}`)
  return all
}

const title = pick(/<title>[\s\S]*?<\/title>/gi, '<title>')[0]
const fontLinks = [...html.matchAll(/<link\b[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>/gi)].map((m) => m[0])
const styles = pick(/<style[\s\S]*?<\/style>/gi, '<style>')
const scripts = pick(/<script[\s\S]*?<\/script>/gi, '<script>')

const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
if (!bodyMatch) throw new Error('make-artifact: no <body> found')

// Everything the body needs minus the scripts, which we re-append in order.
const bodyInner = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '').trim()

const parts = [title, ...fontLinks, ...styles, bodyInner, ...scripts]
const fragment = parts.join('\n')

if (/<!doctype|<html|<head|<body/i.test(fragment)) {
  throw new Error('make-artifact: document-level tags leaked into the fragment')
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, fragment, 'utf8')

const kb = (Buffer.byteLength(fragment) / 1024).toFixed(1)
console.log(`artifact fragment written → ${out} (${kb} kB, ${scripts.length} script(s), ${styles.length} style(s))`)
