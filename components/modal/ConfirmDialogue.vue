<template>
  <div class="overlay" @click.self="$emit('cancel')">
    <div class="dialog" role="alertdialog">
      <h2 class="dialog__title">Энэ task-ийг устгах уу?</h2>
      <p class="dialog__text">"{{ task.title }}" task-ийг бүрмөсөн устгах гэж байна.</p>

      <div class="dialog__warning">
        <strong>Энэ үйлдлийг буцаах боломжгүй</strong>
        <span>Task таны board-оос устгагдах ба хуваалцсан хүмүүс ч цаашид харах боломжгүй болно.</span>
      </div>

      <p class="dialog__info">{{ task.title }} · {{ statusText }} · {{ task.dueDate }}</p>

      <div class="dialog__actions">
        <button class="btn btn--ghost" type="button" @click="$emit('cancel')">Болих</button>
        <button class="btn btn--danger" type="button" @click="$emit('confirm')">Устгах</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',

  props: {
    task: { type: Object, required: true }
  },

  computed: {
    statusText() {
      if (this.task.status === 'todo') return 'Хийх'
      if (this.task.status === 'in-progress') return 'Хийж буй ажил'
      return 'Дууссан'
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200; 
  @include flex-center;
  padding: $space-4;
  background: rgba(0, 0, 0, 0.3);
}

.dialog {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  width: 100%;
  max-width: 500px;
  padding: $space-5;
  background: $color-surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-pop;

  &__title {
    font-size: $font-lg;
    font-weight: 600;
  }

  &__text {
    font-size: $font-sm;
    color: $color-text-muted;
  }

  &__warning {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    padding: $space-3;
    font-size: $font-sm;
    color: $high-text;
    background: $high-bg;
    border-radius: $radius-md;

    strong {
      font-size: $font-xs;
      font-weight: 500;
    }
  }

  &__info {
    font-size: $font-xs;
    color: $color-text-muted;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $space-2;
    margin-top: $space-2;
  }
}

.btn {
  height: 36px;
  padding: 0 $space-4;
  font-weight: 500;
  border-radius: $radius-md;

  &--ghost {
    border: 1px solid $color-border;

    &:hover {
      background: $color-hover;
    }
  }

  &--danger {
    color: $color-on-primary;
    background: $color-danger;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>