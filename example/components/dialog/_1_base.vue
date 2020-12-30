<template>
    <div>
        <p class="tip">
            dialog 分为 title,body,footer,对应三个slot,
        </p>
        <p> appendToBody: 是否添加到body下</p>
        <p> shadow: 设置是否显示遮罩</p>
        <p> show: 是否显示</p>
        <p> keepPosition: 是否保持拖拽后的位置,切换显示时,默认会出现在中间</p>
        <p> draggable: 是否开启拖拽,仅title部分可拖拽</p>
        <p> fullScreen: 是否全屏</p>
        <div style="margin-bottom: 10px">
            <span class="btn" :class='{active:appendToBody}' @click="appendToBody=!appendToBody">切换appendToBody</span>
            <span class="btn" :class='{active:shadow}' @click="shadow=!shadow">切换shadow</span>
            <span class="btn" :class='{active:show}' @click="show=!show">切换show</span>
            <span class="btn" :class='{active:keepPosition}' @click="keepPosition=!keepPosition">切换keepPosition</span>
            <span class="btn" :class='{active:draggable}' @click="draggable=!draggable">切换draggable</span>
            <span class="btn" :class='{active:fullScreen}' @click="fullScreen=!fullScreen">切换全屏</span>
        </div>
        <p>dialog没有appendToBody时,提供一个外层定位容器，否则位置会偏差</p>
        <div style="width: 800px;height: 500px;position: relative;border: 1px solid black">
            <ele-rw-dialog :append-to-body="appendToBody"
                           :shadow="shadow" :show.sync="show"
                           :draggable="draggable" :full-screen="fullScreen"
                           :keepPosition="keepPosition">
                <template #title>
                    <div style="height: 40px;text-align: center;background-color: #01a3a3">我是头部</div>
                    <div class="close-icon" @click="show=false">X</div>
                </template>
                <template>
                    <div style="height:100%;background-color: #DD4A68">
                        我是内容 ,
                        <div style="background-color: white;margin-bottom: 10px;width: 150px"
                             @click="appendToBody=!appendToBody">
                            切换appendToBody
                        </div>
                        <div style="background-color: yellow;width: 150px" @click="fullScreen=!fullScreen">
                            切换fullScreen
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div style="height: 40px;text-align: center;background-color: green">我是尾部</div>
                </template>
            </ele-rw-dialog>
        </div>
        <code-panel>
            <highlightjs language='javascript' :code="code"/>
        </code-panel>
    </div>
</template>

<script>
const code = `
            <template>
                <div style="margin-bottom: 10px">
                    <span class="btn" :class='{active:appendToBody}' @click="appendToBody=!appendToBody">切换appendToBody</span>
                    <span class="btn" :class='{active:shadow}' @click="shadow=!shadow">切换shadow</span>
                    <span class="btn" :class='{active:show}' @click="show=!show">切换show</span>
                    <span class="btn" :class='{active:keepPosition}' @click="keepPosition=!keepPosition">切换keepPosition</span>
                    <span class="btn" :class='{active:draggable}' @click="draggable=!draggable">切换draggable</span>
                    <span class="btn" :class='{active:fullScreen}' @click="fullScreen=!fullScreen">切换全屏</span>
                </div>
                <p>dialog没有appendToBody时,提供一个外层定位容器，否则位置会偏差</p>
                <div style="width: 800px;height: 500px;position: relative;border: 1px solid black">
                    <ele-rw-dialog :append-to-body="appendToBody"
                                   :shadow="shadow" :show.sync="show"
                                   :draggable="draggable" :full-screen="fullScreen"
                                   :keepPosition="keepPosition">
                        <template #title>
                            <div style="height: 40px;text-align: center;background-color: #01a3a3">我是头部</div>
                            <div class="close-icon" @click="show=false">X</div>
                        </template>
                        <template>
                            <div style="height:100%;background-color: #DD4A68">
                                我是内容 ,
                                <div style="background-color: white;margin-bottom: 10px;width: 150px"
                                     @click="appendToBody=!appendToBody">
                                    切换appendToBody
                                </div>
                                <div style="background-color: yellow;width: 150px" @click="fullScreen=!fullScreen">
                                    切换fullScreen
                                </div>
                            </div>
                        </template>
                        <template #footer>
                            <div style="height: 40px;text-align: center;background-color: green">我是尾部</div>
                        </template>
                    </ele-rw-dialog>
                </div>
            <\/template>
            <script>
                export default {
                    name: "dialog_base",
                    data() {
                        return {
                            appendToBody: false,
                            shadow: false,
                            show: true,
                            keepPosition: true,
                            draggable: true,
                            fullScreen: false
                        }
                    }
                }
            <\/script>
            <style  lang="less">
                .close-icon {
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

                .ele-rw-dialog {
                    .dialog__content {
                        height: 300px;
                    }

                    &.full-screen {
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;

                        .dialog__content {
                            flex-grow: 1;
                        }
                    }
                }
            <\/style>`
export default {
    name: "dialog_base",
    data() {
        return {
            appendToBody: false,
            shadow: false,
            show: true,
            keepPosition: true,
            draggable: true,
            fullScreen: false,
            code:code
        }
    }
}
</script>

<style scoped lang="less">
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

/deep/ .ele-rw-dialog {
    .dialog__content {
        height: 300px;
    }

    &.full-screen {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        .dialog__content {
            flex-grow: 1;
        }
    }
}
</style>
