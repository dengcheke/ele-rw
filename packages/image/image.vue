<template>
    <div class="ele-rw-img" :class="['is-'+status]">
        <div v-if="isLoading" class="img__loading-wrapper">
            <slot name="loading">
                <div class="loading-icon iconfont icon-loading"/>
            </slot>
        </div>
        <div v-if="isError" class="img__error-wrapper">
            <slot name="error">
                <div class="error-msg">加载失败</div>
            </slot>
        </div>
        <img v-if="isLoaded" v-bind="$attrs"
             v-on="$listeners" :src="src" class="img__inner"/>
        <slot/>
    </div>
</template>

<script>
import {IntersectionObserver} from "@src/utils/dom";

const NONE = 'none', LOADING = 'loading', LOADED = 'loaded', ERROR = 'error';
export default {
    name: "CustomImg",
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
            token: 0,
            status: NONE,
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
            //设置为false,会清除已有的observer,若此时有图片未加载，则会立刻开始加载
            if (!lazy) {
                //移除已有的
                this._io && this._clearObserver();
                //图片还未加载
                this.status === NONE && this.src && this.load();
            }
        });
        const rm2 = this.$watch('src', (n, o) => {
            this.status = NONE; //重置状态
            if (this.lazy) { //懒加载
                this.$nextTick(() => {
                    this.initObserver()
                })
            } else {
                this.load();//否则直接加载
            }
        }, {immediate: true});
        this.$once("hook:beforeDestroy", () => {
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
            const io = this._io = new IntersectionObserver(entries => {
                const entry = entries[0];
                const intersect = entry.isIntersecting;
                if (intersect && this.status === NONE) {
                    this.$emit('is-show');
                    if (this.src) {
                        this.load().then(res => {
                            io.disconnect();
                            if (io === this._io) {
                                this._io = null;
                            }
                        })
                    }
                }
            }, {threshold: [this.ratio]})
            io.observe(el);
        },
        loadImage() {
            this.token++;
            return new Promise((resolve) => {
                const img = new Image(), src = this.src, token = this.token;
                img.onload = () => resolve({
                    token: token,
                    status: 'success'
                });
                img.onerror = () => resolve({
                    token: token,
                    status: 'error'
                });
                img.src = src;
            })
        },
        async load() {
            this.status = LOADING;
            const {token, status} = await this.loadImage();
            //src 变更后,视为新请求，比较token
            if (token !== this.token) return;
            if (status === 'error') {
                this.status = ERROR;
                this.$emit('status-change', 'error');
            } else {
                this.status = LOADED;
                //make sure <img> is created ( not lazy and not visible)
                this.$nextTick(() => {
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
@import "/src/font/iconfont.css";

.ele-rw-img {
    display: inline-block;
    vertical-align: middle;
    background-color: white;
    position: relative;
    overflow: hidden;
    &.is-loaded {
        background-color: transparent;
    }

    .img__inner {
        width: 100%;
        height: 100%;
        display: block;
    }

    .img__loading-wrapper,
    .img__error-wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loading-icon {
        font-size: 32px;
        display: inline-block;
        vertical-align: bottom;
        animation: loading-rotate 2s linear infinite;
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
