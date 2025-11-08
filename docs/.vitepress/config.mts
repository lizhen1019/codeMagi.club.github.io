import { defineConfig } from "vitepress";

export default defineConfig({
  title: "CodeMagi Club",
  description: "We code, we create magic.",
  head: [
    ["link", { rel: "icon", href: "/images/logo.svg" }],
    ["link", { rel: "apple-touch-icon", href: "/images/logo.svg" }],
  ],
  themeConfig: {
    logo: "/images/logo.svg",
    // 搜索组件中文配置（核心修改）
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索",
            buttonAriaLabel: "搜索",
          },
          modal: {
            noResultsText: "没有找到相关内容",
            resetButtonTitle: "清除搜索",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "Java", link: "/Java" },
      { text: "Python", link: "/Python" },
      { text: "Vue", link: "/vue/project" },
      { text: "UniApp", link: "/UniApp" },
      { text: "HarmonyOS", link: "/HarmonyOS" },
      { text: "硬件", link: "/hardware" },
      { text: "文章", link: "/article" },
      { text: "演示", link: "/demo" },
      { text: "价格", link: "/price" },
    ],
    sidebar: {
      "/vue/": [
        {
          text: "配置",
          collapsed: false,
          items: [
            { text: "字体文件导入", link: "/vue/project/index.md" },
            { text: "Vue 国际化", link: "/vue/project/i18n.md" },
          ],
        },
        {
          text: "方法",
          collapsed: false,
          items:[
            { text: "WebSocket 连接", link: "/vue/methods/websocket-connect.md" },
            { text: "PeerJS 连接", link: "/vue/methods/peerjs.md" },
          ]
        },
        {
          text: "组件",
          collapsed: false,
          items:[
            { text: "Vue3 + Element Plus", link: "/vue/component/element-plus.md" },
          ]
        },

        // 
      ],
    },
    // 本页目录中文（之前已生效的配置）
    outlineTitle: "本页目录",
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    lastUpdatedText: "最后更新时间",
    socialLinks: [
      {
        icon: {
          svg: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1761556768537" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5191" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M512 960c-246.4 0-448-201.6-448-448s201.6-448 448-448 448 201.6 448 448-201.6 448-448 448z" fill="#D81E06" p-id="5192"></path><path d="M721.664 467.968h-235.52a22.272 22.272 0 0 0-20.736 20.736v51.776c0 10.368 10.368 20.736 20.736 20.736H628.48c10.368 0 20.736 10.304 20.736 20.672v10.368c0 33.664-28.48 62.08-62.144 62.08H392.896a22.272 22.272 0 0 1-20.672-20.672V436.928c0-33.664 28.48-62.08 62.08-62.08h287.36a22.272 22.272 0 0 0 20.736-20.736v-51.84a22.272 22.272 0 0 0-20.736-20.672h-287.36A152.96 152.96 0 0 0 281.6 434.368v287.36c0 10.304 10.368 20.672 20.736 20.672h302.848c75.072 0 137.216-62.08 137.216-137.216v-116.48a22.272 22.272 0 0 0-20.736-20.736z" fill="#FFFFFF" p-id="5193"></path></svg>',
        },
        link: "https://gitee.com/lizhencyj",
      },
    ],
  },
});
