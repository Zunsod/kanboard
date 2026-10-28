<template>
    <div class="board-page">
            <TopBar title="Бүх даалгаврууд"/>
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
                :current-user-id="userId"
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
import { type } from 'firebase/firestore/lite/pipelines';
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
            modalStatus: 'todo',   // аль баганаас нээсэн
            editingTask: null, // засаж буй task (null бол шинэ)
            deletingTask: null, // устгах гэж буй task (null бол dialog хаалттай)
            activeTab: 'all',
            search: '',
            sortBy: 'dueDate'
        }
    },

    computed:{
        userId(){
            return this.$store.state.auth.user.uid
        },
        visibleTasks(){
            let list = this.$store.getters['tasks/allTasks']
            // Tab
            if(this.activeTab === 'mine'){
                list = list.filter((task)=> task.ownerId === this.userId)
            }
            if(this.activeTab === 'shared'){
                list = list.filter((task)=> task.ownerId !== this.userId)
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
    // Board neegdehed firestore-iig sonsoj ehelne
    mounted(){
        this.$store.dispatch('tasks/subscribe')
    },
    // board-s garahad sonsohoo bolino
    beforeDestroy(){
        this.$store.dispatch('tasks/unsubscribe')
    },

    methods:{
        openModal(status) {
            this.editingTask = null
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
            this.editingTask = null
        },

        async saveTask(formData) {
        try {
            if (this.editingTask) {
            await this.$store.dispatch('tasks/updateTask', {
                id: this.editingTask.id,
                ...formData
            })
            this.showToast('Task хадгалагдлаа', 'success')
            } else {
            await this.$store.dispatch('tasks/addTask', formData)
            this.showToast('Шинэ task үүслээ', 'success')
            }
            this.closeModal()
        } catch (err) {
            console.error(err)
            this.showToast('Хадгалж чадсангүй. Дахин оролдоно уу.', 'error')
        }
        },

        // drawer хааж, dialog нээнэ
        askDelete(task) {
            this.closeModal()
            this.deletingTask = task
        },

        // dialog-iin ustgah 
        async confirmDelete() {
            try{
                await this.$store.dispatch('tasks/deleteTask', this.deletingTask.id)
                this.showToast('Task устгагдлаа', 'info')
            } catch (err){
                console.error(err)
                this.showToast('Устгаж чадсангүй.', 'error')
            }
            this.deletingTask = null
        },
        showToast(message){
            this.$store.dispatch('toast/show', { message, type})
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