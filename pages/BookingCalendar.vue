<template>
    <div class="p-5">  
        <!-- HeaderControls::Start -->
        <div class="flex justify-between item-center mb-4">
            <button @click="prevMonth" class="text-sm px-2 py-1 border rounded-md">←</button>
            <div class="text-lg font-semibold">{{ currentMonth.format('MMMM YYYY') }}</div>
            <button @click="nextMonth" class="text-sm px-2 py-1 border rounded-md">→</button>
        </div>
        <!-- HeaderControls::End -->
        <div v-for="booking in bookings">
            <div>Object: {{ booking }}</div>
            <div>id: {{ booking.id }}</div>
        </div>
        <!-- DaysOfWeek::Start -->
        <div class="grid grid-cols-7 text-center text-sm text-muted-foreground font-medium mb-2">
            <div v-for="(d, i) in 7" :key="i">
                {{ dayjs().day(i).format('ddd') }}
            </div>
        </div>
        <!-- DaysOfWeek::End -->

        <!-- MonthGrid::Start -->
        <Dialog>
            <div class="grid grid-cols-7 gap-px bg-border border rounded overflow-hidden text-sm">
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
                                    <div
                                        v-if="getBookingCount(day) > 0"
                                        class="absolute bottom-1 right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                                    >
                                        {{ getBookingCount(day) }}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </DialogTrigger>
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
                    :bookings="selectedDateBookings"
                />
                <DialogFooter class="p-6 pt-0">
                    <DialogClose as-child>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <!-- MonthGrid::End -->
    </div>        
        
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { useBookings } from '~/composables/useBookings'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import DateDialog from '~/layout/DateDialog.vue'

dayjs.extend(isToday)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

interface Booking {
    id: string;
    Name: string;
    Date: any;
    Contact: any;
    Time: any;
    BodyParts: any;
    Requirement: any;
}

// ------ Firebase --------//
const { getAllBookings, fetchSlot, getBookingByDate } = useBookings()
const bookings = ref<Booking[]>([])

onMounted( async () => {
    const respone = await getAllBookings()
    respone.forEach(list => console.log(list))
})

const today = dayjs()
const currentMonth = ref(dayjs())
const selectedDate = ref(dayjs())
const selectedDateBookings = ref<any[]>([])

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

const selectDate = async (day: dayjs.Dayjs) => {
    selectedDate.value = day
    selectedDateBookings.value = await getBookingByDate(day)
    selectedDateBookings.value.forEach(doc => console.log(doc))
}

const nextMonth = () => {
    currentMonth.value = currentMonth.value.add(1, 'month')
}

const prevMonth = () => {
    currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const bookingsByDate = computed(() => {
    const result: Record<string, number> = {}
    if(!bookings.value) return result

    bookings.value.forEach((booking: Booking) => {
        const dateKey = dayjs(booking.Date).format('YYYY-MM-DD')
        result[dateKey] = (result[dateKey] || 0) + 1
    })

    return result
})

const getBookingCount = (day: dayjs.Dayjs) => {
    const dateKey = day.format('YYYY-MM-DD')
    return bookingsByDate.value[dateKey] || 0
}

</script>