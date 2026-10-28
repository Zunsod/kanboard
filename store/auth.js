import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '~/services/firebase'

export const state = () => ({
    user: null, // { uid, email, displayName } or null
    ready: false  // Firebase user-g shalgaj duussan eseh
})

export const mutations = {
    SET_USER(state, user){
        state.user = user
    },
    SET_READY(state, value){
        state.ready = value
    } 
}

export const actions = {
    init({commit}){
        return new Promise((resolve)=>{
            onAuthStateChanged(auth, (firebaseUser)=>{
                if(firebaseUser){
                    commit('SET_USER', {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName
                    })
                } else {
                    commit('SET_USER', null)
                }

                commit('SET_READY', true)
                resolve()
            })
        })
    },

    async signup({commit}, {name, email, password}){
        // Firebase auth-d hereglegch uusgene, password-g firebase hash hiine
        const result = await createUserWithEmailAndPassword(auth, email, password)
        // Username hadgalah
        await updateProfile(result.user, {displayName: name})
        // users collection-d huulna, email r share hiihed hergtei
        await setDoc(doc(db, 'users', result.user.uid),{
            email, 
            displayName: name
        })

        commit('SET_USER', {
            uid: result.user.uid,
            email,
            displayName: name
        })
    },

    async login(context, {email, password}){
        await signInWithEmailAndPassword(auth, email, password)
    },

    async logout(){
        await signOut(auth)
    }
}
