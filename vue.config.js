module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      exclude: [
        /_redirects$/,
        /_headers$/,
        /\.map$/
      ]
    }
  }
}