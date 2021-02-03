export default {
    name: 'RouterLink',
    props: {
        to: {
            type: String,
            required: true
        },
        tag: {
            type: String
        }
    },
    render(h, context) {
        const tag = this.tag || 'a';
        const clickHandler = () => {
            context.parent.$router.push(context.props.to);
        };
        return h(tag, {
            on: {
                click: clickHandler
            }
        }, this.$slots.default);
    },
};