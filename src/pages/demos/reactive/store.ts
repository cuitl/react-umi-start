import { ref } from '@vue/reactivity'

export const count = ref(0)

export const increase = () => {
  count.value++
}

export const decrease = () => {
  count.value--
}
