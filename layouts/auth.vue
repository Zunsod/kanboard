<template>
    <div class="auth-layout">
        <div class="auht-layout__card">
            <Nuxt/>
        </div>
    </div>
</template>

<script>
export default{
    name: 'AuthLayout'
}
</script>
<style lang="scss" scoped>
.auth-layout {
  @include flex-center;
  height: 100%;
  padding: $space-4;
  overflow-y: auto;
  background: $color-surface;

  &__content {
    width: 100%;
    max-width: 440px;
  }
}
</style>