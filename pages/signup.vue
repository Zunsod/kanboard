<template>
    <div class="auth">
        <div class="auth__heading">
            <h1 class="auth__title">Бүртгэл үүсгэх</h1>
        </div>
        <form class="auth__form" @submit.prevent="submit">
            <!-- Firebase-iin aldaa -->
            <div v-if="error" class="auth__alert">
                <strong>Бүртгэл үүсгэж чадсангүй</strong>
                <span>{{ error }}</span>
            </div>
            <label class="field">
                <span class="field__label">Хэрэглэгчийн нэр</span>
                <input v-model="name" class="field__input" type="text" />
            </label>
            <label class="field">
                <span class="field__label">Имэйл хаяг</span>
                <input v-model="email" class="field__input" type="email" />
            </label>
            <!-- Password shaardlaguud -->
            <div class="field">
                <label class="field__label" for="password">Нууц үг</label>
                <input id="password" v-model="password" class="field__input" :type="passwordType" />
                <div class="rules">
                    <span class="rules__item" :class="{ 'rules__item--ok': hasMinLength }">
                        * Хамгийн багадаа 8 тэмдэгт
                    </span>
                    <span class="rules__item" :class="{ 'rules__item--ok': hasLetterAndNumber }">
                        * Үсэг ба тоо
                    </span>
                </div>
            </div>
            <!-- Nuuts ug dahiad -->
            <label class="field">
                <span class="field__label">Нууц үг давтах</span>
                <input
                v-model="confirmPassword"
                class="field__input"
                :class="{ 'field__input--error': showMismatch }"
                :type="passwordType"
                />
                <span v-if="showMismatch" class="field__error">Нууц үг таарахгүй байна. Ижил нууц үг оруулна уу.</span>
            </label>
            <label class="auth__checkbox">
                <input v-model="showPassword" type="checkbox" />
                Нууц үг харуулах
            </label>
            <button class="auth__button" type="submit" :disabled="!isValid || loading">
                {{ loading ? 'Бүртгэл үүсгэж байна...' : 'Бүртгэл үүсгэх' }}
            </button> 
            <p v-if="!isValid" class="auth__hint">Бүх талбарыг зөв бөглөсний дараа бүртгэл үүснэ.</p>    
        </form>
        <p class="auth__switch">
            Бүртгэлтэй юу?
            <NuxtLink to="/login">Нэвтрэх</NuxtLink>
        </p>

    </div>
</template>
<script>
import { authErrorMessage } from '~/services/authErrors'
export default {
    name: 'SignupPage',
    layout: 'auth',
    data(){
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            error: '',
            loading: false
        }
    },
    computed: {
        passwordType(){
            return this.showPassword ? 'text' : 'password'
        },
        hasMinLength() {
            return this.password.length >= 8
        },
        hasLetterAndNumber() {
            const hasLetter = /[a-zA-Zа-яА-ЯөүӨҮёЁ]/.test(this.password)
            const hasNumber = /[0-9]/.test(this.password)
            return hasLetter && hasNumber
        },
        showMismatch() {
            return this.confirmPassword !== '' && this.confirmPassword !== this.password
        },
        isValid() {
            return (
                this.name.trim() !== '' &&
                this.email.includes('@') &&
                this.hasMinLength &&
                this.hasLetterAndNumber &&
                this.confirmPassword === this.password
            )
        }
    },
    methods:{
        async submit(){
            if(!this.isValid) return
            this.error = ''
            this.loading = true
            try {
                await this.$store.dispatch('auth/signup', {
                    name: this.name.trim(),
                    email: this.email,
                    password: this.password
                })
                this.$router.push('/')
            } catch(err) {
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
.auth__checkbox {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $font-sm;
}
.auth__hint {
  font-size: $font-xs;
  color: $color-text-muted;
}
// Nuuts ug taarahgui uyd
.field__input--error {
  border-color: $color-danger;
}
.field__error {
  font-size: $font-sm;
  color: $color-danger;
}
.rules {
  display: flex;
  gap: $space-4;
  font-size: $font-xs;
  color: $color-text-subtle;

  &__item--ok {
    color: $low-text; 
  }
}
</style>