<template>
    <div class="ele-rw-empty-slot" v-show="show">
        <slot>
            <i class="el-icon-s-data default-icon"/>
            <span class="default-text">暂无数据</span>
        </slot>
    </div>
</template>

<script>
export default {
    name: "EleRwEmptySlot",
    props: {
        show: {
            type: Boolean,
            default: true
        },
    }
}
</script>
<style lang="less">
.ele-rw-empty-slot {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .default-icon {
        font-size: 24px;
    }

    .default-text {
        font-size: 15px;
        margin-left: 5px;
    }
}

</style>
