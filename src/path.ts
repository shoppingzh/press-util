/**
 * 修复路径
 * @param path 路径
 * @returns
 */
export function normalize(path: string): string {
  return path.replace(/\\+/g, '/')
}

/**
 * 获取链接路径，带"/"前导并以"/"分割
 * @param path
 * @returns
 */
export function getLinkPath(path: string): string {
  if (!path) return path
  return normalize(/^\//.test(path) ? path : `/${path}`)
}
