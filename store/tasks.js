import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '~/services/firebase'

let stopOwned = null
let stopShared = null


export const state = () => ({
  owned: [],  // миний эзэмшдэг tasks
  shared: [], // надтай хуваалцсан tasks
  loading: true
})

// Tootsooolson utguud
export const getters = {
  allTasks(state) {
    return [...state.owned, ...state.shared]
  }
}
// State uurchluh
export const mutations = {
  SET_OWNED(state, tasks){
    state.owned = tasks
  },
  SET_SHARED(state, tasks){
    state.shared = tasks
  },
  SET_LOADING(state, value){
    state.loading = value
  },
  CLEAR(state){
    state.owned =[]
    state.shared =[]
  }
}

// Firestore-iin snapshot-iig engiin massive bolgono
function toTasks(snapshot){
  return snapshot.docs.map((d)=> ({id: d.id, ...d.data()}))
}

export const actions = {
  // Firestore-ийг сонсож эхлэх (board нээгдэхэд)
  subscribe({ commit, dispatch, rootState }) {
    dispatch('unsubscribe')

    const uid = rootState.auth.user.uid
    const tasksRef = collection(db, 'tasks')

    const ownedQuery = query(tasksRef, where('ownerId', '==', uid))

    // Minii ezemshdeg 
    stopOwned = onSnapshot(
      ownedQuery,
      (snapshot) => {
        commit('SET_OWNED', toTasks(snapshot))
        commit('SET_LOADING', false)
      },
      (err) => console.error('Owned tasks:', err)
    )
    // Nadtai huvaaltssan
    const sharedQuery = query(tasksRef, where('sharedWith', 'array-contains', uid))
    stopShared = onSnapshot(
      sharedQuery,
      (snapshot) => commit('SET_SHARED', toTasks(snapshot)),
      (err) => console.error('Shared tasks:', err)
    )
  },

  unsubscribe({commit}){
    if (stopOwned) stopOwned()
    if (stopShared) stopShared()
    stopOwned = null
    stopShared = null
    commit('CLEAR')
  },
  async addTask({rootState}, form){
    const user = rootState.auth.user
    await addDoc(collection(db, 'tasks'), {
      ...form,
      ownerId: user.uid,
      ownerName: user.displayName || user.email,
      sharedWith: [],
      sharedUsers: [],
      createdAt: serverTimestamp()
    })
  },
  async updateTask(context, {id, ...changes}){
    await updateDoc(doc(db, 'tasks', id), changes)
  },
  async deleteTask(context, id){
    await deleteDoc(doc(db, 'tasks', id))
  }
}