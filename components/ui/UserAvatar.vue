<template>
  <span class="avatar" :style="{ background: color }" :title="name">
    {{ initial }}
  </span>
</template>

<script>
const UNGU = ['#6c8ebf', '#d79b6a', '#7bb092', '#b07bb0', '#d9778a', '#8a8fd6']

export default{
    name: 'UserAvatar',
    props: {
        name: { type: String, required: true }
    },
    // ner show hiih ehni useg+ungu
    computed: {
        initial() {
            return this.name.trim().charAt(0).toUpperCase()
        },
        color() {
            let sum = 0
            for (const ch of this.name) sum += ch.charCodeAt()
            return UNGU[sum % UNGU.length]
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar {
  @include flex-center;
  display: inline-flex;
  flex-shrink: 0;
  color: #fff;
  width: 32px;
  height: 32px;
  font-weight: 600;
  border-radius: $radius-full;
}
</style>