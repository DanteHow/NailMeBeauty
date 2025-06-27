<template>
    <div>{{ bookings }}</div>
    
</template>

<script setup lang="ts">
const { getAllBookings, getBookingById } = useBookings()
const bookings = ref()

onMounted( async () => {
    bookings.value = await getAllBookings()
})


</script>