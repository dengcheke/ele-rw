<template>
    <div class="custom-img" :class="['is-'+status]">
        <div v-if="isLoading" class="img__loading-wrapper">
            <slot name="loading">
                <div class="loading-icon"/>
            </slot>
        </div>
        <div v-if="isError" class="img__error-wrapper">
            <slot name="error">
                <div class="error-msg">加载失败</div>
            </slot>
        </div>
        <img v-if="isLoaded" v-bind="$attrs"
             v-on="$listeners" :src="src" class="img__inner"/>
        <slot></slot>
    </div>
</template>

<script>
import {IntersectionObserver} from "../src/utils/dom";
import {asyncWrap} from "../src/utils/index";
import {HOOK_BEFOREDESTROY} from "@config/global-const";

const NONE = 'none', LOADING = 'loading', LOADED = 'loaded', ERROR = 'error';
export default {
    name: "custom-image",
    props: {
        src: String,
        lazy: {
            type: Boolean,
            default: true
        },
        ratio: {
            type: Number,
            default: 0.5
        }
    },
    inheritAttrs: false,
    data() {
        return {
            token: 0,//标记，当前请求的flag, 判断是否是当前请求
            status: NONE,
            visible: null, //可见状态
        }
    },
    computed: {
        isLoading() {
            return this.status === LOADING
        },
        isLoaded() {
            return this.status === LOADED
        },
        isError() {
            return this.status === ERROR
        },
    },
    mounted() {
        const rm1 = this.$watch('lazy', (lazy) => {
            //设置lazy不会主动创建observer, lazy在src变更时才会生效
            //设置为false,会清除已有的observer,若此时有图片未加载，则会立刻开始加载,若已加载完成，则保持状态
            if (!lazy && this._io) {
                this._clearObserver();
                if (this.status === NONE) {
                    this.load();
                }
            }
        });
        const rm2 = this.$watch('src', (n,o) => {
            // src变化, 切换图片
            // 即便src不存在，也需要监听，
            // 因为可能src是动态获取的,可见的时候才获取，src有有效期，提前获取过期后可见则加载会失败
            this.status = NONE; //重置状态
            if (this.lazy) { //懒加载
                requestAnimationFrame(() => {
                    this.initObserver(); //开一个观察者
                })
            } else {
                this.load();//否则直接加载
            }
        }, {immediate: true});
        this.$once(HOOK_BEFOREDESTROY, () => {
            rm1 && rm1();
            rm2 && rm2();
        })
    },
    methods: {
        _clearObserver() {
            if (this._io) {
                this._io.disconnect();
                this._io = null;
            }
        },
        initObserver() {
            this._clearObserver();//清除之前的
            const el = this.$el;
            const io = this._io = new IntersectionObserver(async (entries) => {
                const entry = entries[0];
                const intersect = entry.isIntersecting;
                if (intersect && this.status === NONE) {
                    this.$emit('is-show');
                    if(this.src){
                        await this.load();//加载完后，无论成功还是失败，状态确定，无需在观测
                        io.disconnect();
                        if (io === this._io) {
                            this._io = null;
                        }
                    }
                }
            }, {threshold: [this.ratio]})
            io.observe(el);
        },
        loadImage() {
            this.token++;
            return new Promise((res, rej) => {
                const img = new Image(), src = this.src, token = this.token;
                img.onload = () => res({
                    token: token
                });
                img.onerror = () => rej({
                    token: token
                });
                img.src = src;
            })
        },
        async load() {
            this.status = LOADING;
            const [result, err] = await asyncWrap(this.loadImage());
            //src 变更后,视为新请求，比较token
            if (err && err.token === this.token) {
                this.status = ERROR;
                this.$emit('status-change', 'error');
            } else if (result && result.token === this.token) {
                this.status = LOADED;
                //make sure <img> is created
                this.$nextTick(()=>{
                    this.$emit('status-change', 'success');
                })
            }
        }
    },
    beforeDestroy() {
        this._clearObserver();
    }
}
</script>

<style lang="less">
.custom-img {
    display: inline-block;
    vertical-align: middle;
    background-color: white;

    &.is-loaded {
        background-color: transparent;
    }

    .img__loading-wrapper,
    .img__error-wrapper,
    .img__inner {
        width: 100%;
        height: 100%;
    }

    .img__loading-wrapper,
    .img__error-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loading-icon {
        width: 100%;
        height: 100%;
        max-width: 30px;
        max-height: 30px;
        background-size: 100% 100%;
        background-image: url("~@assets/img/loading_blue.png");
        animation: loading-rotate 1s linear infinite;
        @keyframes loading-rotate {
            0% {
                transform: rotate(0deg)
            }
            100% {
                transform: rotate(360deg)
            }
        }
    }

    .error-msg {
        color: black;
    }
}
</style>
