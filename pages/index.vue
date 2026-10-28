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
import { daysUntil } from '~/utils/date';
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
            editingTaskId: null, // засаж буй task (null бол шинэ)
            deletingTask: null, // устгах гэж буй task (null бол dialog хаалттай)
            activeTab: 'all',
            search: '',
            sortBy: 'dueDate',
            remindersShown: false
        }
    },

    computed:{
        userId() {
            return this.$store.state.auth.user.uid
        },
        tasksLoaded(){
            return this.$store.getters['task/isLoaded']
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
        },

        editingTask(){
            if (!this.editingTaskId) return null
            return this.$store.getters['tasks/allTasks'].find((task) => task.id === this.editingTaskId) || null
        },
        watch:{
            // Firestore-oos ugugdul irmegts reminder haruulna
            tasksLoaded(loaded){
                if(loaded && !this.remindersShown){
                    this.remindersShown =true
                    this.showReminders()
                }
            }
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
            this.editingTaskId = null
            this.modalStatus = status
            this.showModal = true
        },
        // card harah, zasah
        openEdit(task) {
            this.editingTaskId = task.id
            this.showModal = true
        },

        closeModal() {
            this.showModal = false
            this.editingTaskId = null
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
        },
        showReminders(){
            const messages = []
            // Hugatsaani medegdel
            this.$store.getters['tasks/allTasks'].forEach((task) => {
                if (task.status === 'done') return // done bolsniig algasna

                const days = daysUntil(task.dueDate)
                if (days < 0) {
                messages.push({ message: `Хугацаа ${-days} хоног хэтэрсэн: ${task.title}`, type: 'error' })
                } else if (days === 0) {
                messages.push({ message: `Өнөөдөр дуусна: ${task.title}`, type: 'warning' })
                } else if (days === 1) {
                messages.push({ message: `Маргааш дуусна: ${task.title}`, type: 'info' })
                }
            })
            // Shineer huvaaltssan task uud
            const sharedTasks = this.$store.state.tasks.shared
            const seenIds = this.loadSeenIds()
            sharedTasks.forEach((task) => {
                if (!seenIds.includes(task.id)) {
                    messages.push({
                        message: `${task.ownerName} танд "${task.title}" task хуваалцлаа`,
                        type: 'success'
                    })
                }
            })
            // odoo baigaa huvaaltssan task uudig seen gej temdeglene
            this.saveSeenIds(sharedTasks.map((task) => task.id))

            // ehnii 5 notif haruulna
            messages.slice(0, 5).forEach((item) => {
                this.$store.dispatch('toast/show', { ...item, duration: 6000 })
            })
            if (messages.length > 5) {
                this.$store.dispatch('toast/show', {
                message: `Өөр ${messages.length - 5} мэдэгдэл байна`,
                type: 'info',
                duration: 6000
                })
            }
            },
            // user burt uur tulhuur
            seenKey() {
                return `kanboard-seen-shared-${this.userId}`
            },
            loadSeenIds() {
                try {
                    return JSON.parse(localStorage.getItem(this.seenKey())) || []
                } catch (err) {
                    return []
                }
            },
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