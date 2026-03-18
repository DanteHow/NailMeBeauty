<template>
    <Card>
        <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Welcome to the admin panel</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
            <Card>
                <CardHeader>
                    <CardTitle>Pending Bookings</CardTitle>
                    <CardDescription>Manage your pending bookings here</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div>{{ displayPostCounter }}</div>
                    <div><Button @click="goToRouter('/ConfirmBooking')">Manage Bookings</Button></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Booking Calendar</CardTitle>
                    <CardDescription>View and manage bookings by date</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <Button @click="goToRouter('/BookingCalendar')">Calendar</Button>
                </CardContent>
            </Card>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import Separator from '~/components/ui/separator/Separator.vue';
import { usePosts } from '../composables/Post'

const { getPendingPosts } = usePosts()

const { data: Posts } = await useAsyncData(
    'allBookings',
    () => getPendingPosts(),
    {
        server: false
    }
)

// ------ Display Booking Count for Each Day --------//
const displayPostCounter = computed(() => {
    if (!Posts.value) return 0
    return Posts.value.length
})

const goToRouter = async (page: string) => {
    await navigateTo(`${page}`, { external: true })
}

</script>