<!-- DateDialog.vue -->
<template>
  <div class="p-6 pt-0">
        <div v-if='bookings.length > 0'>
            <div v-for="(booking, index) in bookings" :key="index" class="mb-4 p-3 border rounded">
                <p>Time: {{ booking.Time }}</p>
                <!-- Add other booking details you want to display -->
            </div>
        </div>
        <div v-else class="text-muted-foreground text-center py-4">
        No bookings for this date
        </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

interface Booking {
    Time: string
    // Add other booking properties
}

const props = defineProps({
    date: {
        type: Object as () => dayjs.Dayjs,
        required: true
    },
    bookings: {
        type: Array as () => Booking[],
        default: () => []
    }
})
</script>