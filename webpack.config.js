const path = require('path');
const uglify = require('uglifyjs-webpack-plugin'); //压缩js代码
const htmlPlugin = require('html-webpack-plugin'); //html分离
const extractTextPlugin = require('extract-text-webpack-plugin');  //css分离
//html-withimg-loader  // 解决引入的img标签

var website = {
    publicPath:'http://192.168.0.153:1717/'
}
module.exports = {
    //入口文件的配置项
    entry: {
        entry: './src/main.js',
        entry2: './src/main2.js'
    },
    //出口文件的配置项
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath:website.publicPath  //在所有的静态文件前面添加
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
                    use: "css-loader"
                  })
            },
            {
                test:/\.(png|jpg|gif)/,
                use:[
                    {loader:'url-loader',options:{limit:500, outputPath:'images/'}}
                    // {loader:'file-loader',options:{limit:500000}}
                ]
            },
            {
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'] 
            }
        ]
    },
    //插件，用于生产模版和各项功能
    plugins: [
        new uglify(),
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true //去掉属性的引号
            },
            hash:true,  //每次产生不同的字符串，避免缓存
            template:'./src/index.html'
        }),
        new extractTextPlugin("css/index.css")
    ],
    //配置webpack开发服务功能
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: '192.168.0.153',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 1717
    }
}