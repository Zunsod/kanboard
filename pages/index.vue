<template>
    <div class="board-page">
            <TopBar/>
            <!-- Шүүлт, order хийх хэсэг -->
            <div></div>

            <!-- Kanban Board -->
            <div class="board-page__columns">
                <BoardColumn title="Хийх ажлууд" :tasks="todoTasks" @add="openModal('todo')" @open="openEdit"/>
                <BoardColumn title="Хийж буй" :tasks="inProgressTasks" @add="openModal('in-progress')" @open="openEdit"/>
                <BoardColumn title="Дууссан" :tasks="doneTasks" @add="openModal('done')" @open="openEdit"/>
            </div>
            
            <!-- Task uusgeh bolon zasah -->
            <TaskModal
                v-if="showModal"
                :start-status="modalStatus"
                :task="editingTask"
                :current-user="currentUser"
                @close="closeModal"
                @save="saveTask"
                @delete="askDelete"
            />

            <!-- delete batalgaajuulalt -->
            <ConfirmDialogue
                v-if="deletingTask"
                :task="deletingTask"
                @cancel="deletingTask = null"
                @confirm="confirmDelete"
            />
    </div>
</template>

<script>
import BoardColumn from '~/components/board/BoardColumn.vue';
import ConfirmDialogue from '~/components/modal/ConfirmDialogue.vue';
import TaskModal from '~/components/modal/TaskModal.vue';
import TopBar from '~/components/navbar/TopBar.vue';
export default { 
    name: 'IndexPage',
    components: {TopBar, BoardColumn, TaskModal, ConfirmDialogue},

    data() {
        return {
            showModal: false,     // modal нээлттэй эсэх
            currentUser: 'Зөнсод',
            modalStatus: 'todo',   // аль баганаас нээсэн
            editingTask: null, // засаж буй task (null бол шинэ)
            deletingTask: null // устгах гэж буй task (null бол dialog хаалттай)
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
        // card harah, zasah
        openEdit(task) {
            this.editingTask = task
            this.showModal = true
        },

        closeModal() {
            this.showModal = false
        },

        saveTask(formData) {
            if(this.editingTask){
                const updatedTask = {...this.editingTask, ...formData}
                this.$store.commit('tasks/UPDATE_TASK', updatedTask)
            }else{
                const newTask = {
                    ...formData,
                    id: Date.now(),      // test
                    owner: this.currentUser,     // test
                    sharedWith: []
                }
                this.$store.commit('tasks/ADD_TASK', newTask)
            }
            this.closeModal()
        },

        // drawer хааж, dialog нээнэ
        askDelete(task) {
            this.closeModal()
            this.deletingTask = task
        },

        // dialog-iin ustgah 
        confirmDelete() {
            this.$store.commit('tasks/DELETE_TASK', this.deletingTask.id)
            this.deletingTask = null
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