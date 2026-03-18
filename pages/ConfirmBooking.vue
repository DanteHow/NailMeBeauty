<template>
    <div class="m-2 p-2">
        <h1><strong>Pending Bookings: {{ displayPostCounter() }}</strong></h1>
    </div>
    <div v-for="post in Posts" :key="post.id" class="mb-4 p-3 border rounded flex flex-col mt-4">
        <p>Name: {{ post.Name }}</p>
        <p>Date: {{ post.Date.toDate() }}</p>
        <p>Contact: {{ post.Contact }}</p>
        <p>Body Part: {{ post.BodyPart }}</p>
        <p>Status: {{ post.Status }}</p>
        <div>
            <form @submit.prevent="SubmitConfirmation(post.id)" class="flex space-x-4 mt-4">
                <FormField v-slot="{ componentField }" name="StartTime">
                    <FormItem>
                        <FormLabel>Start Time: </FormLabel>
                        <Select v-bind="componentField">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Start Time"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup v-for="StartTime in TimeValue" :key="StartTime">
                                    <SelectItem :value="StartTime">
                                        {{ StartTime }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="EndTime">
                    <FormItem>
                        <FormLabel>End Time: </FormLabel>
                        <Select v-bind="componentField">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="End Time"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup v-for="EndTime in TimeValue" :key="EndTime">
                                    <SelectItem :value="EndTime">
                                        {{ EndTime }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormItem>
                </FormField>
                <Button type="submit">Confirm Booking</Button>
            </form>
            <div class="flex space-x-4 mt-4">
                <Button @click="DeleteBooking(post.id)">Delete Booking</Button>
                
            </div>
        </div>
        
    </div>
    <div class="m-2 p-2"><Button @click="goToRouter('/Admin')">Back To Admin Dashboard</Button></div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { usePosts } from '../composables/Post'
import { FormField } from '~/components/ui/form'

const { getPendingPosts, UpdatePosts, DeletePosts } = usePosts()

const TimeValue = ref([
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
])

// ------ Router Navigation --------//
const goToRouter = async (page: string) => {
    await navigateTo(`${page}`, { external: true })
}

const { data: Posts } = await useAsyncData(
    'allBookings',
    () => getPendingPosts(),
    {
        server: false
    }
)

// ------ Display Booking Count for Each Day --------//
const displayPostCounter = () => {
    if (!Posts.value) return 0
    return Posts.value.length
}

// ------ Update Booking Status to Confirmed --------//
const { handleSubmit, values } = useForm({})

const SubmitConfirmation = (id: string) => handleSubmit(async (values) => {
    
    const TimeFormat = `${values.StartTime} - ${values.EndTime}`
    console.log('Selected Time:', TimeFormat)
    console.log('Booking ID:', id)

    try {
        await UpdatePosts(id, {
            Status: 'Confirmed',
            Time: TimeFormat
        })
        await navigateTo('/ConfirmBooking', { external: true })
        console.log(`Booking ${id} confirmed successfully.`)

    } catch (error) {
        console.error(`Failed to confirm booking ${id}:`, error)
    }
})()

const DeleteBooking = async (id: string) => {
    try {
        await DeletePosts(id)
        await navigateTo('/ConfirmBooking', { external: true })
        console.log(`Booking ${id} deleted successfully.`)

    } catch (error) {
        console.error(`Failed to delete booking ${id}:`, error)
    }
}

</script>