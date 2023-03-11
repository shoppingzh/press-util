import { Dirent, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { getBasename } from './filename'
import { DEFAULT_GROUP_NAME, parse } from './meta'

const META_FILE_NAME = '.ORDER'

/**
 * 判断文件是否为文档
 * @param dirent 
 * @returns 
 */
export function isDocFile(dirent: Dirent) {
  return dirent && dirent.isFile() && /\.md$/gi.test(dirent.name)
}

/**
 * 判断是否为有效目录
 * @param dirent 
 * @returns 
 */
export function isValidDir(dirent: Dirent) {
  return dirent && dirent.isDirectory() && !/^[._]/gi.test(dirent.name)
}

interface Doc {
  name: string
  file: Dirent
}

interface DocGroup {
  name: string,
  docs: Doc[],
  dirs: Dirent[],
}

export function readDocGroups(path: string): DocGroup[] {
  const list = readdirSync(path, { withFileTypes: true })
  const fileList = list.filter(o => isDocFile(o))

  // 读取元信息
  const metaFileIndex = list.findIndex(o => o.isFile() && o.name.toUpperCase() === META_FILE_NAME)
  const meta = parse(metaFileIndex < 0 ? null : readFileSync(join(path, list[metaFileIndex].name), {
    encoding: 'utf-8',
  }))

  const [ basenameMap, filenameMap ] = fileList.reduce((arr, o) => {
    const [basenameMap, filenameMap] = arr
    basenameMap[getBasename(o.name)] = o
    filenameMap[o.name] = o
    return arr
  }, [{} as Record<string, Dirent>, {} as Record<string, Dirent>])

  const metaFileMap: Record<string, 1> = {}
  const groups = meta.groups.map(group => {
    return {
      name: group.name === DEFAULT_GROUP_NAME ? '' : group.name,
      docs: group.docs.map<Doc>(doc => {
        const file = basenameMap[doc.name] || filenameMap[doc.name]
        metaFileMap[file.name] = 1
        return {
          name: doc.name || '',
          file,
        }
      }),
      dirs: list.filter(o => isValidDir(o))
    }
  })

  // 将游离文档放到第1组
  const hangDocs = fileList.filter(o => !metaFileMap[o.name]).map<Doc>(o => ({
    name: getBasename(o.name),
    file: o
  }))
  if (hangDocs.length) {
    groups[0].docs.push(...hangDocs)
  }

  return groups
}
