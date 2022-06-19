import { join } from 'path'
import config from './config'
import { listFiles } from './file'
import { normalize } from './path'

/**
 * 获取路径下的第一篇文档的链接
 * @param path 路径
 * @returns 
 */
export function getFirstDocLink(path: string): string {
  const files = listFiles(join(config.docs, path))
  if (!files.length) return null
  let link = normalize(join(path, files[0].dirent.name))
  if (!/^\//.test(link)) {
    link = '/' + link
  }
  return link
}
