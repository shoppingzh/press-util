import { join, resolve } from 'path'
import config from './config'
import { readDocGroups } from './file'
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
    const groups = readDocGroups(path)

    if (parentPath) {
      sidebar[getLinkPath(parentPath)] = groups.filter(o => o.docs.length).map(o => {
        return {
          text: o.name,
          collapsible: true,
          items: o.docs.map(doc => ({
            text: getBasename(doc.file.name),
            link: getLinkPath(join(parentPath, doc.file.name)),
          }))
        }
      })
    }
    groups.forEach(group => {
      group.dirs.forEach(dir => {
        readDeep(join(path, dir.name), join(parentPath, dir.name))
      })
    })
  }
  readDeep(resolve(config.docs))

  return sidebar
}
