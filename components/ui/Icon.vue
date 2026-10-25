<template>
  <i class="ti" :class="`ti-${name}`" :style="{ fontSize: `${size}px` }" aria-hidden="true" />
</template>

<script>
export default {
  name: 'TablerIcon',
  props: {
    name: { type: String, required: true },
    size: { type: Number, default: 18 }
  }
}
</script>

<style lang="scss" scoped>
.ti {
  display: inline-flex;
  flex-shrink: 0;
  line-height: 1;
}
</style>