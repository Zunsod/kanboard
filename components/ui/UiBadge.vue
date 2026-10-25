<template>
    <span class="badge" :class="'badge--' + variant">
        <slot />
    </span></template>
<script>
export default {
  name: 'UiBadge',
  props: {
    variant: { type: String, default: 'neutral' }
  }
}
</script>

<style lang="scss" scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  padding: 2px $space-2;
  font-size: $font-xs;
  line-height: 18px;
  white-space: nowrap;
  border-radius: $radius-sm;

  &--neutral {
    @include badge-color($color-text-muted, $color-hover);
  }

  &--overdue {
    @include badge-color($high-text, $high-bg);
  }

  &--high {
    @include badge-color($high-text, $high-bg);
  }

  &--medium {
    @include badge-color($medium-text, $medium-bg);
  }

  &--low {
    @include badge-color($low-text, $low-bg);
  }
}
</style>