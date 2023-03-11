import { Dirent } from 'fs'
import { join } from 'path'
import config from './config'
import { readDocGroups } from './file'
import { normalize } from './path'

/**
 * 获取路径下的第一篇文档的链接
 * @param path 路径
 * @returns
 */
export function getFirstDocLink(path: string): string | null {
  const docFiles = readDocGroups(join(config.docs, path)).reduce((arr, o) => {
    arr.push(...o.docs.map(x => x.file))
    return arr
  }, [] as Dirent[])
  if (!docFiles.length) return null
  let link = normalize(join(path, docFiles[0].name))
  if (!/^\//.test(link)) {
    link = '/' + link
  }
  return link
}
