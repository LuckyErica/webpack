const path = require('path');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin'); //压缩js代码
const htmlPlugin = require('html-webpack-plugin'); //html分离
const extractTextPlugin = require('extract-text-webpack-plugin');  //css分离
//html-withimg-loader  // 解决引入的img标签

// 安装PurifyCSS-webpack 消除不用的css
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");

// 打包静态资源文件
const copyWebpackPlugin= require("copy-webpack-plugin");
// var website = {
//     publicPath: 'http://192.168.0.155:1717/'
// }

console.log(encodeURIComponent(process.env.type));
if (process.env.type == "build") {
    var website = {
        publicPath: "http://192.168.0.159:1717/"
    }
} else {
    var website = {
        publicPath: "http://192.168.0.159:1717/"
    }
}
module.exports = {
    devtool: 'source-map',  //便于调试
    //入口文件的配置项
    entry: {
        entry: './src/main.js',
        entry2: './src/main2.js',
        jquery:'jquery'
    },
    //出口文件的配置项
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: website.publicPath  //在所有的静态文件前面添加
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module: {
        rules: [
            {
                test: /\.css$/,
                // use: [ 'style-loader', 'css-loader' ]  // use可以写成loader
                // use: [
                //     { loader: "style-loader" },
                //     { loader: "css-loader" }
                // ]
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        { loader: "css-loader", options: { importLoaders: 1 } },
                        'postcss-loader'
                    ],
                })
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [
                    { loader: 'url-loader', options: { limit: 500, outputPath: 'images/' } }
                    // {loader:'file-loader',options:{limit:500000}}
                ]
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            {  //兼容es6语法
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            }
        ]
    },
    //插件，用于生产模版和各项功能
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     //name对应入口文件中的名字，我们起的是jQuery
        //     name:['jquery','vue'],
        //     //把文件打包到哪里，是一个路径
        //     filename:"assets/js/[name].js",
        //     //最小打包的文件模块数，这里直接写2就好
        //     minChunks:2
        // }),
        new uglify(),
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true //去掉属性的引号
            },
            hash: true,  //每次产生不同的字符串，避免缓存
            template: './src/index.html'
        }),
        new extractTextPlugin("css/index.css"),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        new webpack.BannerPlugin('wanxuemei'),  //打包后的注释
        new copyWebpackPlugin([{
            from:__dirname+'/src/public',
            to:'./public'
        }]),
        new webpack.HotModuleReplacementPlugin() //热加载
    ],
    //配置webpack开发服务功能
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: '192.168.0.159',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 1717
    }
    ,watchOptions:{
        //检测修改的时间，以毫秒为单位
        poll:1000, 
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout:500, 
        //不监听的目录
        ignored:/node_modules/
    }
}