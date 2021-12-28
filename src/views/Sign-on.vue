<template>
  <section id="sign-on" class="page">
    <header>
      <h3>{{ person.first_name }} {{ person.last_name }}</h3>
      <menu v-if="signed_in">
        <button @click="sign_off">Sign off</button>
      </menu>
    </header>
    <mobile-as-form
      v-if="!signed_in"
      v-model:person="person"
      @signed-on="signed_on" />
    <name-as-form v-if="nameless" v-model:person="person" @valid="new_person" />
  </section>
</template>
<script setup>
  import { ref, reactive } from 'vue'
  import mobileAsForm from '@/components/profile/as-form-mobile.vue'
  import nameAsForm from '@/components/profile/as-form-name.vue'
  import useAuthStateChanged from '@/mixins/signed_in.js'

  const person = ref(
    reactive({
      mobile: ''
    })
  )

  const auth_state = user => {
    if (user && person.value) person.value.mobile = null
  }

  const { signed_in, signOut } = useAuthStateChanged(auth_state)

  const sign_off = () => {
    signOut()
    nameless.value = false
    person.value.first_name = null
    person.value.last_name = null
  }

  const nameless = ref(false)

  const signed_on = async () => {
    nameless.value = true
  }

  const new_person = () => (nameless.value = false)
</script>
<style lang="stylus">
  section#sign-on.page
    margin:auto
    display: flex
    flex-direction: column
    justify-content: space-between
    & > header > h3
      margin: 0
    form
    footer
      padding: base-line
      padding-top: 0
    & > footer > button
      opacity: 0.5
      &:hover
        opacity: 1
    @media (min-width: pad-begins)
      form, header
        align-self: center
      header
        width: 29rem
        margin: base-line
</style>
