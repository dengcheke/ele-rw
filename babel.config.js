module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": "commonjs",
            }
        ]
    ],
    "plugins": [
        "@vue/babel-plugin-transform-vue-jsx"
    ],
    "env": {
        "utils": {
            "presets": [
                [
                    "@babel/preset-env",
                    {
                        "loose": true,
                        "modules": "commonjs",
                    }
                ]
            ]
        }
    }
}
