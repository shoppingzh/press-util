# press-util
vitepress/vuepress支持工具

## 安装

```bash
pnpm i -D press-util
# yarn add -D press-util
# npm i -D press-util
```

## 使用

```ts
import { autoGenerateSidebar } from 'press-util'

export default {
  themeConfig: {
    sidebar: autoGenerateSidebar()
  }
}
```
