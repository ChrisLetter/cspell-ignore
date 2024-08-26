import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

try {
  const ignoreList = getIgnoreList()
  const cspellConfig = getCspellConfig()

  const wordsAlreadyIgnored = cspellConfig.words || []
  const allWordsToIgnore = Array.from(new Set([...wordsAlreadyIgnored, ...ignoreList]))

  updateCspellConfig(cspellConfig, allWordsToIgnore)
} catch (err) {
  console.error('Something went wrong while updating the cspell configuration:', err)
  process.exit(1)
}

/**
 * Read from the ignore-list.txt file and return the list of words to ignore.
 *
 * @returns {string[]} The list of words to ignore.
 * @throws {Error} If something goes wrong while trying to read the file.
 */
function getIgnoreList () {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const ignoreList = readFileSync(join(__dirname, '..', 'ignore-list.txt'), 'utf8')
    return ignoreList.split('\n').filter(e => e.length)
  } catch (err) {
    console.error('Something went wrong while trying to get the list of words to ignore: ', err)
    process.exit(1)
  }
}

/**
  * Get the cspell configuration based on the path provided as argument to the script.
  *
  * @returns {Object} The cspell configuration.
  * @throws {Error} If something goes wrong while trying to read the file.
  */
function getCspellConfig () {
  try {
    const cspellPath = join(process.argv[2])
    const config = readFileSync(cspellPath, 'utf8')
    return JSON.parse(config)
  } catch (err) {
    console.error('Something went wrong while trying to read the cspell configuration file:', err)
    process.exit(1)
  }
}

/**
 * Update the cspell configuration file by adding the list of words to ignore.
 *
 * @param {Object} cspellConfig The cspell configuration.
 * @param {string[]} allWordsToIgnore The list of unique words to ignore.
 * @returns {void}
 * @throws {Error} If something goes wrong while trying to write the file.
 */
function updateCspellConfig (cspellConfig, allWordsToIgnore) {
  try {
    cspellConfig.words = allWordsToIgnore

    const cspellPath = join(process.argv[2])
    writeFileSync(cspellPath, JSON.stringify(cspellConfig, null, 2))
  } catch (err) {
    console.error('Something went wrong while trying to write the cspell configuration file:', err)
    process.exit(1)
  }
}
