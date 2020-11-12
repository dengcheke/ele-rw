<template>
    <div class="scroll-text" :style="{padding:`0 ${padding}px`}">
        <div class="scroll-groove" :title="msg">
            <div class="text" ref="msg">{{msg}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "scroll-text",
        props: {
            msg: {
                default: ""
            },
            speed:{
                type:Number,
                default:1.2
            },
            padding:{
                type:Number,
                default:20
            }
        },
        data() {
            return {
                timer: 0,
            }
        },
        methods: {
            beginScroll() {
                const msg = this.$refs.msg, self = this;
                const pw = msg.parentElement.offsetWidth;
                const w = msg.offsetWidth, padding = 20;
                const realW = w + 2 * padding; //加上左右两边间隔的真实长度
                //初始化位置到最右边
                msg.style.transform = `translateX(${pw + padding}px)`;
                let runpx = 0;
                this.timer = step();

                function step() {
                    runpx += self.speed; //滑过总距离
                    if (runpx > realW + pw) {
                        runpx = 0;
                    }
                    msg.style.transform = `translateX(${pw + padding - runpx}px)`;
                    self.timer = requestAnimationFrame(step);
                }
            },
        },
        watch: {
            msg: {
                handler: function (msg) {
                    if (msg) {
                        this.$nextTick(() => {
                            this.beginScroll();
                        })
                    } else {
                        if (this.timer) {
                            cancelAnimationFrame(this.timer);
                            this.timer = 0;
                        }
                    }
                }
            }
        },
        beforeDestroy(){
            this.timer && cancelAnimationFrame(this.timer);
        }
    }
</script>

<style lang="less">
    .scroll-text {
        background-color: rgba(0, 32, 50, .7);
        height: 100%;
        .scroll-groove{
            height: 100%;
            overflow: hidden;
            position: relative;
        }
        .text{
            color: rgba(107, 203, 233, 1);
            position: absolute;
            line-height: 32px;
            white-space: nowrap;
        }
    }
</style>
