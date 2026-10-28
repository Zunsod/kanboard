import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from '~/services/firebase'
import { daysUntil } from '~/utils/date'
let stopOwned = null
let stopShared = null
// localStorage-ийн түлхүүр (хэрэглэгч бүрт тусдаа)
function seenKey(uid) {
  return `kanboard-seen-shared-${uid}`
}

export const state = () => ({
  owned: [],  // миний эзэмшдэг tasks
  shared: [], // надтай хуваалцсан tasks
  ownedLoaded: false,
  sharedLoaded: false,
  seenSharedIds: []
})

// Tootsooolson utguud
export const getters = {
  allTasks(state) {
    return [...state.owned, ...state.shared]
  },
  isLoaded(state) {
    return state.ownedLoaded && state.sharedLoaded
  },
  // Хугацаа хэтэрсэн, өнөөдөр, маргааш дуусах task-ууд (хонх + toast хоёуланд)
  reminders(state, getters) {
    const list = []

    // Огноогоор эрэмбэлэхэд хэтэрсэн нь эхэнд гарна
    const sorted = [...getters.allTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate))

    sorted.forEach((task) => {
      if (task.status === 'done') return

      const days = daysUntil(task.dueDate)

      if (days < 0) {
        list.push({ id: task.id, message: `Хугацаа ${-days} хоног хэтэрсэн: ${task.title}`, type: 'error' })
      } else if (days === 0) {
        list.push({ id: task.id, message: `Өнөөдөр дуусна: ${task.title}`, type: 'warning' })
      } else if (days === 1) {
        list.push({ id: task.id, message: `Маргааш дуусна: ${task.title}`, type: 'info' })
      }
    })

    return list
  },
  newShared(state) {
    return state.shared.filter((task) => !state.seenSharedIds.includes(task.id))
  },
  notifications(state, getters) {
    const sharedItems = getters.newShared.map((task) => ({
      id: `shared-${task.id}`,
      message: `${task.ownerName} танд "${task.title}" task хуваалцлаа`,
      type: 'success'
    }))

    return [...sharedItems, ...getters.reminders]
  }
}
// State uurchluh
export const mutations = {
  SET_OWNED(state, tasks){
    state.owned = tasks
    state.ownedLoaded = true
  },
  SET_SHARED(state, tasks){
    state.shared = tasks
    state.sharedLoaded = true
  },
  SET_SEEN(state, ids){
    state.seenSharedIds = ids
  },
  CLEAR(state){
    state.owned =[]
    state.shared =[]
    state.ownedLoaded = false
    state.sharedLoaded = false
    state.seenSharedIds = []
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
    dispatch('loadSeen')

    const uid = rootState.auth.user.uid
    const tasksRef = collection(db, 'tasks')

    const ownedQuery = query(tasksRef, where('ownerId', '==', uid))

    // Minii ezemshdeg 
    stopOwned = onSnapshot(
      ownedQuery,
      (snapshot) => commit('SET_OWNED', toTasks(snapshot)),
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
  loadSeen({ commit, rootState }) {
    try {
      const saved = localStorage.getItem(seenKey(rootState.auth.user.uid))
      commit('SET_SEEN', JSON.parse(saved) || [])
    } catch (err) {
      commit('SET_SEEN', [])
    }
  },
  markSharedSeen({ state, commit, rootState }) {
    const ids = state.shared.map((task) => task.id)
    commit('SET_SEEN', ids)

    try {
      localStorage.setItem(seenKey(rootState.auth.user.uid), JSON.stringify(ids))
    } catch (err) {
      // localStorage хориглогдсон бол алгасна
    }
  },


  async addTask({rootState}, form){
    const user = rootState.auth.user
    const ref = await addDoc(collection(db, 'tasks'), {
      ...form,
      ownerId: user.uid,
      ownerName: user.displayName || user.email,
      sharedWith: [],
      sharedUsers: [],
      createdAt: serverTimestamp()
    })
    return ref.id
  },
  async updateTask(context, {id, ...changes}){
    await updateDoc(doc(db, 'tasks', id), changes)
  },
  async deleteTask(context, id){
    await deleteDoc(doc(db, 'tasks', id))
  },
  async shareTask({rootState}, {task, email} ){
    const me = rootState.auth.user
    // uurtegu huvaaltsah bolomjgui
    if(email === me.email.toLowerCase()){
      throw new Error('Өөртэйгөө хуваалцах боломжгүй.')
    }
    // users collection-s emaileer haina
    const usersQuery = query(collection(db, 'users'), where('email', '==', email))
    const snapshot = await getDocs(usersQuery)
    if(snapshot.empty){
      throw new Error('Энэ имэйлтэй хэрэглэгч олдсонгүй.')
    }

    const userDoc = snapshot.docs[0]
    const uid = userDoc.id
    const name = userDoc.data().displayName || email

    // ali hediin shared
    if(task.sharedWith.includes(uid)){
      throw new Error('Энэ хэрэглэгчтэй аль хэдийн хуваалцсан байна.')
    }

    // task-d nemeh
    await updateDoc(doc(db, 'tasks', task.id), {
      sharedWith: arrayUnion(uid),
      sharedUsers: arrayUnion({uid, name})
    })
  },
  async unshareTask(context, {task, uid}){
    await updateDoc(doc(db, 'tasks', task.id), {
      sharedWith: arrayRemove(uid),
      sharedUsers: task.sharedUsers.filter((person)=> person.uid !== uid)
    })
  }
}