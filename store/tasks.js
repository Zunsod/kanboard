// Ugugdul
export const state = () => ({
  items: [
    { id: 1, title: 'Mobile app design', dueDate: '2026-10-20', priority: 'high', status: 'in-progress', owner: 'Зөнсод', sharedWith: ['Болд', 'Сараа'] },
    { id: 2, title: 'Monitor revenue updates', dueDate: '2026-10-28', priority: 'medium', status: 'in-progress', owner: 'Зөнсод', sharedWith: [] },
    { id: 3, title: 'Research website', dueDate: '2026-11-08', priority: 'medium', status: 'todo', owner: 'Зөнсод', sharedWith: [] },
    { id: 4, title: 'Solar web-app design', dueDate: '2026-10-30', priority: 'high', status: 'todo', owner: 'Болд', sharedWith: ['Зөнсод'] },
    { id: 5, title: 'Design system', dueDate: '2026-10-15', priority: 'low', status: 'done', owner: 'Болд', sharedWith: ['Зөнсод'] }
  ]
})

// Tootsooolson utguud
export const getters = {
  todoTasks(state) {
    return state.items.filter((task) => task.status === 'todo')
  },
  inProgressTasks(state) {
    return state.items.filter((task) => task.status === 'in-progress')
  },
  doneTasks(state) {
    return state.items.filter((task) => task.status === 'done')
  }
}
// State uurchluh
export const mutations = {
  ADD_TASK(state, task) {
    state.items.push(task)
  },
  UPDATE_TASK(state, updatedTask) {
    const index = state.items.findIndex((task) => task.id === updatedTask.id)
    if (index !== -1) state.items.splice(index, 1, updatedTask)
  },
  DELETE_TASK(state, id) {
    state.items = state.items.filter((task) => task.id !== id)
  }
}