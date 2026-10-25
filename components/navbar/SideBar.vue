<template>
    <div class="sidebar">
        <div class="sidebar__brand">
            <span class="sidebar__name">Kanboard</span>
        </div>

        <nav class="sidebar__nav" area-label="Үндсэн цэс">
            <NuxtLink to="/" class="sidebar__link" exact-active-class="is-active">
                <LayoutKanbanIcon class="sidebar__icon"/>
                <span class="sidebar__nav__name">Board</span>
            </NuxtLink>
        </nav>
    </div>
</template>

<script>
import { LayoutKanbanIcon } from 'vue-tabler-icons';
export default { 
    name: 'SideBar',
    components: {LayoutKanbanIcon}
}
</script>

<style lang="scss" scoped>
.sidebar{
    display: flex;
    flex-direction: column;
    width: $sidebar-width;
    flex-shrink: 0;
    padding: $space-5 $space-4;
    background: $color-surface;

    &__brand{
        display: flex;
        align-items: center;
        gap: $space-2;
        padding: 0 $space-2;
    }

    &__name{
        font-size: $font-lg;
        font-weight: 600;
    }

    &__nav{
        display: flex;
        flex-direction: column;
        margin-top: $space-4;

        &__name{
            margin-left: $space-2;
        }
    }
    &__icon{
        width: 12px;
        height: 12px;
    }

    &__link{
        display: flex;
        align-items: center;
        padding: $space-2 $space-3;
        font-weight: 500;
        border-radius: $radius-md;

        &:hover,
        &.is-active{
            background: $color-hover;
        }
    }

}
</style>