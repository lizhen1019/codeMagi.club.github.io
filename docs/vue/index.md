# 字体文件导入

## 1. 下载字体

首先，需要下载字体文件，从网上找到免费的字体文件，例如：[alibabafonts](https://www.alibabafonts.com/#/more)

## 2. 将字体文件添加到项目中

将下载好的字体放在项目的 `/assets/fonts` 目录。

## 3. 在 CSS 中引入字体

在你的 CSS 文件中，使用 `@font-face` 规则来引入字体文件。你需要指定字体的名称、字体文件的位置以及字体的样式和权重。  

* 🌰 <span style="color:#fcb040;">&nbsp;需要注意 `font-family` 的名称，就是组件使用的字体名称，而不是文件名。</span>

```css
@font-face {
  font-family: 'AlimamaDongFangDaKai-Regular';
  src: url('./assets/fonts/AlimamaDongFangDaKai-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

## 4. 在组件中使用字体

在你的 Vue 组件中，你可以使用 `font-family` 属性来指定字体。例如：

```vue
<template>
  <div class="text">
    This is some text with a custom font.
  </div>
</template>

<style scoped>
.text {
  font-family: 'AlimamaDongFangDaKai-Regular';
}
</style>
```

🍔&nbsp;&nbsp;这样，你就可以愉快的使用你自己的字体了！