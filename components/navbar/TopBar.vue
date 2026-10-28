<template>
  <header class="topbar">
    <h1 class="topbar__title">Бүх даалгаврууд</h1>

    <div class="topbar__actions">
      <div class="bell">
        <button class="topbar__bell" type="button" aria-label="Мэдэгдэл" @click="open = !open">
          <BellIcon class="topbar__icon" />
          <span v-if="reminders.length" class="bell__count">{{ reminders.length }}</span>
        </button>

        <!-- Гадна дарахад хаагдах -->
        <div v-if="open" class="bell__backdrop" @click="open = false"></div>

        <div v-if="open" class="bell__panel">
          <p class="bell__title">Мэдэгдэл</p>

          <p v-if="!reminders.length" class="bell__empty">Шинэ мэдэгдэл алга 🎉</p>

          <ul v-else class="bell__list">
            <li v-for="item in reminders" :key="item.id" class="bell__item">
              <span class="bell__dot" :class="`bell__dot--${item.type}`"></span>
              <span>{{ item.message }}</span>
            </li>
          </ul>
        </div>
      </div>
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
    data() {
      return {
        open: false // panel нээлттэй эсэх
      }
    },
    computed:{
      userName(){
        const user = this.$store.state.auth.user
        if(!user) return ''
        return user.displayName || user.email
      },
      reminders() {
        return this.$store.getters['tasks/reminders']
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
.bell {
  position: relative; 
  // Ulaan too
  &__count {
    position: absolute;
    top: 2px;
    right: 2px;
    @include flex-center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    font-size: 10px;
    font-weight: 600;
    color: #fff;
    background: $color-danger;
    border-radius: $radius-full;
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
  }

  &__panel {
    position: absolute;
    top: 44px;
    right: 0;
    z-index: 50; 
    width: 320px;
    max-height: 360px;
    padding: $space-3;
    overflow-y: auto;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    box-shadow: $shadow-pop;
  }

  &__title {
    margin-bottom: $space-2;
    font-size: $font-sm;
    font-weight: 600;
  }

  &__empty {
    padding: $space-4 0;
    font-size: $font-sm;
    color: $color-text-muted;
    text-align: center;
  }

  &__list {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    gap: $space-2;
    padding: $space-2 0;
    font-size: $font-sm;
    border-bottom: 1px solid $color-border;

    &:last-child {
      border-bottom: none;
    }
  }
  &__dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: $radius-full;

    &--error {
      background: $color-danger;
    }

    &--warning {
      background: $color-warning;
    }

    &--info {
      background: $color-info;
    }
  }
}
</style>