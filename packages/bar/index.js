import Comp from './bar';

Comp.install = function (Vue) {
    Vue.component(Comp.name, Comp);
};
export default Comp;
