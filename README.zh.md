# dsh-w-paper

**[English](README.md) · [中文](README.zh.md)**

给 [DeepSeek Harness](https://github.com/deepseek-ai) 网页界面换背景的插件：整扇窗口铺一张图，
每个面露出多少、画面怎么调，都能在面板里当场改。

<p align="center"><img src="icon.svg" alt="dsh-w-paper 图标" width="96" height="96"></p>

## 能做什么

- **预设全用代码画** — 星空、蓝天、黄昏、日出四套在浏览器里用 `<canvas>` 现画，包里不带图片资源，
  任意分辨率都清楚。
- **导入自己的图** — 选一张，自动压到长边 1920px，存在本地。
- **入口不靠猜** — 聊天标题栏左边是一个带图标和「背景」字样的胶囊按钮，点开就是设置面板。
- **设置里也有一份** — 设置 → 通用 → 背景，能看到当前预设，点「调整」打开的是同一个面板。

## 可调的项

| 分组 | 项 | 范围 |
| --- | --- | --- |
| 画面 | 虚化 | 0–24 px |
| 画面 | 锐化 | 0–100（用 SVG 卷积做 unsharp mask） |
| 画面 | 饱和度 | 0–200 % |
| 画面 | 对比度 | 50–160 % |
| 偏移 | 水平 / 垂直 | ±40 % |
| 动效 | 鼠标视差 | 0–100 |
| 界面 | 侧边栏 / 顶部栏 / 聊天区透明度 | 0–100 %（越大越透） |
| 界面 | 聊天区边框 | 开 / 关 |

视差会跟着鼠标缓动，系统开启“减少动态效果”时自动关闭。所有取值存在 `localStorage`，刷新不丢。

## 安装

### 从 npm

DSH 里打开 **设置 → 插件**，添加 bundle 时填：

```
dsh-w-paper
```

### 从本地目录

把这个目录当 bundle 安装（填绝对路径），再到 profile 里启用即可。

## 实现方式

- Host 半边是空的（`apply() {}`），背景完全跑在浏览器里。
- 背景是 `body::before` 一层：`background-size: cover` + `filter` 滤镜链 + 一点 `translate3d` 做视差；
  另有一层 `body::after` 是压暗/提亮遮罩，保证文字对比度。
- 该保留的原生质感都保留：侧边栏仍然用自己的右边框，通过 `--dsw-specific-sidebar-fill` 上色；
  顶部栏和聊天区各自一层。所有规则都挂在 `<html>` 的 `dshbg-on` 类下，停用插件即恢复原样。
- 占用三个槽位：`conversation.header.leading`（按钮）、`shell.overlay`（面板与滤镜）、
  `settings.general.item`（通用设置那一行）。

## 兼容性

按 DSH 0.2.x 的 Web profile 编写。聊天区用 `[data-conversation-scroll]`、顶部栏用持有
`[data-conversation-header-leading]` 的 header，都是稳定的语义钩子。

## 开发

纯 JavaScript，没有构建步骤。改完 `client.js` 刷新页面即可让客户端模块加载器换到新一代。
bundle 补丁是 `cordis.patch.yml`，Host 入口是 `index.js`。

发布前记得把 `package.json` 里的 `your-github-name` 换成真实仓库地址。

## 许可

MIT，见 [LICENSE](LICENSE)。
