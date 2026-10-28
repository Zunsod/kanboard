<template>
    <div class="auth">
        <div class="auth__heading">
            <h1 class="auth__title">Тавтай морил</h1>
        </div>
        <form class="auth__form" novalidate @submit.prevent="submit">
            <!-- Error heseg -->
            <div v-if="error" class="auth__alert">
                <strong>Нэвтэрч чадсангүй</strong>
                <span>{{ error }}</span>
            </div>
            <label class="field">
                <span class="field__label">Имэйл хаяг</span>
                <input 
                    v-model="email" 
                    class="field__input" 
                    type="email" 
                    placeholder="name@example.com"
                    @input="emailError = ''"
                />
                <span v-if="emailError" class="field__error">{{ emailError }}</span>
            </label>
            <label class="field">
                <span class="field__label">Нууц үг</span>
                <input 
                    v-model="password" 
                    class="field__input" 
                    :type="passwordType" 
                    @input="passwordError = ''"
                />
                <span v-if="passwordError" class="field__error">{{ passwordError }}</span>
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
import { authErrorMessage } from '~/services/authErrors';

export default {
    name: 'LoginPage',
    layout: 'auth',

    data() {
        return {
        email: '',
        password: '',
        showPassword: false,
        error: '',
        emailError: '', 
        passwordError: '', 
        loading: false
        }
    },
    computed: {
        passwordType() {
            return this.showPassword ? 'text' : 'password'
        }
    },
    methods:{
        validate() {
            this.emailError = ''
            this.passwordError = ''
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (this.email.trim() === '') {
            this.emailError = 'Имэйл хаягаа оруулна уу.'
            } else if (!emailPattern.test(this.email)) {
            this.emailError = 'Имэйл хаяг буруу байна.'
            }
            if (this.password === '') {
            this.passwordError = 'Нууц үгээ оруулна уу.'
            }
            return this.emailError === '' && this.passwordError === ''
        },

        async submit(){
            this.error = ''
            if(!this.validate()) return
            this.loading = true
            try{
                await this.$store.dispatch('auth/login', {
                    email: this.email,
                    password: this.password
                })
                this.$router.push('/')
                // toast message
                this.$store.dispatch('toast/show', {
                    message: 'Амжилттай нэвтэрлээ',
                    type: 'success'
                })
            } catch (err){
                this.error = authErrorMessage(err.code)
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