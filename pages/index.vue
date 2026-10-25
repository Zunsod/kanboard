<template>
    <div class="board-page">
            <TopBar/>

            <div class="ph ph--toolbar">Toolbar: хайлт, шүүлтүүр, эрэмбэ, Нэмэх товч (баруун тал)</div>
            
            <div class="board-page__columns">
                <div class="test-cards">Багана 1: Хийх
                    <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
                </div>
                <div class="ph ph--column">Багана 2: Хийж буй</div>
                <div class="ph ph--column">Багана 3: Дууссан</div>
            </div>
    </div>
</template>

<script>
import TaskCard from '~/components/board/TaskCard.vue';
import TopBar from '~/components/navbar/TopBar.vue';
export default { 
    name: 'IndexPage',
    components: {TopBar, TaskCard},
    data(){
        return {
            tasks: [
                { id: 1, title: 'Mobile app design', dueDate: '2026-10-20', priority: 'high', status: 'in-progress', owner: 'Зөнсод', sharedWith: ['Болд', 'Сараа'] },
                { id: 2, title: 'Research website', dueDate: '2026-11-08', priority: 'medium', status: 'todo', owner: 'Зөнсод', sharedWith: [] },
                { id: 3, title: 'Design system', dueDate: '2026-10-15', priority: 'low', status: 'done', owner: 'Болд', sharedWith: ['Зөнсод'] }
            ]
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
    }
}
.ph {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-3;
  font-size: $font-sm;
  color: $color-text-subtle;
  text-align: center;
  border: 1px dashed $color-border-strong;
  border-radius: $radius-md;

  &--topbar { height: 48px; }
  &--toolbar { height: 44px; }

  &--column {
    flex: 0 0 $column-width;
    width: $column-width;
    height: 420px;
  }
}
.test-cards{
    display: flex;
    gap: $space-4;
    > * {
        width: $column-width;
    }

}

</style>