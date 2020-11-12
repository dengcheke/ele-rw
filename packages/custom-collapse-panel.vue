<template>
    <div class="collapse-panel__wrapper">
        <div class="collapse-panel__title" @click.stop="onClickRow" onselectstart="return false;">
            <slot name="title">
                <span style="line-height: 32px">{{ title }}</span>
            </slot>
            <i class="el-icon-d-arrow-right" v-if="showIcon"
               @click.stop="$emit('update:expand',!expand)"
               :class="{'is-collapse':!expand}"></i>
        </div>
        <div class="collapse-panel__content">
            <collapse-transition>
                <div v-show="expand" class="collapse-content__wrapper" style="overflow:hidden;">
                    <slot/>
                </div>
            </collapse-transition>
        </div>
    </div>
</template>

<script>
import CollapseTransition from '@comp/base/common/collapase-transition';

export default {
    name: "custom-collapse-content",
    components: {CollapseTransition},
    props: {
        expandOnClickTitle: {
            type: Boolean,
            default: true
        },
        showIcon: {
            type: Boolean,
            default: true,
        },
        expand: {
            type: Boolean,
            default: true
        },
        title: {
            default: ""
        }
    },
    methods: {
        onClickRow() {
            this.expandOnClickTitle && this.$emit('update:expand', !this.expand);
        }
    }
}
</script>

<style lang="less">
.collapse-panel__wrapper {
    width: 100%;

    .collapse-panel__title {
        padding: 0 5px;
        background-image: linear-gradient(to right, rgba(13, 67, 91, 1) 0, rgba(13, 67, 91, .3));
        font-size: 15px;
        font-weight: 700;
        display: flex;
        align-items: center;
    }

    .el-icon-d-arrow-right {
        cursor: pointer;
        color: yellow;
        font-size: 20px;
        margin-left: auto;
        transform: rotate(-90deg);
        text-shadow: yellow 0 0 5px;
        transition: transform 0.5s ease-in-out;

        &.is-collapse {
            transform: rotate(90deg);
        }
    }
}
</style>