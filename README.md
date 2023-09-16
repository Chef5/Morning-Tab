# Morning Tab v1.2.0

浏览器新tab页面，整合Google/必应/百度/Stackoverflow搜索，并能记录搜索历史

目前支持两种模式（左上角切换）：

- C: 程序员模式，页面内容呈现程序员相关参考资料、学习站点、常用工具等，相当于一个导航页面；
- F: 摸鱼模式，页面内容有知乎热搜、微博热搜、虎嗅热搜；（如果需要自定义其他热搜，可克隆项目，修改部分参数即可）
- T: 随机一言（页头）
- W: 随机单词（页头）

未来开发路线：更多职业模式，主题配置，尽量支持更多自定义...

> Q：新建tab页面无法聚焦到搜索输入框？
> 官方文档：
> **Don't rely on the page having the keyboard focus.**
> The address bar always gets the focus first when the user creates a new tab.

![chrome-newtab1280.png](http://img.cdn.1zdz.cn/github/readme/chrome-newtab1280-v1.1.0.png)

## 安装使用

### 方式一：安装包crx安装

1. 从 [Releases](https://github.com/Chef5/Morning-Tab/releases) 列表中找到最新版本，下载 `crx` 包；

2. 浏览器输入：`chrome://extensions/`；

3. 拖拽安装包到浏览器完成安装。

### 方式二：官方安装

Chrome Web Store:

- 浏览器打开：https://chrome.google.com/webstore/detail/morning-tab/bjifdacmkmnljljmodgdbpiodhlnmlec

Firefox ADD-ONS:

- 浏览器打开：待发布

Edge Store

- 浏览器打开：https://microsoftedge.microsoft.com/addons/detail/paojfdambfmjedabdphhcjnelgdgjhjk

## 开发/自定义

本插件暂不支持自定义页面内容，当然之后会逐渐支持的。

如果你需要定制自己想要的页面，可以下载本项目代码并根据自己需求进行调整。

- 开启开发者模式，重启浏览器后
- 浏览器输入：`chrome://extensions/`
- 加载本项目文件夹

## 数据来源

- 随机一言：https://www.alapi.cn/
- 心灵毒鸡汤：https://www.alapi.cn/
- 热搜：https://momoyu.cc/
- 单词：https://github.com/skywind3000/ECDICT
