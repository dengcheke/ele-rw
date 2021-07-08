module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: "commonjs",
                targets: "> 0.25%, not dead",
            }
        ]
    ],
    plugins: [
        "@vue/babel-plugin-transform-vue-jsx",
        [
            "@babel/plugin-transform-runtime",
            {
                corejs: 3,
                helpers: true,
            }
        ]
    ],
}
