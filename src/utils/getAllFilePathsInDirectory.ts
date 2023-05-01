import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

export function getAllFilePathsInDirectory(dirPath: string, _result?: string[]): string[] {
  const files = readdirSync(dirPath)

  let result = _result ?? []

  for (const file of files) {
    if (statSync(dirPath + "/" + file).isDirectory()) result = getAllFilePathsInDirectory(dirPath + "/" + file, result)
    else result.push(join(dirPath, "/", file))
  }

  return result
}
