import { join, resolve } from 'path'
import config from './config'
import { readdirByOrders } from './file'
import { getBasename } from './filename'
import { getLinkPath } from './path'

interface SidebarItem {
  text?: string,
  link?: string
}

interface SidebarGroup {
  text?: string,
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
  const readDeep = (path: string, parentPath: string = '') => {
    const dirents = readdirByOrders(path)
    if (parentPath) {
      sidebar[getLinkPath(parentPath)] = [{
        items: dirents.filter(o => o.isFile()).map(o => ({
          text: getBasename(o.name),
          link: getLinkPath(join(parentPath, o.name))
        }))
      }]
    }
    dirents.filter(o => o.isDirectory()).forEach(o => {
      readDeep(join(path, o.name), join(parentPath, o.name))
    })
  }
  readDeep(resolve(config.docs))
  return sidebar
}