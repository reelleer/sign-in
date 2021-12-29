import { ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'

export default function useAuthStateChanged(observer) {
  const signed_in = ref(false)

  firebase.auth().onAuthStateChanged(user => {
    if (user) signed_in.value = true
    else signed_in.value = false
  })

  if (observer) firebase.auth().onAuthStateChanged(observer)

  const signOut = () => firebase.auth().signOut()

  return { signed_in, signOut }
}
