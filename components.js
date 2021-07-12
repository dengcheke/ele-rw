const fs = require('fs');
const path = require('path');
const componentRoot = 'lib';
const entries = {

}, externals = {
    '@src/utils/dom': `./utils/dom.js`,
    '@src/utils/index': `./utils/index.js`,
    '@src/directives/v-mousewheel': `./directives/v-mousewheel.js`,
    '@src/directives/v-transfer-dom': `./directives/v-transfer-dom.js`
};

const moduleList = fs.readdirSync(path.resolve(__dirname, './packages'));
moduleList.forEach(item => {
    const file = fs.statSync(path.resolve(__dirname, `./packages/${item}`));
    if (file.isDirectory()) {
        entries[item] = `./packages/${item}/index.js`;
        externals[`@packages/${item}/index`] = `./${item}.js`
        externals[`@packages/${item}`] = `./${item}.js`
    }
});
console.log(entries);
console.log(externals)
module.exports = {
    entries, externals,
    componentRoot
}
