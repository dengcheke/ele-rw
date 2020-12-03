<template>
    <div class="app">
        <aside>
            <scroll-bar :view-style="{paddingRight:'15px',paddingBottom:'15px'}">
                <div v-for="item in list" @click="curComp=item.comp" class="item"
                     :class="{'is-current':item.comp===curComp}">
                    {{ item.label }}
                </div>
            </scroll-bar>
        </aside>
        <main>
            <scroll-bar :view-style="{paddingRight:'15px',paddingBottom:'15px'}">
                <component :is="curComp"/>
            </scroll-bar>
        </main>
    </div>
</template>

<script>
import Base from './components/table/base';
import ColWidth from './components/table/col-width';
import Style from './components/table/style-border';
export default {
    name: "app",
    data() {
        return {
            curComp: Style,
            list: [
                {label: '基础', comp: Base},
                {label: '列宽固定与适应', comp: ColWidth},
                {label: '样式与边框',comp:Style}
            ]
        }
    }
}
</script>
<style lang="less">
.app {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: stretch;
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
}

aside {
    padding: 20px 5px 5px 20px;
    width: 250px;

    .item {
        background-color: rgba(0, 0, 0, .1);
        padding: 10px;

        &:hover, &.is-current {
            background-color: #00b0e8;
        }
    }
}

main {
    flex: 1;
    padding: 20px 5px 5px 20px;
    overflow: auto;
}

.demo-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    min-width: 800px;
}

.code-switch {
    text-align: center;
    color: #04bffe;
    cursor: pointer;
}

p {
    letter-spacing: 1px
}

p.tip {
    height: 42px;
    line-height: 42px;
    position: relative;
    padding-left: 2em;
    font-size: 18px;
    background-color: #f8f8f8;

    &:before {
        position: absolute;
        content: "";
        top: 0;
        bottom: 0;
        left: 0;
        background-color: #00b0e8;
        width: 4px;
    }
}

code {
    font-size: 16px;
    font-family: Consolas;
}

.btn{
    padding: 6px 12px;
    background-color: #00b0e8;
    margin-right: 12px;
}
</style>
