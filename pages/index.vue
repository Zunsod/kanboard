<template>
    <div class="board-page">
            <TopBar/>
            <!-- Шүүлт, order хийх хэсэг -->
            <div></div>

            <!-- Kanban Board -->
            <div class="board-page__columns">
                <BoardColumn title="Хийх ажлууд" :tasks="todoTasks" @add="openModal('todo')"/>
                <BoardColumn title="Хийж буй" :tasks="inProgressTasks" @add="openModal('in-progress')"/>
                <BoardColumn title="Дууссан" :tasks="doneTasks" @add="openModal('done')"/>
            </div>

            <TaskModal
                v-if="showModal"
                :start-status="modalStatus"
                @close="closeModal"
                @save="addTask"
            />
    </div>
</template>

<script>
import BoardColumn from '~/components/board/BoardColumn.vue';
import TaskModal from '~/components/modal/TaskModal.vue';
import TopBar from '~/components/navbar/TopBar.vue';
export default { 
    name: 'IndexPage',
    components: {TopBar, BoardColumn, TaskModal},

    data() {
    return {
        showModal: false,     // modal нээлттэй эсэх
        modalStatus: 'todo'   // аль баганаас нээсэн
        }
    },

    computed:{
        // store/tasks.js-ийн getter-үүдийг энэ component-ийн computed болгоно
        todoTasks(){
            return this.$store.getters['tasks/todoTasks']
        },
        inProgressTasks() {
            return this.$store.getters['tasks/inProgressTasks']
        },
        doneTasks(){
            return this.$store.getters['tasks/doneTasks']
        }
    },

    methods:{
        openModal(status) {
            this.modalStatus = status
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
        },

        addTask(formData) {
            const newTask = {
                ...formData,
                id: Date.now(),      // test
                owner: 'Зөнсод',     // test
                sharedWith: []
            }
            this.$store.commit('tasks/ADD_TASK', newTask)
            this.closeModal()
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