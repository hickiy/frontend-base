<!-- hickey 2023 -->

<script lang="tsx">
export default defineComponent({
  name: 'Menu',
  setup() {
    let name: Ref<string | number> = ref('hickey');
    name.value = 111;
    return () => <div>{name.value}</div>;
  }
});
</script>

<style scoped></style>
