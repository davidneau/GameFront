module.exports = {
  pwa: {
    name: 'Mon App',
    themeColor: '#111111',
    msTileColor: '#111111',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'sw.js'
    }
  }
}