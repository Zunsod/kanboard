<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="drawer">
            <!-- Header хэсэг -->
            <header class="drawer__header">
                <div class="drawer__heading">
                    <h2 class="drawer__title">{{ isEditing ? 'Task-н дэлгэрэнгүй' : 'Шинэ task'}}</h2>
                    <button class="drawer__close" type="button" aria-label="Хаах" @click="$emit('close')">
                        <XIcon class="drawer__close-icon" />
                    </button>
                </div>
                <p v-if="!isEditing" class="drawer__hint">Санамж: * тэмдэгтэй талбарыг заавал бөглөнө.</p>
            </header>
            
            <!-- Shared task-ийг member нээсэн үед -->
            <div v-if="isEditing && !isOwner" class="drawer__note">
                <strong>Танд хуваалцсан · Засах боломжтой</strong>
                <span>{{ task.owner }} энэ task-ийн эзэмшигч бөгөөд таны өөрчлөлт хоёуланд харагдана.</span>
            </div>

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

                <!-- Shine task үүсгэх үеийн note -->
                <div v-if="!isEditing" class="drawer__note">
                    <strong>Зөвхөн танд харагдана</strong>
                    <span>Та энэ task-н эзэмшигч болох ба үүсгэсний дараа бусадтай хуваалцах боломжтой.</span>
                </div>

                <!-- hamtragchdiig zasah uyd -->
                 <section v-if="isEditing" class="people">
                    <h3 class="people__title">Эзэмшигч ба хамтрагчид</h3>

                    <ul class="people__list">
                        <li class="people__item">
                            <UserAvatar :name="task.owner" size="sm" />
                            <span class="people__name">{{ displayName(task.owner) }}</span>
                            <span class="people__role">Owner · Editor</span>
                        </li>
                        <li v-for="person in task.sharedWith" :key="person" class="people__item">
                            <UserAvatar :name="person" size="sm" />
                            <span class="people__name">{{ displayName(person) }}</span>
                            <span class="people__role">Editor</span>
                        </li>
                    </ul>
                </section>

                <!-- Share, delete (edit hiih uyd) -->
                <div v-if="isEditing" class="owner-actions">
                    <div class="owner-actions__item">
                        <button class="btn btn--ghost" type="button" disabled>
                            Хуваалцах
                        </button>
                        <span class="owner-actions__hint">Owner manages access</span>
                    </div>

                    <div v-if="isOwner" class="owner-actions__item owner-actions__item--right">
                            <button class="btn btn--danger" type="button" :disabled="!isOwner" @click="$emit('delete', task)">
                                Устгах
                            </button>
                            <span class="owner-actions__hint">Owner only</span>
                    </div>
                </div>


                <!-- cancel, create button-гууд -->
                <div class="drawer__actions">
                    <button class="btn btn--ghost" type="button" @click="$emit('close')">Болих</button>
                    <button class="btn btn--primary" type="submit" :disabled="!isValid">
                        {{ isEditing ? 'Хадгалах' : 'Үүсгэх' }}
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<script>
import { XIcon } from 'vue-tabler-icons'
import UserAvatar from '../ui/UserAvatar.vue';
export default{
    name: 'TaskModal',
    components: {XIcon, UserAvatar},
    props: {
        startStatus: { type: String, default: 'todo' },
        task: { type: Object, default: null },  // null irvel shine task
        currentUser: { type: String, default: 'Зөнсод' } // test
    },

    data() {
        // Herev taskiig zasaj baival
        if(this.task){
            return {
                form: {
                title: this.task.title,
                description: this.task.description || '',
                dueDate: this.task.dueDate,
                priority: this.task.priority,
                status: this.task.status
                },
                titleTouched: false
            }
        }
        // Herev shineer task uusgevel
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
        isEditing(){
            return this.task !== null
        },
        // Tuhain hereglegch task owner mun eseh
        isOwner(){
            return this.isEditing && this.task.owner === this.currentUser;
        },

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
        },

        displayName(name){
            if(name === this.userName){
                return `${name} (та)`
            }
            return name
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
    gap: $space-2;
    width: 100%;
    max-width: 520px;
    padding: $space-5;
    overflow-y: auto;
    background: $color-surface;
    box-shadow: $shadow-pop;
    animation: slide-in 0.2s ease-out;
    
    &__header {
        display: flex;  
        flex-direction: column;
        align-items: flex-start;
        
    }
    &__heading{
        @include flex-center;
        height: 3rem;
        width: 100%;
        display: flex;
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
        flex-shrink: 0;
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

.people{
    display: flex;
    flex-direction: column;
    gap: $space-2;

    &__title {
        font-size: $font-xs;
        font-weight: 600;
        color: $color-text-muted;
        text-transform: uppercase;
    }
    &__list {
        display: flex;
        flex-direction: column;
        gap: $space-2;
        padding: 0;       
        margin: 0;        
        list-style: none; 
    }
    &__item {
        display: flex;
        align-items: center;
        gap: $space-2;
    }
    &__name {
        flex: 1; // name үлдсэн зайг эзэлж, role-г баруун тийш шахна
        font-weight: 500;
    }
    &__role {
        font-size: $font-xs;
        color: $color-text-muted;
    }
}

.owner-actions{
    display: flex;
    justify-content: space-between;
    padding-top: $space-4;
    border-top: 1px solid $color-border;
    &__item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: $space-1;

        &--right {
            align-items: flex-end;
        }
        &__hint {
            font-size: $font-xs;
            color: $color-text-subtle;
        }
    }
    &__hint {
        font-size: $font-xs;
        color: $color-text-subtle;
    }
}
.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

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

    // Idewhgui buh tovch
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

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
    }
    &--danger {
        color: $color-danger;
        border: 1px solid $color-danger;

        &:hover:not(:disabled) {
            background: $high-bg;
        }
    }
}


</style>