// 导入path模块
const path = require('path')

// 引入vue-loader插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'development',
    // 打包入口
    target: 'electron-renderer',
    entry: './src/main.js',
    devServer: {
        contentBase: './src/dist',
        open: false,
    },
    output: {
        filename: 'bundle.js',
        // 在当前目录的绝对路径下的dist目录
        path: path.resolve(__dirname, 'src/dist')
    },
    // 打包规则
    module: {
        rules: [{
            // 遇到.vue结尾的文件，用vue-loader打包
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.node$/,
            loader: 'node-loader',
        }, {
            test: /\.(jpg|jpeg|png|svg)$/,
            loader: 'file-loader'
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', {
                loader: 'less-loader', // compiles Less to CSS
                options: {
                    lessOptions: {
                        modifyVars: {
                            'primary-color': '#f08c8c',
                            'link-color': '#ee3f4d',
                            'border-radius-base': '0px',
                        },
                        javascriptEnabled: true,
                    },
                },
            }],
            // ...other rules
        }]
    },
    // 插件
    plugins: [
        // 实例化对象
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js' //内部为正则表达式  vue结尾的
        }
    }
}