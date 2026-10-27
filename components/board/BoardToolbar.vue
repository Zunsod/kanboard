<template>
    <div class="toolbar">
        <!-- Tab heseg -->
        <div class="tabs">
            <button
                v-for="tab in tabs"
                :key="tab.value"
                class="tabs__item"
                :class="{'tabs__item--active': tab.value === activeTab}"
                type="button"
                @click="$emit('change-tab', tab.value)"
            >
            {{ tab.label }}
            </button>
        </div>
        <!-- Search bolon erembe -->
        <div class="toolbar__right">
            <label class="search">
                <SearchIcon class="search__icon" />
                <input
                    class="search__input"
                    type="text"
                    placeholder="Task хайх..."
                    :value="search"
                    @input="$emit('search', $event.target.value)"
                />
            </label>
            <!-- Erembeleh -->
            <select class="sort" :value="sortBy" @change="$emit('sort', $event.target.value)">
                <option value="dueDate">Deadline · ойрхон нь эхэнд</option>
                <option value="priority">Ач холбогдол · өндөр нь эхэнд</option>
            </select>

            <button class="add-btn" type="button" @click="$emit('add')">
                <PlusIcon class="add-btn__icon" />
                Нэмэх   
            </button>
        </div>
    </div>
</template>
<script>
import { PlusIcon, SearchIcon} from 'vue-tabler-icons';

export default{
    name: 'BoardToolbar',
    components: {PlusIcon, SearchIcon},
    props:{
        activeTab: { type: String, default: 'all' },
        search: { type: String, default: '' },
        sortBy: { type: String, default: 'dueDate' }
    },
    data() {
        return {
            tabs: [
                { value: 'all', label: 'Бүгд' },
                { value: 'mine', label: 'Миний task' },
                { value: 'shared', label: 'Надтай хуваалцсан' }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap; // delgets jijgervel doosh shiljine
  align-items: center;
  justify-content: space-between;
  gap: $space-3;

  &__right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-2;
  }
}

.tabs {
  display: flex;
  gap: $space-1;
  padding: $space-1;
  background: $color-hover;
  border-radius: $radius-md;

  &__item {
    padding: $space-2 $space-3;
    font-size: $font-sm;
    color: $color-text-muted;
    border-radius: $radius-sm;

    &--active {
      font-weight: 500;
      color: $color-text;
      background: $color-surface;
    }
  }
}

.search {
  display: flex;
  align-items: center;
  gap: $space-2;
  height: 36px;
  padding: 0 $space-3;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-full;

  &__icon {
    width: 16px;
    height: 16px;
    color: $color-text-subtle;
  }

  &__input {
    width: 180px;
    background: transparent;
    border: none;
    outline: none;
  }
}

.sort {
  height: 36px;
  padding: 0 $space-3;
  font-size: $font-sm;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: $space-1;
  height: 36px;
  padding: 0 $space-4;
  font-weight: 500;
  color: $color-on-primary;
  background: $color-primary;
  border-radius: $radius-md;

  &:hover {
    background: $color-primary-hover;
  }

  &__icon {
    width: 16px;
    height: 16px;
  }
}
</style>