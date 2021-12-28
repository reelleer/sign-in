<template>
  <form id="profile-mobile" ref="form">
    <fieldset v-if="show_mobile_input" id="phone">
      <legend :class="{ valid: validate_mobile_number() }">
        {{ mobile_display }}
      </legend>
      <input
        id="mobile"
        ref="mobile_el"
        v-model="mobile"
        type="tel"
        placeholder="1 (555) 555-5555"
        @keypress="mobile_keypress"
        @keyup="validate_mobile_number"
        @paste.prevent="mobile_paste" />
    </fieldset>
    <fieldset v-if="show_captcha" id="captcha" :class="{ hide_captcha }" />
    <fieldset v-if="show_code">
      <input
        id="verification-code"
        v-model="code"
        type="tel"
        required
        autocomplete="one-time-code"
        placeholder="Verification Code"
        @keypress="code_keypress" />
    </fieldset>
    <icon v-if="working" name="working" />
    <menu v-else>
      <button
        v-if="show_authorize"
        id="authorize"
        :disabled="disabled_sign_in"
        @click.prevent="begin_authorization">
        Sign on
      </button>
      <button
        v-if="show_code"
        id="submit-verification"
        @click.prevent="sign_in_with_code">
        Sign on
      </button>
    </menu>
  </form>
</template>
<script setup>
  //import { ref, toRef, computed, watch, nextTick, onMounted } from 'vue'
  import { ref, computed, watch, nextTick } from 'vue'
  import { parseNumber, AsYouType } from 'libphonenumber-js'
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import { as_phone_number } from '@/use/profile'
  import icon from '@/components/icon'

  const props = defineProps({
    person: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['update:person', 'signed-on'])

  const mobile = ref(null)
  const working = ref(false) //true
  const disabled_sign_in = ref(true)
  const code = ref(null)
  const show_authorize = ref(true) //false
  const show_captcha = ref(false)
  const hide_captcha = ref(false)
  const show_code = ref(false)

  const show_mobile_input = computed(() => {
    if (working.value) return false
    return true
  })

  const mobile_display = computed(() => {
    if (props.person.mobile)
      return new AsYouType('US').input(props.person.mobile)
    else return 'Mobile'
  })

  watch(mobile, () => {
    const update = { ...props.person }
    update.mobile = mobile.value
    emit('update:person', update)
  })

  const validate_mobile_number = () => {
    const is_valid =
      !!props.person.mobile && parseNumber(props.person.mobile, 'US').phone
    disabled_sign_in.value = !is_valid

    return is_valid
  }

  if (as_phone_number(props.person.id).length)
    mobile.value = as_phone_number(props.person.id)

  validate_mobile_number()

  const mobile_el = ref(null)

  const disable_input = () => {
    mobile_el.value.disabled = true
  }

  const form = ref(null)

  let human = null
  let authorizer = null

  const text_human_verify_code = async () => {
    working.value = false
    show_code.value = true
    show_captcha.value = false
    hide_captcha.value = true
    authorizer = await firebase
      .auth()
      .signInWithPhoneNumber(`+1${props.person.mobile}`, human)
    form.value.querySelector('#verification-code').scrollIntoView(false)
    form.value.querySelector('#verification-code').focus()
  }

  const begin_authorization = async () => {
    // this.working = true
    disable_input()
    show_authorize.value = false
    show_captcha.value = true
    await nextTick()

    human = new firebase.auth.RecaptchaVerifier('captcha', {
      size: 'invisible',
      callback: text_human_verify_code
    })

    human.verify()
  }

  const sign_in_with_code = async () => {
    working.value = true
    disable_input()
    show_code.value = false
    try {
      await authorizer.confirm(code.value)
      emit('signed-on', props.person)
    } catch (e) {
      if (e.code === 'auth/invalid-verification-code') {
        mobile_el.value.disabled = false
        show_code.value = true
      }
    }
  }

  const mobile_keypress = event => {
    if (!event.key.match(/^\d$/)) event.preventDefault()
  }

  const mobile_paste = event => {
    const past_text = event.clipboardData.getData('text/plain')
    const phone_number = parseNumber(past_text, 'US').phone

    if (phone_number) {
      const update = { ...props.person }
      update.mobile = phone_number
      emit('update:person', update)
      return validate_mobile_number()
    } else return false
  }

  const code_keypress = event => {
    if (!event.key.match(/^\d$/)) event.preventDefault()
    const button = form.value.querySelector('#submit-verification')
    const input = form.value.querySelector('#verification-code')
    if (input.value.length === 5) button.disabled = false
    else button.disabled = true
  }
</script>
<style lang="stylus">
  form#profile-mobile
    animation-name: slide-in-left
    svg.remove
      fill: red
    fieldset
      margin-bottom: base-line
    input#mobile
      min-width: (40% - base-line * 2)
      margin-right: base-line
    button#sign-out
      border: none
      padding: 0
    menu
      display: flex
      justify-content: flex-end
</style>
