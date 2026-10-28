<template>
    <div class="app">
        <SideBar/>
        <main class="app__main">
            <Nuxt />
        </main>
        <ToastMessage/>
    </div>
</template>

<script>
import SideBar from '~/components/navbar/SideBar.vue';
import ToastMessage from '~/components/ui/ToastMessage.vue';
export default { 
    name: 'DefaultLayout',
    components: {SideBar, ToastMessage}
}
</script>

<style lang="scss" scoped>
.app{
    display: flex;
    height: 100%;
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
        min-height: 0;           
        background: $color-bg;
        overflow: auto;
    }
}
</style>