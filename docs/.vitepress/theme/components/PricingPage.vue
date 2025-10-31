<template>
  <div class="pricing-page">
    <!-- 头部统计与说明 -->
    <div class="pricing-header">
      <h1 class="pricing-title">超过 53,476 位信赖的开发者</h1>
      <p class="pricing-subtitle">以及众多科技巨头的选择</p>
      <p class="pricing-tagline">
        本项目基于 MIT 协议开源免费，当前页面为定价模板，仅作演示用途
        <span class="free-tag">免费商用</span>
      </p>
    </div>

    <!-- 定价卡片列表 -->
    <div class="pricing-cards">
      <div 
        class="pricing-card" 
        v-for="(plan, index) in pricingPlans" 
        :key="index"
        :class="{ 'recommended': plan.recommended }"
      >
        <div v-if="plan.recommended" class="recommended-badge">推荐选择</div>
        <!-- 卡片顶部渐变装饰 -->
        <div class="card-decoration" :class="{ 'recommended-decoration': plan.recommended }"></div>
        <h3 class="plan-title">{{ plan.title }}</h3>
        <p class="plan-desc">{{ plan.desc }}</p>
        <div class="price">
          <span class="currency">¥</span>
          <span class="amount">{{ plan.amount }}</span>
          <span class="payment">/一次性付款</span>
        </div>
        <ul class="features">
          <li v-for="(feature, featIndex) in plan.features" :key="featIndex">
            <i class="icon" :class="feature.available ? 'check' : 'cross'"></i>
            {{ feature.label }}
          </li>
        </ul>
        <button class="buy-button" :class="{ 'recommended-btn': plan.recommended }">
          立即购买
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const pricingPlans = [
  {
    title: "单次使用版",
    desc: "适用于单个最终产品，最终用户无需付费。",
    amount: "349",
    recommended: false,
    features: [
      { label: "完整源代码", available: true },
      { label: "技术文档", available: true },
      { label: "SaaS应用授权", available: false },
      { label: "单个项目使用", available: true },
      { label: "一年技术支持", available: true },
      { label: "一年免费更新", available: true },
    ],
  },
  {
    title: "多次使用版",
    desc: "适用于无限个最终产品，最终用户无需付费。",
    amount: "629",
    recommended: true, // 标记为推荐方案
    features: [
      { label: "完整源代码", available: true },
      { label: "技术文档", available: true },
      { label: "SaaS应用授权", available: false },
      { label: "无限项目使用", available: true },
      { label: "一年技术支持", available: true },
      { label: "一年免费更新", available: true },
    ],
  },
  {
    title: "扩展授权版",
    desc: "适用于单个最终产品，最终用户需要付费。",
    amount: "2099",
    recommended: false,
    features: [
      { label: "完整源代码", available: true },
      { label: "技术文档", available: true },
      { label: "SaaS应用授权", available: true },
      { label: "单个项目使用", available: true },
      { label: "一年技术支持", available: true },
      { label: "一年免费更新", available: true },
    ],
  },
  {
    title: "无限授权版",
    desc: "适用于无限个最终产品，最终用户需要付费。",
    amount: "3499",
    recommended: false,
    features: [
      { label: "完整源代码", available: true },
      { label: "技术文档", available: true },
      { label: "SaaS应用授权", available: true },
      { label: "无限项目使用", available: true },
      { label: "一年技术支持", available: true },
      { label: "一年免费更新", available: true },
    ],
  },
];
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
}

/* 页面容器 - 纯白色背景 */
.pricing-page {
  max-width: 1600px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 头部样式 - 现代化精简 */
.pricing-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.pricing-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 28px;
  font-weight: 400;
}

.pricing-tagline {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 72px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.free-tag {
  padding: 3px 10px;
  background-color: #f0f9ff;
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 16px;
}

/* 卡片容器 - 均匀分布 */
.pricing-cards {
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

/* 卡片样式 - 现代化轻盈感 */
.pricing-card {
  min-width: 280px;
  max-width: 320px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  padding: 36px 28px;
  box-sizing: border-box;
  text-align: left;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

/* 卡片hover效果 - 精致阴影 */
.pricing-card:hover {
  border-color: #e5e7eb;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

/* 推荐卡片高亮 - 差异化设计 */
.pricing-card.recommended {
  border-color: #e0efff;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.05);
  transform: translateY(-4px);
  z-index: 5;
}

/* 推荐徽章 - 简约风格 */
.recommended-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* 卡片顶部装饰 - 渐变线条 */
.card-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #e5e7eb, #f3f4f6);
}

.recommended-decoration {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

/* 卡片内容样式 - 层级清晰 */
.plan-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}

.plan-desc {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 32px;
  line-height: 1.5;
}

/* 价格样式 - 突出重点 */
.price {
  margin-bottom: 32px;
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  margin-right: 4px;
}

.amount {
  font-size: 2.8rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.03em;
}

.payment {
  font-size: 0.85rem;
  color: #6b7280;
  margin-left: 8px;
}

/* 功能列表 - 简洁清晰 */
.features {
  list-style: none;
  margin-bottom: 36px;
}

.features li {
  font-size: 0.85rem;
  color: #374151;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  line-height: 1.4;
}

/* 图标样式 - 现代化简洁 */
.icon.check {
  color: #10b981;
  margin-right: 10px;
  font-size: 1rem;
}

.icon.cross {
  color: #ef4444;
  margin-right: 10px;
  font-size: 1rem;
  opacity: 0.4;
}

/* 按钮样式 - 扁平化现代风 */
.buy-button {
  width: 100%;
  padding: 14px 0;
  background-color: #ffffff;
  color: #2563eb;
  border: 1.5px solid #2563eb;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  letter-spacing: 0.2px;
}

.buy-button:hover {
  background-color: #f9fafb;
  border-color: #1d4ed8;
}

/* 推荐按钮 - 渐变背景 */
.buy-button.recommended-btn {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.buy-button.recommended-btn:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.2);
}

/* 响应式调整 - 保持现代化质感 */
@media (max-width: 1200px) {
  .pricing-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .pricing-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .pricing-cards {
    grid-template-columns: 1fr;
  }

  .pricing-title {
    font-size: 1.8rem;
  }

  .pricing-page {
    padding: 60px 16px;
  }

  .pricing-card {
    padding: 30px 24px;
  }
}
</style>