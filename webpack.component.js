const path = require('path');
const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {entries, externals, componentRoot} = require('./components');

module.exports = {
    mode: 'production',
    entry: entries,
    output: {
        path: path.resolve(__dirname, componentRoot),
        publicPath: '/',
        filename: '[name].js',
        library: {
            type: "commonjs2"
        }
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@src': path.resolve(__dirname, './src'),
            '@lib': path.resolve(__dirname, './lib'),
            '@packages': path.resolve(__dirname, './packages'),
        },
        modules: ['node_modules']
    },
    externals: [
        nodeExternals(),
        {
            vue: {
                root: 'Vue',
                commonjs: 'vue',
                commonjs2: 'vue',
                amd: 'vue'
            },
            ...externals
        }
    ],
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                loader: 'babel-loader',
                include: process.cwd(),
                exclude: [/\/node_modules\//]
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
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        }),
        new VueLoaderPlugin()
    ]
}
