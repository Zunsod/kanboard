<template>
    <div class="task-card" @click="$emit('open')">
        <h3 class="task-card__title">{{ task.title }}</h3>
        <!-- description haruulah -->
        <p v-if="task.description" class="task-card__description">{{ task.description }}</p>

        <!-- priority haruulah -->
        <div class="task-card__priority">
            <UiBadge :variant="isOverdue ? 'overdue' : 'neutral'">{{ dueLabel }}</UiBadge>
            <UiBadge :variant="task.priority">
                <FlagIcon class="task-card__icon" />
                {{ priorityText }}
            </UiBadge>
        </div>

        <!-- footer-shared humuus -->
        <div class="task-card__footer">
            <div class="task-card__avatars">
                <UserAvatar :name="task.owner" size="sm" />
                <UserAvatar v-for="person in task.sharedWith" :key="person" :name="person" size="sm" />        
            </div>
            <UiBadge v-if="isShared">
                <LinkIcon class="task-card__icon" />
                Хуваалцсан
            </UiBadge>
        </div>
    </div>
</template>

<script>
import { FlagIcon, LinkIcon } from 'vue-tabler-icons'
import UiBadge from '~/components/ui/UiBadge.vue'
import UserAvatar from '~/components/ui/UserAvatar.vue'

export default {
    name: 'TaskCard',
    components: { FlagIcon, LinkIcon, UiBadge, UserAvatar },
    props: {
        task: { type: Object, required: true }
    },
    computed:{
        // hen negentei huvaaltssan bol
        isShared() {
            return this.task.sharedWith.length > 0
        },
        // priority харуулах
        priorityText(){
            if (this.task.priority === 'high') return 'Өндөр'
            if (this.task.priority === 'medium') return 'Дунд'
            return 'Бага'
        },

        // on sariig date object bolgoh
        due(){
            const [y, m, d] = this.task.dueDate.split('-').map(Number)
            return new Date(y, m - 1, d) // date() function sariig 0-s ehelj tooldog
        },
        // card deer haruulah
        dueLabel(){
            return `${this.due.getMonth() + 1}/${this.due.getDate()}`
        },
        // hugatsaa hetersen eseh
        isOverdue() {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return this.task.status !== 'done' && this.due < today
        }
    }
}
</script>
<style lang="scss" scoped>
.task-card{
    @include card;
    display: flex;
    flex-direction: column;
    gap: $space-3;
    padding: $space-3;
    cursor: pointer;

    &:hover {
        box-shadow: $shadow-pop;
    }
    &__title {
        font-size: $font-md;
        font-weight: 600;
    }
    &__description {
        display: -webkit-box;
        overflow: hidden;
        font-size: $font-sm;
        color: $color-text-muted;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    &__priority{
        display: flex;
        align-items: center;
        gap: $space-2;
    }
    &__footer {
        display: flex;
        align-items: center;
        gap: $space-2;
        justify-content: space-between;
        min-height: 24px;
    }
    &__avatars {
        display: flex;
    }
    &__icon {
        width: 12px;
        height: 12px;
    }
} 
</style>