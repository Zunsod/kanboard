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

let stopOwned = null
let stopShared = null


export const state = () => ({
  owned: [],  // миний эзэмшдэг tasks
  shared: [], // надтай хуваалцсан tasks
  ownedLoaded: false, 
  sharedLoaded: false  
})

// Tootsooolson utguud
export const getters = {
  allTasks(state) {
    return [...state.owned, ...state.shared]
  },
  isLoaded(state) {
    return state.ownedLoaded && state.sharedLoaded
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
  CLEAR(state){
    state.owned =[]
    state.shared =[]
    state.ownedLoaded = false
    state.sharedLoaded = false
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