<template>
    <div class="app">
        <aside class="app__sidebar">
            <span>Sidebar</span>
        </aside>
        <main class="app__main">
            <Nuxt />
        </main>
    </div>
</template>

<script>
export default { name: 'DefaultLayout' }
</script>

<style lang="scss" scoped>
.app{
    display: flex;
    height: 100vh;
    &__sidebar{
        width: $sidebar-width;
        flex-shrink: 0;
        padding: $space-5 $space-4;
        background: $color-surface;
        border-right: 1px solid $color-border;
    }

    &__main{
        flex: 1;
        min-width: 0;        
        background: $color-bg;
    }
}
</style>