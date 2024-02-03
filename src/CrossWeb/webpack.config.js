const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
   entry: './wwwroot/js/site.js',
   output: {
      path: path.resolve(__dirname, 'wwwroot/dist'),
      filename: 'bundle.js'
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader'
            }
         },
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
         }
      ]
   },
   plugins: [
      new MiniCssExtractPlugin({
         filename: 'bundle.css'
      })
   ]
};
