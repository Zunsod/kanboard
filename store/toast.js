export const state = () => ({
  items: [] // { id, message, type }
})

export const mutations = {
  ADD(state, toast) {
    state.items.push(toast)
  },
  REMOVE(state, id) {
    state.items = state.items.filter((toast) => toast.id !== id)
  }
}

export const actions = {
  show({ commit }, { message, type = 'info' }) {
    const id = Date.now() + Math.random()
    commit('ADD', { id, message, type })

    // 3 секундийн дараа өөрөө алга болно
    setTimeout(() => {
      commit('REMOVE', id)
    }, 3000)
  }
}