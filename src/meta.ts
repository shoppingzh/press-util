
interface MetaDoc {
  name: string
  order: number
}

interface MetaGroup {
  name: string
  docs: MetaDoc[]
}

export interface Meta {
  groups: MetaGroup[]
}

const GROUP_RE = /^\$\s*(.+?)\s*\$$/
export const DEFAULT_GROUP_NAME = '_DEFAULT_GROUP_'

export function getGroup(text: string): string | null {
  const result = GROUP_RE.exec(text)
  return result ? result[1] : null
}

export function parse(content: string | null): Meta {
  const groups: MetaGroup[] = [{
    name: DEFAULT_GROUP_NAME,
    docs: []
  }]
  const meta = { groups }
  if (!content) return meta

  const lines = content.split(/[\n|\r\n]/g)
  let currentGroup = groups[0]
  for (let i = 0, len = lines.length;i < len;i++) {
    const line = lines[i].trim()
    if (!line) continue

    let docName = ''
    const lineGroupName = getGroup(line)
    let groupName = lineGroupName
    if (!lineGroupName) {
      const parts = line.split('$')
      docName = parts[0]
      groupName = parts[1] || lineGroupName // 兼容老版本分组方法
    }
    if (groupName) { // 组
      currentGroup = groups.find(o => o.name === groupName)
      if (!currentGroup) {
        currentGroup = { name: groupName, docs: [] }
        groups.push(currentGroup)
      }
    }

    if (!lineGroupName) {
      currentGroup.docs.push({
        name: docName,
        order: currentGroup.docs.length,
      })
    }
  }

  return meta
}
