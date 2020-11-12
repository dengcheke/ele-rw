<script>
export default {
    name: "EleRwRenderFunction",
    functional: true,
    props: {
        params: {
            default: null,
        },
        render: {
            type: Function,
            default: function () {
            }
        }
    },
    render: function (h, ctx) {
        const r = ctx.props.render;
        const p = ctx.props.params;
        return r.call(ctx.parent, h, p);
    }
}
</script>
