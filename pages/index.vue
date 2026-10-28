<template>
    <div class="board-page">
            <TopBar/>

            <!-- Tab, search, erembelelt хийх хэсэг -->
            <BoardToolbar
                :active-tab="activeTab"
                :search="search"
                :sort-by="sortBy"
                @change-tab="activeTab = $event"
                @search="search = $event"
                @sort="sortBy = $event"
                @add="openModal('todo')"
            />

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
import BoardToolbar from '~/components/board/BoardToolbar.vue';
import ConfirmDialogue from '~/components/modal/ConfirmDialogue.vue';
import TaskModal from '~/components/modal/TaskModal.vue';
import TopBar from '~/components/navbar/TopBar.vue';
export default { 
    name: 'IndexPage',
    components: {TopBar, BoardColumn, TaskModal, ConfirmDialogue, BoardToolbar},
    
    data() {
        return {
            showModal: false,     // modal нээлттэй эсэх
            currentUser: 'Зөнсод',
            modalStatus: 'todo',   // аль баганаас нээсэн
            editingTask: null, // засаж буй task (null бол шинэ)
            deletingTask: null, // устгах гэж буй task (null бол dialog хаалттай)
            activeTab: 'all',
            search: '',
            sortBy: 'dueDate'
        }
    },

    computed:{
        visibleTasks(){
            let list = this.$store.state.tasks.items
            // Tab
            if(this.activeTab === 'mine'){
                list = list.filter((task)=> task.owner === this.currentUser)
            }
            if(this.activeTab === 'shared'){
                list = list.filter((task)=> task.owner !== this.currentUser)
            }

            // Search
            const searchText = this.search.trim().toLowerCase()
            if( searchText !==''){
                list = list.filter((task)=> task.title.toLowerCase().includes(searchText))
            }

            // Erembe
            const sorted = [...list]
            if(this.sortBy === 'dueDate'){
                sorted.sort((taskA, taskB) => taskA.dueDate.localeCompare(taskB.dueDate))
            }
            if(this.sortBy === 'priority'){
                const order = { high: 1, medium: 2, low: 3 }
                sorted.sort((taskA, taskB) => order[taskA.priority] - order[taskB.priority])
            }
            return sorted
        },
        // store/tasks.js-ийн getter-үүдийг энэ component-ийн computed болгоно
        todoTasks(){
            return this.visibleTasks.filter((task)=> task.status === 'todo')
        },
        inProgressTasks() {
            return this.visibleTasks.filter((task)=> task.status === 'in-progress')
        },
        doneTasks(){
            return this.visibleTasks.filter((task)=> task.status === 'done')
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
    },
    
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