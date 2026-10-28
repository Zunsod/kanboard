<template>
    <section class="column">
        <!-- Bagana title -->
        <header class="column__header">
            <h2 class="column__title">
                {{ title }}
                <span class="column__count">{{ tasks.length }}</span>
            </h2>
            <button class="column__add" type="button" aria-label="Task нэмэх" @click="$emit('add')">
                <PlusIcon class="column__add-icon" />
            </button>
        </header>

        <!-- Task card-ууд -->
        <div class="column__list">
            <TaskCard
                v-for="task in tasks"
                :key="task.id"
                :task="task"
                @open="$emit('open', task)"
            />
            <p v-if="isEmpty" class="column__empty">Task байхгүй байна</p>
        </div>
    </section>
</template>

<script>
import { PlusIcon } from 'vue-tabler-icons';
import TaskCard from './TaskCard.vue';

export default{
    name: 'BoardColumn',
    components: {PlusIcon, TaskCard},
    props:{
        title: { type: String, required: true },
        tasks: { type: Array, default: () => [] }
    },

    computed: {
        isEmpty() {
            return this.tasks.length === 0
        }
    }
}
</script>

<style lang="scss" scoped>
.column{
    width: $column-width;
    flex-shrink: 0;
    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: $space-3;
        margin-bottom: $space-3;
        border-bottom: 3px solid $color-column-line;
    }

    &__title {
        font-size: $font-md;
        font-weight: 500;
        color: $color-text-muted;
    }

    &__count {
        margin-left: $space-1;
        color: $color-text-subtle;
    }

    &__add {
        @include flex-center;
        width: 24px;
        height: 24px;
        color: $color-text-muted;
        border-radius: $radius-sm;
        &:hover {
        background: $color-hover;
        }
    }
    &__add-icon {
        width: 16px;
        height: 16px;
    }
    &__list {
        display: flex;
        flex-direction: column;
        gap: $space-3;
    }
    &__empty {
        padding: $space-5 0;
        font-size: $font-sm;
        color: $color-text-subtle;
        text-align: center;
        border: 1px dashed $color-border-strong;
        border-radius: $radius-md;
    }
}
</style>