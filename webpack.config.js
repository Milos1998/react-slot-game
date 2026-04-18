const path= require('path')
const CopyPlugin= require('copy-webpack-plugin')

module.exports= (env, argv) =>{
  return {
    stats: 'minimal',
    entry: "./src/app.ts",
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'docs'),
    },
    devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/index.html', to: './' },
          { from: 'src/style.css', to: './' },
          { from: 'assets', to: './assets' }
        ]
      }),
    ],
    module: {
      rules:[
        {
          test: /\.ts$/,
          use: 'ts-loader',
          include:[path.resolve(__dirname, 'src')]
        }
      ]
    },
    resolve:{
      extensions: ['.ts', '.js']
    }
  }
}
