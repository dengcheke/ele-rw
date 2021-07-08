const fs = require('fs');
const path = require('path');
//must be same as package.json {name}
//output require path is base on this name
const libName = require('./package.json').name;
const componentRoot = 'lib';
const externalRoot = `${libName}/${componentRoot}`;
const entries = {}, externals = {
    '@src/utils/dom': `${externalRoot}/utils/dom`,
    '@src/utils/index': `${externalRoot}/utils/index`,
    '@src/directives/v-mousewheel': `${externalRoot}/directives/v-mousewheel`,
    '@src/directives/v-transfer-dom': `${externalRoot}/directives/v-transfer-dom`,
};

const moduleList = fs.readdirSync(path.resolve(__dirname, './packages'));
moduleList.forEach(item => {
    const file = fs.statSync(path.resolve(__dirname, `./packages/${item}`));
    if (file.isDirectory()) {
        entries[item] = `./packages/${item}/index.js`;
        externals[`@packages/${item}/index`] = `${externalRoot}/${item}`
    }
});
console.log(entries);
module.exports = {
    entries, externals,
    componentRoot
}
