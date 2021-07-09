import Comp from './img-viewer';

Comp.install = function (Vue) {
    Vue.component(Comp.name, Comp);
};
export default Comp;
