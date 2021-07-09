import Comp from './image';

Comp.install = function (Vue) {
    Vue.component(Comp.name, Comp);
};
export default Comp;
