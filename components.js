const fs = require('fs');
const path = require('path');
const entries = {
    'scrollbar': './packages/custom-scrollbar'
}, externals = {
    '@src/utils/dom': 'ele-rw-ui/lib/utils/dom',
    '@src/utils/index': 'ele-rw-ui/lib/utils/index',
    '@src/directives/v-mousewheel': 'ele-rw-ui/lib/directives/v-mousewheel',
    '@src/directives/v-transfer-dom': 'ele-rw-ui/lib/directives/v-transfer-dom',
    '@packages/render-function': 'ele-rw-ui/lib/render-function',
    '@packages/bar': 'ele-rw-ui/lib/bar',
    '@packages/custom-scrollbar': 'ele-rw-ui/lib/scrollbar',
    '@packages/collapse-transition': 'ele-rw-ui/lib/collapse-transition'
};

const moduleList = fs.readdirSync(path.resolve(__dirname, './packages'));
moduleList.forEach(item => {
    const file = fs.statSync(path.resolve(__dirname, `./packages/${item}`));
    if (file.isDirectory()) {
        entries[item] = `./packages/${item}/index.js`;
        externals[`@packages/${item}/index`] = `ele-rw-ui/lib/${item}`
    }
});
console.log(entries);
module.exports = {
    entries, externals
}
