<template>
  <div class="toasts">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
        @click="close(toast.id)"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'ToastMessage',

  computed: {
    toasts() {
      return this.$store.state.toast.items
    }
  },

  methods: {
    // Дарвал шууд хаагдана
    close(id) {
      this.$store.commit('toast/REMOVE', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.toasts {
  position: fixed;
  right: $space-5;
  bottom: $space-5;
  z-index: 300; 
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.toast {
  min-width: 260px;
  max-width: 360px;
  padding: $space-3 $space-4;
  font-size: $font-sm;
  cursor: pointer;
  background: $color-surface;
  border: 1px solid $color-border;
  border-left-width: 4px; 
  border-radius: $radius-md;
  box-shadow: $shadow-pop;

  &--success {
    border-left-color: $color-success;
  }

  &--error {
    border-left-color: $color-danger;
  }

  &--info {
    border-left-color: $color-info;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>