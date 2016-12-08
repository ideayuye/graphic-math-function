
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
            'vue$': 'vue/dist/vue.js'
        }
    },
    devtool: '#eval-source-map',
    //文件导出的配置
    output: {
        path: buildPath,
        filename: "[name].js"
    },
    
    module: {
        loaders: [
            {
                test: /\.scss$/, //正则表达式匹配 .js 和 .jsx 文件
                loader: 'style!css!sass!autoprefixer',//对匹配的文件进行处理的loader 
                exclude: [nodemodulesPath]//排除node module中的文件
            },
            {
                test:/\.vue$/,
                loader:'vue',
                exclude: [nodemodulesPath]
            }
        ]
    }
}

if(NODE_ENV === "test"){
    config.entry = path.resolve(__dirname, 'test/test.js');
    var testBuildPath = path.resolve(__dirname, "test/build");
    config.output = {
        path: testBuildPath,
        filename: 'testBundle.js'
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

