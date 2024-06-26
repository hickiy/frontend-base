import { ElForm } from 'element-plus';
export default {
  name: 'ElForm',
  extends: ElForm,
  setup(props, ctx) {
    const hasAppend = ctx.slots.append && props.inline;
    const defaultSlot = ctx.slots.default;
    const isCollapse = ref(true);
    if (hasAppend) {
      ctx.slots.default = () => [
        <div
          class="flex flex-row overflow-hidden justify-between"
          style={{ border: isCollapse.value ? '1px solid red' : '' }}
        >
          <div>{...defaultSlot()}</div>
          <div class="flex-shrink-0">
            {...ctx.slots.append()}
            <el-button link type="primary" onClick={() => (isCollapse.value = !isCollapse.value)}>
              {isCollapse.value ? '展开' : '收起'}
              <el-icon>{isCollapse.value ? <ArrowDownBold /> : <ArrowUpBold />}</el-icon>
            </el-button>
          </div>
        </div>
      ];
    }
    return ElForm.setup(props, ctx);
  }
};
