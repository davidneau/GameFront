const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/', 

  pwa: {
    name: 'Mon App Vue',
    themeColor: '#42b883',
    msTileColor: '#000000',
    manifestOptions: {
      background_color: '#ffffff'
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
})
