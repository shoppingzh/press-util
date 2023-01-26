import { join, resolve } from 'path'
import config from './config'
import { DocFile, readDocFiles } from './file'
import { getBasename } from './filename'
import { getLinkPath } from './path'

interface SidebarItem {
  text?: string
  link?: string
}

interface SidebarGroup {
  text?: string
  items: SidebarItem[]
}

interface SidebarMulti {
  [path: string]: SidebarGroup[]
}

interface Sidebar {
  [path: string]: SidebarGroup[] | SidebarMulti
}

/**
 * 根据文档目录结构自动生成侧边栏配置，默认将同一目录下的所有文档汇总在侧边栏中，名称为文件名
 * @returns
 */
export function autoGenerateSidebar(): Sidebar {
  const sidebar: Sidebar = {}
  const readDeep = (path: string, parentPath = '') => {
    const docFiles = readDocFiles(path)
    const groupDocFileMap = docFiles.reduce((map, o) => {
      o.meta = o.meta || {}
      let list = map[o.meta.group]
      if (!list) {
        map[o.meta.group] = list = []
      }
      if (o.dirent.isFile()) {
        list.push(o)
      }
      return map
    }, {} as Record<string, DocFile[]>)
    if (parentPath) {
      sidebar[getLinkPath(parentPath)] = Object.entries(
        groupDocFileMap,
      ).map<SidebarGroup>(([group, docFiles]) => ({
        text: group === 'undefined' ? undefined : group,
        collapsible: true,
        items: docFiles.map((o) => ({
          text: getBasename(o.dirent.name),
          link: getLinkPath(join(parentPath, o.dirent.name)),
        })),
      }))
    }
    docFiles
      .filter((o) => o.dirent.isDirectory())
      .forEach((o) => {
        readDeep(join(path, o.dirent.name), join(parentPath, o.dirent.name))
      })
  }
  readDeep(resolve(config.docs))
  return sidebar
}
