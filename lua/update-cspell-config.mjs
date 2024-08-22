import { readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

try {
  const ignoreList = readFileSync(`${__dirname}/ignore-list.txt`, 'utf8')
  const wordsToIgnore = ignoreList.split(',').filter(e => e.length)

  const cspellPath = process.argv[2]
  const rawConfig = readFileSync(`${homedir()}/${cspellPath}`, 'utf8')
  const cspellConfig = JSON.parse(rawConfig)

  const uniqueWords = new Set([...(cspellConfig.words || []), ...wordsToIgnore])
  cspellConfig.words = Array.from(uniqueWords)
  writeFileSync(`${homedir()}/cspell.json`, JSON.stringify(cspellConfig, null, 2))
} catch (err) {
  console.error('Something went wrong while updating the cspell configuration:', err)
  process.exit(1)
}
