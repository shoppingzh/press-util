# press-util
vitepress/vuepress支持工具

## 安装

```bash
yarn add vuepress-util
// npm i vuepress-util
```

## 使用

```ts
import { autoGenerateSidebar } from 'vuepress-util'
export default {
  themeConfig: {
    sidebar: autoGenerateSidebar()
  }
}
```
