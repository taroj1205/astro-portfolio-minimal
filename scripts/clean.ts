import { rm } from 'node:fs/promises'

const targets = [
  'node_modules',
  'dist',
  '.astro',
  '.bun',
  '.eslintcache',
  '.cspellcache',
]

await Promise.all(
  targets.map(target => rm(target, { force: true, recursive: true }))
)

process.stdout.write(`Cleaned ${targets.join(', ')}\n`)
