#!/usr/bin/env node

const { resolve } = require('path')
const { createWriteStream } = require('fs')

const CWD = process.cwd()
const FLAGS = ['append', 'help', 'ignoreInterrupts', 'suppress', 'version']
const VERSION = require(resolve(__dirname, 'package.json')).version
const HELP = `
Usage:
  ntee [OPTION]... FILE...

  Copy standard input to each FILE, and also to standard output.

Options:
  -a, --append              append to the given FILEs, do not overwrite
  -i, --ignore-interrupts   ignore interrupt signals
  -s, --suppress            do not output to stdout
  -v, --version             display the current version
  -h, --help                display help and usage details
`

const dashToCamel = str => str.replace(/-([a-z])/g, m => m[1].toUpperCase())

const throwArgError = arg => {
  console.log(`ntee: unrecognized option '${arg}'`)
  console.log(`Try 'ntee --help' for more information.`)
  process.exit(1)
}

const parseArgs = argv => {
  const args = argv.slice(2)
  const result = { files: [] }

  while (args.length) {
    const next = args.shift()

    if (next.startsWith('--')) {
      const normalized = dashToCamel(next.slice(2))

      if (FLAGS.includes(normalized)) {
        result[normalized] = true
      } else {
        throwArgError(next)
      }
    } else if (next.startsWith('-')) {
      const shortFlags = next.slice(1).split('')

      shortFlags.forEach(shortFlag => {
        const match = FLAGS.find(flag => flag.startsWith(shortFlag))

        if (match) {
          result[match] = true
        } else {
          throwArgError(`-${shortFlag}`)
        }
      })
    } else {
      result.files.push(next)
    }
  }

  return result
}

const options = parseArgs(process.argv)

if (options.help) {
  console.log(HELP)
  process.exit(0)
}

if (options.version) {
  console.log(VERSION)
  process.exit(0)
}

process.on('SIGINT', () => {
  if (!options.ignoreInterrupts) {
    process.exit(0)
  }
})

const fileStreams = options.files
  .map(relativePath => resolve(CWD, relativePath))
  .map(absolutePath =>
    createWriteStream(absolutePath, { flags: options.append ? 'a' : 'w' })
  )

if (!options.suppress) {
  process.stdin.pipe(process.stdout)
}

fileStreams.forEach(writableStream => {
  process.stdin.pipe(writableStream)
})
