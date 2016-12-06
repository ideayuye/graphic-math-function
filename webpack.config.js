
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, "build");
var nodemodulesPath = path.resolve(__dirname, 'node_modules');
var NODE_ENV = process.env.NODE_ENV;

var config = {
    //入口文件配置
    entry: path.resolve(__dirname, 'src/main.js'),
    resolve: {
        extentions: ["", "js"],//当requrie的模块找不到时，添加这些后缀
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devtool: 'eval',
    //文件导出的配置
    output: {
        path: buildPath,
        filename: "main.js"
    },
    
    module: {
        loaders: [
            {
                test: /\.scss$/, //正则表达式匹配 .js 和 .jsx 文件
                loader: 'style!css!sass!autoprefixer',//对匹配的文件进行处理的loader 
                exclude: [nodemodulesPath]//排除node module中的文件
            }
        ]
    }
}

if(NODE_ENV === "prod"){
    delete config.devtool;
    config.plugins = [
    //压缩打包的文件
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    })];
}

module.exports = config;

