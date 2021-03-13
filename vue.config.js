
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  //放置生成的静态资源 (js、css、img、fonts) 的目录
  assetsDir: 'static',
  //指定生成的 index.html 的输出路径
  indexPath: 'index.html',
  //去除map
  productionSourceMap:false,
  devServer: {
    port: 5277,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5244',
    //     changeOrigin: true,
    //     // pathRewrite:{
    //     //   '^/api':''
    //     // }
    //   }
    // }
  }
}