// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import "./blockquote.css";
import "./blur.css";
import "./vp-code.css";
import PricingPage from './components/PricingPage.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('PricingPage', PricingPage)
    // ...
  }
} satisfies Theme
