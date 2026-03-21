<template>
    <div class="flex flex-row min-h-screen justify-center items-center">
        <slot />
    </div>
    <Toaster />
</template>

<script setup>
import { Toaster } from '~/components/ui/sonner'
</script>