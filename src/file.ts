import { Dirent, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { getBasename } from './filename'

const ORDER_FILE_NAME = '.ORDER'

interface File {
  dirent: Dirent
  path: string
}

interface OrderMap {
  [key: string]: number
}

function parseOrders(text: string) {
  const map: OrderMap = {}
  if (!text) return map
  text.split(/[\n|\r\n]/g).forEach((line, index) => {
    const trimLine = line.trim()
    if (!trimLine) return
    map[trimLine] = index + 1
  })
  return map
}

/**
 * 读取目录。（与`readdirSync`不同的是，该函数会自动读取排序文件并对文件进行排序）
 * @param path
 * @returns
 */
export function readdirByOrders(path: string): Dirent[] {
  const list = readdirSync(path, { withFileTypes: true })
  const orderItemIndex = list.findIndex(
    (o) => o.isFile() && o.name.toUpperCase() === ORDER_FILE_NAME,
  )
  if (orderItemIndex < 0) return list
  const orderItem = list[orderItemIndex]
  list.splice(orderItemIndex, 1)
  const orderContent = readFileSync(join(path, orderItem.name), {
    encoding: 'utf-8',
  })
  const orderMap = parseOrders(orderContent)
  list.sort((a, b) => {
    const aName = a.name
    const bName = b.name
    const aBaseName = getBasename(aName)
    const bBaseName = getBasename(bName)
    const aOrder = orderMap[aName] || orderMap[aBaseName] || 0
    const bOrder = orderMap[bName] || orderMap[bBaseName] || 0
    return aOrder - bOrder
  })
  return list
}

/**
 * 查找目录下的所有文件，并根据排序文件（如果有的话）进行排序
 * @param path 目录路径
 * @returns
 */
export function listFiles(path: string): File[] {
  return readdirByOrders(path)
    .filter((o) => o.isFile())
    .map((o) => ({
      dirent: o,
      path: join(path, o.name),
    }))
}
