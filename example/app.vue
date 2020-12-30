<template>
    <div class="app">
        <aside>
            <scroll-bar :view-style="{paddingRight:'15px',paddingBottom:'15px'}">
                <div v-for="item in list" @click="goto(item)" class="item"
                     :class="{'is-current':item.comp===curComp}">
                    {{ item.label }}
                </div>
            </scroll-bar>
        </aside>
        <main>
            <scroll-bar :view-style="{paddingRight:'15px',paddingBottom:'15px'}">
                <router-view/>
            </scroll-bar>
        </main>
    </div>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            curComp:null,
            list: [
                {label: '基础', comp: '1'},
                {label: '列宽固定与适应', comp: '2'},
                {label: '布局', comp: '3'},
                {label: '样式与边框', comp: '4'},
                {label: '单元格样式', comp: '5'},
                {label: '固定列', comp: '6'},
                {label: '多级表头',comp:'7'},
                {label: '自定义渲染',comp:'8'},
                {label: '勾选和展开',comp:'9'},
                {label: '树形展开',comp:'10'},
                {label: '追加行',comp:'11'},
            ]
        }
    },
    methods:{
        goto(item){
            this.curComp=item.comp;
            this.$router.push('/table/'+item.comp);
        }
    },
    watch:{
        $route:{
            handler:function(to, from){
                this.curComp = to.path.split(`/`)[2]
            },
            immediate:true
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

.btn {
    padding: 6px 12px;
    background-color: #00b0e8;
    margin-right: 12px;
}
</style>
