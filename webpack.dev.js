const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        app: path.resolve(__dirname, './example/main.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.jsx'],
        alias: {
            '@src': path.resolve(__dirname, './src'),
            '@lib': path.resolve(__dirname, './lib'),
            '@packages':path.resolve(__dirname,'./packages'),
            'ele-rw-ui': path.resolve(__dirname, './')
        }
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.m?jsx?$/,
                include: [
                    path.resolve(__dirname, 'node_modules/highlight.js/lib'),
                    path.resolve(__dirname, 'packages'),
                    path.resolve(__dirname, 'example/components')
                ],
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 4096,
                        name: path.posix.join('static', '[name].[hash:8].[ext]')
                    }
                }],
            }
        ]
    },
    optimization:{
        splitChunks:{
            chunks: "all",
            cacheGroups:{
                hljs:{
                    name: 'hljs',
                    minChunks: 1,
                    test: function (module) {
                        if (module.resource) {
                            const path = module.resource;
                            return /[\\/]node_modules[\\/]highlight\.js[\\/]/.test(path)
                        } else {
                            return false;
                        }
                    },
                    priority: 3,
                }
            }
        }
    },
    devServer: {
        port: 8888,
    },
    plugins: [
        new VueLoaderPlugin(),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './example/index.html'),
            title: 'Output Management'
        })
    ]
}
