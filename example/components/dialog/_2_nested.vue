<template>
    <div>
        <p class="tip">dialog可以嵌套</p>
        <div style="margin-bottom: 10px;position: fixed;z-index: 99999;right: 20px;padding: 10px;
            top:50px;background-color: #9a6e3a;display: flex;flex-direction: column">
            <span class="btn" :class='{active:appendToBody1}'
                  @click="appendToBody1=!appendToBody1">切换1appendToBody</span>
            <span class="btn" :class='{active:shadow1}' @click="shadow1=!shadow1">切换1shadow</span>
            <span class="btn" :class='{active:show1}' @click="show1=!show1">切换1show</span>
            <span class="btn" :class='{active:fullScreen1}' @click="fullScreen1=!fullScreen1">切换1全屏</span>
            <div style="height: 20px"></div>
            <span class="btn" :class='{active:appendToBody2}'
                  @click="appendToBody2=!appendToBody2">切换2appendToBody</span>
            <span class="btn" :class='{active:shadow2}' @click="shadow2=!shadow2">切换2shadow</span>
            <span class="btn" :class='{active:show2}' @click="show2=!show2">切换2show</span>
            <span class="btn" :class='{active:fullScreen2}' @click="fullScreen2=!fullScreen2">切换2全屏</span>
        </div>
        <div style="width: 100%;height: 800px;position: relative;border: 1px solid black">
            <ele-rw-dialog :append-to-body="appendToBody1" :class-list="['outer']"
                           :shadow="shadow1" :show.sync="show1" :width="700" :height="500"
                           :full-screen="fullScreen1">
                <template #title>
                    <div style="height: 40px;text-align: center;background-color: #01a3a3">我是头部1111</div>
                </template>
                <template>
                    <div style="height:100%;background-color: #DD4A68;position: relative">
                        <div>我是dialog111111</div>
                        <ele-rw-dialog :append-to-body="appendToBody2" :class-list="['inner']"
                                       :width="200" :height="200"
                                       :shadow="shadow2" :show.sync="show2"
                                       :full-screen="fullScreen2">
                            <template #title>
                                <div style="height: 40px;text-align: center;background-color: #01a3a3">我是头部2222</div>
                            </template>
                            <template>
                                我是dialog22222
                            </template>
                        </ele-rw-dialog>
                    </div>
                </template>
            </ele-rw-dialog>
        </div>
        <code-panel>
            <highlightjs language='javascript' :code="code"/>
        </code-panel>
    </div>
</template>

<script>
const code = ``
export default {
    name: "dialog_nested",
    data() {
        return {
            appendToBody1: false,
            shadow1: false,
            show1: true,
            fullScreen1: false,

            appendToBody2: false,
            shadow2: false,
            show2: true,
            fullScreen2: false,
            code: code
        }
    }
}
</script>

<style scoped lang="less">
.btn {
    margin-right: 0;
    margin-bottom: 10px;
}

/deep/ .close-icon {
    display: block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    position: absolute;
    right: 0;
    top: 0;
    cursor: auto;
}

/deep/ .ele-rw-dialog.outer {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .dialog__content {
        flex-grow: 1;
    }
}

/deep/ .ele-rw-dialog.inner {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .dialog__content {
        flex-grow: 1;
        background-color: #0E9A00;
    }
}
</style>
