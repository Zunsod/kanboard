<template>
  <header class="topbar">
    <h1 class="topbar__title">Бүх даалгаврууд</h1>

    <div class="topbar__actions">
      <button class="topbar__bell" type="button" aria-label="Мэдэгдэл">
        <BellIcon />
      </button>
      <UserAvatar name="Zunsod" />
    </div>
  </header>
</template>

<script>
import { BellIcon } from 'vue-tabler-icons'
import UserAvatar from '../ui/UserAvatar.vue'
export default {
    name: 'TopBar',
    components: { UserAvatar, BellIcon }
}
</script>

<style lang="scss" scoped>
.topbar{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    min-height: 48px;

    &__title{
        font-size: $font-xl;
        font-weight: 600;
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: $space-3;
    }

    &__bell{
        @include flex-center;
        width: 36px;
        height: 36px;
        font-size: 20px;
        color: $color-text-muted;
        border-radius: $radius-md;

        &:hover {
            background: $color-hover;
        }
    }
}
</style>