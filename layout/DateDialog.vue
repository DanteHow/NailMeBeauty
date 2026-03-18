<!-- DateDialog.vue -->
<template>
  <div class="p-6 pt-0">
        <div v-if='bookings.length > 0'>
            <div v-for="(booking, index) in bookings" :key="index" class="mb-4 p-3 border rounded">
                <p>Name: {{ booking.Name }}</p>
                <p>Time: {{ booking.Time ? booking.Time : 'Not specified' }}</p>
                <p>Contact: {{ booking.Contact }}</p>
                <p>Status: {{ booking.Status }}</p>
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
import { Timestamp } from 'firebase/firestore'

interface Booking {
    Name: string;
    Date: Timestamp;
    Contact: string;
    Time?: string ;
    BodyPart: string;
    Requirement?: string[];
    Status: string;
}

const props = defineProps<{
    date: dayjs.Dayjs;
    bookings: Booking[];
}>()

</script>