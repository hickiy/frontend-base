import { ElForm } from 'element-plus';
export default {
  name: 'ElForm',
  extends: ElForm,
  setup(props, ctx) {
    const defaultSlot = ctx.slots.default;
    const hasAppend = ctx.slots.append && props.inline;
    const isCollapse = ref(true);
    const wrapRef = ref(null);
    const showCollapse = ref(false);
    onMounted(() => {
      if (hasAppend) {
        showCollapse.value = wrapRef.value.scrollHeight > wrapRef.value.clientHeight;
      }
    });
    if (hasAppend) {
      ctx.slots._ = undefined;
      ctx.slots.default = () => [
        <div class={['flex flex-row overflow-hidden justify-between', isCollapse.value ? 'h-62px' : '']} ref={wrapRef}>
          <div>{...defaultSlot()}</div>
          <div class="flex-shrink-0">
            {...ctx.slots.append()}
            {showCollapse.value && (
              <el-button link type="primary" onClick={() => (isCollapse.value = !isCollapse.value)}>
                {isCollapse.value ? '展开' : '收起'}
                <el-icon>{isCollapse.value ? <ArrowDownBold /> : <ArrowUpBold />}</el-icon>
              </el-button>
            )}
          </div>
        </div>
      ];
    }
    return ElForm.setup(props, ctx);
  }
};
