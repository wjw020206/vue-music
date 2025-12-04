const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        // 引入全局变量和 mixin
        additionalData: `
          @use "@/assets/scss/variable.scss" as *;
          @use "@/assets/scss/mixin.scss" as *;
        `
      }
    }
  }
})
