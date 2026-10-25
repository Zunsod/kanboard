<template>
  <div class="demo">
    <div class="demo__card">
      <h3>Mobile app design</h3>
      <span class="demo__chip demo__chip--high">High</span>
      <span class="demo__chip demo__chip--low">Low</span>
    </div>
  </div>
</template>

<script>
export default { name: 'IndexPage' }
</script>

<style lang="scss" scoped>
.demo {
  padding: $space-6;

  &__card {
    @include card;
    width: $column-width;
    padding: $space-3;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__chip {
    align-self: flex-start;
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
    font-size: $font-xs;

    &--high { @include priority-chip(high); }
    &--low { @include priority-chip(low); }
  }
}
</style>