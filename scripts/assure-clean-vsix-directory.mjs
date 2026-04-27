#!/usr/bin/env node

/**
 * Removes all files from a target directory. Intended as a pre-build  step so
 * publish commands that glob the directory only pick up the freshly built
 * package.
 *
 * Usage:
 *   node scripts/clean-vsix.js [dir]
 *
 * If [dir] is omitted, defaults to "vsix/" relative to cwd.
 */

import {DirectoryObject} from "@gesslar/toolkit"

const target = process.argv[2] || "vsix"

try {
  const dir = new DirectoryObject(target)

  if(await dir.exists) {
    const rmdir = async d => {
      const {files, directories} = await d.read()

      for(const file of files)
        await file.delete()

      for(const directory of directories)
        await rmdir(directory)

      await directory.delete()
    }

    await rmdir(dir)
  }

  if(existsSync(target)) {
    const stats = statSync(target)

    if(!stats.isDirectory()) {
      console.error(`'${target}' is not a directory.`)
      process.exit(1)
    }
  } else {
    mkdirSync(target)
  }
} catch {
  process.exit(1)
}

const vsixFiles = readdirSync(target).filter(f => f.endsWith(".vsix"))

for(const file of vsixFiles) {
  console.log(`Removing ${file}`)
  unlinkSync(join(target, file))
}
