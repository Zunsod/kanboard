<template>
    <div class="app">
        <div class="app__shell">
            <AppSidebar />
            <main class="app__main">
                <Nuxt/>
            </main>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.app{
    height: 100%;
    padding: $space-4;

    &__shell{
        
    }
}
</style>