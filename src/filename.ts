
/**
 * 获取文件名
 * @param filename 文件名
 * @returns 
 */
export function getBasename(filename: string): string {
  if (!filename) return filename
  const idx: number = filename.lastIndexOf('.')
  return idx >= 0 ? filename.substring(0, idx) : filename
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 
 */
export function getExtension(filename: string): string {
  if (!filename) return filename
  const idx: number = filename.lastIndexOf('.')
  return idx >= 0 ? filename.substring(idx + 1) : null
}
