<template>
    <div class="code-panel" style="width: 100%;">
        <h3 class="code-switch" @click="showCode=!showCode">显示代码</h3>
        <div class="code" v-show="showCode">
            <slot/>
        </div>
    </div>
</template>
<script>
export default {
    name: 'codePanel',
    data() {
        return {
            showCode: false,
        }
    }
}
</script>
