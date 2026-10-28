<template>
    <div class="auth">
        <div class="auth__heading">
            <h1 class="auth__title">Тавтай морил</h1>
        </div>
        <form class="auth__form" @submit.prevent="submit">
            <!-- Error heseg -->
            <div v-if="error" class="auth__alert">
                <strong>Нэвтэрч чадсангүй</strong>
                <span>{{ error }}</span>
            </div>
            <label class="field">
                <span class="field__label">Имэйл хаяг</span>
                <input v-model="email" class="field__input" type="email" required />
            </label>
            <label class="field">
                <span class="field__label">Нууц үг</span>
                <input v-model="password" class="field__input" :type="passwordType" required />
            </label>

            <div class="auth__options">
                <label class="auth__checkbox">
                    <input v-model="showPassword" type="checkbox" />
                    Нууц үг харуулах
                </label>
                <a href="#" class="auth__link" @click.prevent>Нууц үг мартсан?</a>
            </div>
            <button class="auth__button" type="submit" :disabled="loading">
                {{ loading ? 'Нэвтэрч байна...' : 'Нэвтрэх' }}
            </button>
        </form>
        <p class="auth__switch">
            Шинэ хэрэглэгч үү?
            <NuxtLink to="/signup">Бүртгүүлэх</NuxtLink>
        </p>
    </div>
</template>
<script>
import { authErrorMessages } from '~/services/authErrors';

export default {
    name: 'LoginPage',
    layout: 'auth',

    data() {
        return {
        email: '',
        password: '',
        showPassword: false,
        error: '',
        loading: false
        }
    },
    computed: {
        passwordType() {
            return this.showPassword ? 'text' : 'password'
        }
    },
    methods:{
        async submit(){
            this.error = ''
            this.loading = true
            try{
                await this.$store.dispatch('auth/login', {
                    email: this.email,
                    password: this.password
                })
                this.$router.push('/')
            } catch (err){
                this.error = authErrorMessages(err.code)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/auth';
.auth__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: $font-sm;
}
.auth__checkbox {
  display: flex;
  align-items: center;
  gap: $space-2;
}
.auth__link {
  text-decoration: underline;
}
</style>