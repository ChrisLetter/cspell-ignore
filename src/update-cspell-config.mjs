import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'os'

try {
  const ignoreList = getIgnoreList()
  const cspellConfig = getCspellConfig()
  const allWordsToIgnore = getAllWordsToIgnore(cspellConfig, ignoreList)
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
    const cspellPath = join(homedir(), process.argv[2] || 'cspell.json')
    const config = readFileSync(cspellPath, 'utf8')
    return JSON.parse(config)
  } catch (err) {
    console.error('Something went wrong while trying to read the cspell configuration file:', err)
    process.exit(1)
  }
}

/**
 * Merge the list of words to ignore (coming from the ignore-list.txt file)
 * with the list of words already ignored in the cspell configuration.
 *
 * @param {Object} cspellConfig The current cspell configuration.
 * @param {string[]} ignoreList The list of words to ignore.
 * @returns {string[]} The list of all the words to ignore, without duplicates.
 */
function getAllWordsToIgnore (cspellConfig, ignoreList) {
  const wordsAlreadyIgnored = cspellConfig.words || []
  return Array.from(new Set([...wordsAlreadyIgnored, ...ignoreList]))
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

    const cspellPath = join(homedir(), process.argv[2] || 'cspell.json')
    writeFileSync(cspellPath, JSON.stringify(cspellConfig, null, 2))
  } catch (err) {
    console.error('Something went wrong while trying to write the cspell configuration file:', err)
    process.exit(1)
  }
}
