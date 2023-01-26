import { Dirent, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { getBasename } from './filename'

const META_FILE_NAME = '.ORDER'

interface DocMeta {
  name?: string
  order?: number
  group?: string
}

export interface DocFile {
  dirent: Dirent
  meta: DocMeta
}

function parseMetas(text: string): DocMeta[] {
  if (!text) return []
  return text
    .split(/[\n|\r\n]/g)
    .filter((line) => line.trim())
    .map((line, index) => {
      const parts = line.split(/\$/g)
      return {
        name: parts[0],
        group: parts[1],
        order: index + 1,
      }
    })
}

/**
 * 判断文件是否为文档
 * @param filename 文件名
 * @returns
 */
export function isDocFile(filename: string) {
  return filename && /\.md$/.test(filename)
}

/**
 * 读取指定目录下的文档集合
 * @param path 路径
 * @returns
 */
export function readDocFiles(path: string): DocFile[] {
  const list = readdirSync(path, { withFileTypes: true })
  const metaFileIndex = list.findIndex(
    (o) => o.isFile() && o.name.toUpperCase() === META_FILE_NAME,
  )
  if (metaFileIndex < 0) return list.map((dirent) => ({ dirent, meta: {} }))
  const metaFile = list[metaFileIndex]
  list.splice(metaFileIndex, 1)
  const metaContent = readFileSync(join(path, metaFile.name), {
    encoding: 'utf-8',
  })
  const metas = parseMetas(metaContent)
  const metaMap = metas.reduce((map, meta) => {
    map[meta.name] = meta
    return map
  }, {} as Record<string, DocMeta>)
  const docFiles = list.map<DocFile>((dirent) => {
    const filename = dirent.name
    const basename = getBasename(filename)
    return {
      dirent,
      meta: metaMap[filename] || metaMap[basename],
    }
  })
  docFiles.sort((a, b) => {
    const aMeta = a.meta
    const bMeta = b.meta
    if (!aMeta || !bMeta) return -1
    return aMeta.order - bMeta.order
  })

  return docFiles
}
