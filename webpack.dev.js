const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        app: path.resolve(__dirname, './test/main.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json','.jsx'],
        alias: {
            '@src': path.resolve(__dirname, './src'),
            '@lib': path.resolve(__dirname, './lib'),
            'ele-rw-ui': path.resolve(__dirname, './')
        }
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: [/lib/, /node_modules/],
                loader: 'babel-loader',
            },
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
    devServer: {
        port: 8888,
    },
    plugins: [
        new VueLoaderPlugin(),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './test/index.html'),
            title: 'Output Management'
        })
    ]
}
