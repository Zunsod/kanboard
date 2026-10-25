<template>
    <div class="board-page">
            <div class="ph ph--topbar">Topbar: гарчиг "Бүх даалгавар" (зүүн), мэдэгдэл + avatar (баруун)</div>
            <div class="ph ph--toolbar">Toolbar: хайлт, шүүлтүүр, эрэмбэ, Нэмэх товч (баруун тал)</div>

            <div class="board-page__columns">
                <div class="ph ph--column">Багана 1: Хийх</div>
                <div class="ph ph--column">Багана 2: Хийж буй</div>
                <div class="ph ph--column">Багана 3: Дууссан</div>
            </div>
    </div>
</template>

<script>
export default { name: 'IndexPage' }
</script>

<style lang="scss" scoped>
.board-page{
    display: flex;
    flex-direction: column;
    gap: $space-4;
    min-height: 100%;
    padding: $space-5;

    &__columns{
        display: flex;
        align-items: flex-start;
        gap: $space-4;
    }
}
.ph {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-3;
  font-size: $font-sm;
  color: $color-text-subtle;
  text-align: center;
  border: 1px dashed $color-border-strong;
  border-radius: $radius-md;

  &--topbar { height: 48px; }
  &--toolbar { height: 44px; }

  &--column {
    flex: 0 0 $column-width;
    width: $column-width;
    height: 420px;
  }
}

</style>