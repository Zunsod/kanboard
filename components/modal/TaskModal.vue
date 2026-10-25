<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="drawer">
            <!-- Header хэсэг -->
            <header class="drawer__header">
                <h2 class="drawer__title">Шинэ task</h2>
                <button class="drawer__close" type="button" aria-label="Хаах" @click="$emit('close')">
                    <XIcon class="drawer__close-icon" />
                </button>
            </header>
            <p class="drawer__hint">Санамж: * тэмдэгтэй талбарыг заавал бөглөнө.</p>
            
            <!-- Form бөглөх хэсэг -->
            <form class="drawer__form" @submit.prevent="save">
                <!-- гарчиг -->
                <label class="field">
                    <span class="field__label">Гарчиг *</span>
                    <input
                        v-model="form.title"
                        class="field__input"
                        :class="{ 'field__input--error': showTitleError }"
                        type="text"
                        placeholder="Ямар task гүйцэтгэх вэ?"
                        @blur="titleTouched = true"
                    />
                    <span v-if="showTitleError" class="field__error">Гарчиг оруулна уу.</span>
                </label>

                <!-- description -->
                 <label class="field">
                    <span class="field__label">Дэлгэрэнгүй тайлбар</span>
                    <textarea
                        v-model="form.description"
                        class="field__input"
                        rows="5"
                        placeholder="Тайлбар, checklist эсвэл хүлээгдэж буй үр дүн..."
                    />
                 </label>

                <!-- On sar -->
                 <label class="field">
                    <span class="field__label">Deadline огноо *</span>
                    <input v-model="form.dueDate" class="field__input" type="date" />
                </label>

                <!-- Priority bolon tuluv -->
                <div class="drawer__row">
                <label class="field">
                    <span class="field__label">Ач холбогдол</span>
                    <select v-model="form.priority" class="field__input">
                    <option value="high">Өндөр</option>
                    <option value="medium">Дунд</option>
                    <option value="low">Бага</option>
                    </select>
                </label>

                <label class="field">
                    <span class="field__label">Төлөв</span>
                    <select v-model="form.status" class="field__input">
                    <option value="todo">Хийх ажил</option>
                    <option value="in-progress">Хийж буй ажил</option>
                    <option value="done">Дууссан</option>
                    </select>
                </label>
                </div>

                <!-- share hiih talaar note -->
                <div class="drawer__note">
                    <strong>Зөвхөн танд харагдана</strong>
                    <span>Та энэ task-н эзэмшигч болох ба үүсгэсний дараа бусадтай хуваалцах боломжтой.</span>
                </div>
                <!-- cancel, create button-гууд -->
                <div class="drawer__actions">
                    <button class="btn btn--ghost" type="button" @click="$emit('close')">Болих</button>
                    <button class="btn btn--primary" type="submit" :disabled="!isValid">Үүсгэх</button>
                </div>

            </form>
        </div>
    </div>
</template>

<script>
import { XIcon } from 'vue-tabler-icons'

export default{
    name: 'TaskModal',
    components: {XIcon},
    props: {
        startStatus: { type: String, default: 'todo' }
    },

    data() {
        return {
        form: {
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
            status: this.startStatus
        },
        titleTouched: false 
        }
    },
    computed: {
        // Гарчиг, огноо хоёулаа бөглөгдсөн үед л үүсгэж болно
        isValid() {
            return this.form.title.trim() !== '' && this.form.dueDate !== ''
        },

        // Field-с гарсан ч хоосон байвал алдааг харуулна
        showTitleError() {
            return this.titleTouched && this.form.title.trim() === ''
        }
    },
    methods: {
        save() {
        if (!this.isValid) return
        this.$emit('save', { ...this.form })
        }
    }
}

</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
}
.drawer{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: $space-1;
    width: 100%;
    max-width: 520px;
    padding: $space-5;
    overflow-y: auto;
    background: $color-surface;
    box-shadow: $shadow-pop;
    animation: slide-in 0.2s ease-out;
    
    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &__title {
        font-size: $font-xl;
        font-weight: 600;
    }

    &__close {
        @include flex-center;
        width: 32px;
        height: 32px;
        color: $color-text-muted;
        border-radius: $radius-md;

        &:hover {
        background: $color-hover;
        }
    }

    &__close-icon {
        width: 20px;
        height: 20px;
    }

    &__hint {
        font-size: $font-sm;
        color: $color-text-muted;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: $space-4;
    }

    &__row {
        display: flex;
        gap: $space-3;

        .field {
        flex: 1;
        }
    }

    &__note {
        display: flex;
        flex-direction: column;
        gap: $space-1;
        padding: $space-3;
        font-size: $font-sm;
        color: $color-text-muted;
        background: $color-bg;
        border-radius: $radius-md;

        strong {
        font-weight: 500;
        color: $color-text;
        }
    }
    &__actions {
        display: flex;
        justify-content: flex-end;
        gap: $space-2;
        padding-top: $space-4;
        border-top: 1px solid $color-border;
    }
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.field {
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &__label {
    font-size: $font-sm;
    font-weight: 500;
  }

  &__input {
    padding: $space-2 $space-3;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;

    &:focus {
      border-color: $color-info;
      outline: none;
    }

    // error үед улаан хүрээ
    &--error {
      border-color: $color-danger;
    }
  }

  &__error {
    font-size: $font-sm;
    color: $color-danger;
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

    &--primary {
        color: $color-on-primary;
        background: $color-primary;

        &:hover {
        background: $color-primary-hover;
        }

        // Huchingui uyd budeg haragdana
        &:disabled {
        color: $color-text-subtle;
        cursor: not-allowed;
        background: $color-hover;
        }
    }
}


</style>