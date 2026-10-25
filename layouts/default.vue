<template>
    <div class="app">
        <SideBar/>
        <main class="app__main">
            <Nuxt />
        </main>
    </div>
</template>

<script>
import SideBar from '~/components/navbar/SideBar.vue';
export default { 
    name: 'DefaultLayout',
    components: {SideBar}
}
</script>

<style lang="scss" scoped>
.app{
    display: flex;
    height: 100vh;
    background: $color-bg;
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