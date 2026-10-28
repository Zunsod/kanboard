export default async function({store, route, redirect}) {
    if(!store.state.auth.ready){
        await store.dispatch('auth/init')
    }
    const user = store.state.auth.user
    const isAuthPage = route.path === '/login' || route.path === '/signup'

    if(!user && !isAuthPage){
        return redirect('/login')
    }

    if(user && isAuthPage){
        return redirect('/')
    }
}