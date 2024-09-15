export const isDev = ref(false)
export function toggleDev() {
    isDev.value = !isDev.value
}
