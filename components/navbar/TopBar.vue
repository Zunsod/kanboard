<template>
  <header class="topbar">
    <h1 class="topbar__title">Бүх даалгаврууд</h1>

    <div class="topbar__actions">
      <button class="topbar__bell" type="button" aria-label="Мэдэгдэл">
        <BellIcon class="topbar__icon"/>
      </button>
      <UserAvatar :name="userName" />
      <span class="topbar__name">{{ userName }}</span>
      <button class="topbar__logout" type="button" @click="logout">Гарах</button>
    </div>
  </header>
</template>

<script>
import { BellIcon } from 'vue-tabler-icons'
import UserAvatar from '../ui/UserAvatar.vue'
export default {
    name: 'TopBar',
    components: { UserAvatar, BellIcon },
    props: {
      title: { type: String, required: true }
    },
    computed:{
      userName(){
        const user = this.$store.state.auth.user
        if(!user) return ''
        return user.displayName || user.email
      }
    },
    methods:{
      async logout(){
        await this.$store.dispatch('auth/logout')
        this.$router.push('/login')
      }
    }
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
    &__name {
      font-size: $font-sm;
      font-weight: 500;
    }
    &__logout {
      font-size: $font-sm;
      color: $color-text-muted;

      &:hover {
        color: $color-text;
      }
    }
}
</style>