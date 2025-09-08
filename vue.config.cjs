const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        // 全局引入变量和 mixin
        additionalData: `
          @import '@/assets/scss/variable.scss';
          @import '@/assets/scss/mixin.scss';
        `,
      },
    },
  },
})
