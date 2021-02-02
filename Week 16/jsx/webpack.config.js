const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        'main':"./src/main.js",
        'animation-demo': "./src/animation-demo.js",
        'gesture-demo': "./src/gesture-demo.js",
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './dist',
    },
    mode: "development",
    module:{
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            ["@babel/plugin-transform-react-jsx", {
                                pragma: "createElement"
                            }]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({
            title: 'jsx',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            filename: 'animation-demo.html',
            template: 'template/animation-demo.html',
            chunks: ['animation-demo']
        }),
        new HtmlWebpackPlugin({
            filename: 'gesture-demo.html',
            template: 'template/gesture-demo.html',
            chunks: ['gesture-demo']
        }),
    ]
};