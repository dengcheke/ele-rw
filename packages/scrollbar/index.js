import Comp from './scrollbar';

Comp.install = function (Vue) {
    Vue.component(Comp.name, Comp);
};
export default Comp;
