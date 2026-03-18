<template>
    <div class="p-5">  
        <!-- HeaderControls::Start -->
        <div class="flex justify-between item-center mb-4">
            <button @click="prevMonth" class="text-sm px-2 py-1 border rounded-md">←</button>
            <div class="text-lg font-semibold">{{ currentMonth.format('MMMM YYYY') }}</div>
            <button @click="nextMonth" class="text-sm px-2 py-1 border rounded-md">→</button>
        </div>
        <!-- HeaderControls::End -->
        <!-- DaysOfWeek::Start -->
        <div class="grid grid-cols-7 text-center text-sm text-muted-foreground font-medium mb-2">
            <div v-for="(i) in 7" :key="i">
                {{ dayjs().day(i).format('ddd') }}
            </div>
        </div>
        <!-- DaysOfWeek::End -->

        <!-- MonthGrid::Start -->
        <Dialog>
            <div class="grid grid-cols-7 gap-px bg-border bg-white rounded overflow-hidden text-sm">
                <Card
                    v-for="day in daysInCalendar"
                    :key="day.format('YYYY-MM-DD')"
                    class="p-1 min-h-[80px] relative cursor-pointer hover:bg-muted flex flex-row justify-center items-center"
                    :class="{
                        'text-muted-foreground': !day.isSame(currentMonth, 'month'),
                        'bg-primary/10 border-primary font-semibold': day.isSame(today, 'day')
                    }"
                >
                    <DialogTrigger as-child>
                        <div
                            class="w-full h-full"
                            @click="selectDate(day)"
                        >
                            <CardContent>
                                <div>
                                    <div>
                                        {{ day.format('D') }}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </DialogTrigger>
                    <div
                        v-if="displayPostCounter(day) > 0"
                        class="absolute bottom-1 right-1 bg-green-600 text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                        {{ displayPostCounter(day) }}
                    </div>
                </Card>
            </div>
            
            <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
                <DialogHeader class="p-6 pb-0">
                    <DialogTitle>
                        Bookings for {{ selectedDate.format('MMMM D, YYYY') }}
                    </DialogTitle>
                </DialogHeader>
                <DateDialog 
                    v-if="selectedDate"
                    :date="selectedDate"
                    :bookings="SelectedDatePosts || []"
                />
                <DialogFooter class="p-6 pt-0">
                    <DialogClose as-child>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <!-- MonthGrid::End -->
         <div class="container">
            <p><Button @click="goToRouter('/Admin')">Back To Admin Dashboard</Button></p>
         </div>
    </div>        
        
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import DateDialog from '~/layout/DateDialog.vue'
import { usePosts } from '../composables/Post'

const { getPostsByDate, getPostsByMonth } = usePosts()

dayjs.extend(isToday)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

// ------ Router Navigation --------//
const goToRouter = async (page: string) => {
    await navigateTo(page, { external: true })
}

// ------ Firebase --------//
const today = dayjs()
const currentMonth = ref(dayjs())
const selectedDate = ref(dayjs())


// ------ Next Month Button --------//
const nextMonth = () => {
    currentMonth.value = currentMonth.value.add(1, 'month')
}

// ------ Previous Month Button --------//
const prevMonth = () => {
    currentMonth.value = currentMonth.value.subtract(1, 'month')
}

// ------ Days in Calendar Grid --------//
const daysInCalendar = computed(() => {
    const start = currentMonth.value.startOf('month').startOf('week')
    const end = currentMonth.value.endOf('month').endOf('week')

    const days = []
    let date = start

    while (date.isSameOrBefore(end, 'day')) {
        days.push(date)
        date = date.add(1, 'day')
    }
    return days
})

// ------ Select Date and Fetch Bookings --------//
const selectDate = async (day: dayjs.Dayjs) => {
    selectedDate.value = day
}

// ------ Fetch Bookings for Selected Date --------//
const { data: SelectedDatePosts } = await useAsyncData(
    'bookingsByDate',
    () => getPostsByDate(selectedDate.value),
    {
        watch: [selectedDate],
        server: false
    }
)

// ------ Get All Posts by Month --------//
const { data: allPostsByMonth } = await useAsyncData(
    'allBookings',
    () => getPostsByMonth(currentMonth.value.month() + 1, currentMonth.value.year()),
    {
        server: false
    }
)

// ------ Display Booking Count for Each Day --------//
const displayPostCounter = computed(() => (day: dayjs.Dayjs) => {
    if (!allPostsByMonth.value) return 0
    return allPostsByMonth.value.filter((post) => {
        const correctDate = dayjs(post.Date.toDate()).isSame(day, 'day')
        const correctStatus = post.Status === 'Confirmed'
        return correctDate && correctStatus
    }).length
})

</script>