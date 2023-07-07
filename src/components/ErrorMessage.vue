<script setup lang="ts">
    import { onMounted } from 'vue'

    const props = defineProps<{
        errorMessage: string,
        errorColor: 'rgb(255, 82, 82)' | 'green'
    }>()



    const emit = defineEmits(['removeMessage'])

    onMounted(() => {

        setTimeout(() => {
            emit('removeMessage')
        }, 2000)
    })

</script>

<template>
    <div 
    :style="{background: props.errorColor}"
    class="error-message">
        {{ props?.errorMessage }}
    </div>
</template>

<style lang="scss">
    .error-message {
        position: absolute;
        padding: 8px;
        right: 20px;
        top: 10px;
        z-index: 2;
        border-radius: 10px;
        color: #FFF;
    }



</style>