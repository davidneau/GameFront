module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      exclude: [
        /_redirects$/,
        /_headers$/,
        /\.map$/
      ]
    }
  }
}