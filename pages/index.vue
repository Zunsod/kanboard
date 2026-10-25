<template>
    <div class="board-page">
            <TopBar/>
            <!-- Шүүлт, order хийх хэсэг -->
            <div></div>

            <!-- Kanban Board -->
            <div class="board-page__columns">
                <BoardColumn title="Хийх ажлууд" :tasks="todoTasks" />
                <BoardColumn title="Хийж буй" :tasks="inProgressTasks" />
                <BoardColumn title="Дууссан" :tasks="doneTasks" />
            </div>
    </div>
</template>

<script>
import BoardColumn from '~/components/board/BoardColumn.vue';
import TopBar from '~/components/navbar/TopBar.vue';
export default { 
    name: 'IndexPage',
    components: {TopBar, BoardColumn},
    data(){
        return {
            tasks: [
                { id: 1, title: 'Mobile app design', dueDate: '2026-10-20', priority: 'high', status: 'in-progress', owner: 'Зүнсод', sharedWith: ['Болд', 'Сараа'] },
                { id: 2, title: 'Monitor revenue updates', dueDate: '2026-10-28', priority: 'medium', status: 'in-progress', owner: 'Зүнсод', sharedWith: [] },
                { id: 3, title: 'Research website', dueDate: '2026-11-08', priority: 'medium', status: 'todo', owner: 'Зүнсод', sharedWith: [] },
                { id: 4, title: 'Solar web-app design', dueDate: '2026-10-30', priority: 'high', status: 'todo', owner: 'Болд', sharedWith: ['Зүнсод'] },
                { id: 5, title: 'Design system', dueDate: '2026-10-15', priority: 'low', status: 'done', owner: 'Болд', sharedWith: ['Зүнсод'] }
            ]
        }
    },

    computed:{
        todoTasks(){
            return this.tasks.filter((task)=> task.status === 'todo')
        },
        inProgressTasks(){
            return this.tasks.filter((task)=> task.status === 'in-progress')
        },
        doneTasks(){
            return this.tasks.filter((task)=> task.status === 'done')
        }
    }

}
</script>

<style lang="scss" scoped>
.board-page{
    display: flex;
    flex-direction: column;
    gap: $space-4;
    min-height: 100%;
    padding: $space-5;

    &__columns{
        display: flex;
        align-items: flex-start;
        gap: $space-4;
        overflow-x: auto;
    }
}
</style>