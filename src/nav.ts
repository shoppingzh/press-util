import { join } from 'path'
import config from './config'
import { readDocFiles } from './file'
import { normalize } from './path'

/**
 * 获取路径下的第一篇文档的链接
 * @param path 路径
 * @returns
 */
export function getFirstDocLink(path: string): string {
  const docFiles = readDocFiles(join(config.docs, path)).filter((o) =>
    o.dirent.isFile(),
  )
  if (!docFiles.length) return null
  let link = normalize(join(path, docFiles[0].dirent.name))
  if (!/^\//.test(link)) {
    link = '/' + link
  }
  return link
}
