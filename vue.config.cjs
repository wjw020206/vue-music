const registerRouter = require('./backend/router.cjs')
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
        `,
      },
    },
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }

      registerRouter(devServer.app)

      return middlewares
    },
  },
  // 生产环境不生成 SourceMap
  productionSourceMap: false,
  // 根据实际部署域名的路径来配置
  publicPath: process.env.NODE_ENV === 'production' ? '/music-next/' : '/',
})
