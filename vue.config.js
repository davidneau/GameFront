module.exports = {
  pwa: {
    name: 'Overkiller Games',
    themeColor: '#111111',
    msTileColor: '#111111',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      exclude: [
        /_headers$/,
        /_redirects$/,
        /\.map$/
      ]
    }
  }
}