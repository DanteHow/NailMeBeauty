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
            <div v-for="(d, i) in 7" :key="i">
                {{ dayjs().day(i).format('ddd') }}
            </div>
        </div>
        <!-- DaysOfWeek::End -->

        <!-- MonthGrid::Start -->
        <Dialog>
            <DialogTrigger as-child>
                <div class="grid grid-cols-7 gap-px bg-border border rounded overflow-hidden text-sm">
                    <Card
                        v-for="day in daysInCalendar"
                        :key="day.format('YYYY-MM-DD')"
                        class="p-1 min-h-[80px] relative cursor-pointer hover:bg-muted flex flex-row justify-center items-center"
                        :class="{
                            'text-muted-foreground': !day.isSame(currentMonth, 'month'),
                            'bg-primary/10 border-primary font-semibold': day.isSame(today, 'day')
                        }"
                        @click="selectDate(day)"
                    >
                        <CardContent>
                            <div>
                                <!-- DayNumber::Start -->
                                <div class="absolute top-1 left-1 text-s">
                                    {{ day.format('D') }}
                                </div>
                                <!-- DayNumber::End -->
                                <!-- SlotHint::Start -->
                                <div v-if="hasSlot(day)" class="font-medium text-sm text-center"> <!-- If Slot isNotEmpty: True else empty div -->
                                    Booking: {{ slotDates.filter(count => count === day.format('YYYY-MM-DD')).length }}
                                </div>
                                <!-- SlotHint::Start -->
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
                <DialogHeader class="p-6 pb-0">
                    <DialogTitle>
                        DialogTitle
                    </DialogTitle>
                    <DialogDescription>
                        This is the booking list description
                    </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4 overflow-y-auto px-6">
                    <div v-for="weekday in daysInCalendar" class="flex flex-col justify-between">
                        {{ weekday.format('YYYY-MM-DD') }}
                    </div>
                </div>
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
import { doc } from 'firebase/firestore'

dayjs.extend(isToday)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const today = dayjs()
const currentMonth = ref(dayjs())
const slotDates = ref<any[]>([])

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
    const DialogList = await getBookingByDate(day)
    DialogList.forEach(doc => console.log(doc.Time))
}

const nextMonth = () => {
    currentMonth.value = currentMonth.value.add(1, 'month')
}

const prevMonth = () => {
    currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const hasSlot = (day: dayjs.Dayjs) => {
    return slotDates.value.includes(day.format('YYYY-MM-DD'))
}

// ------ Firebase --------//
const { getAllBookings, fetchSlot, getBookingByDate } = useBookings()
const bookings = ref()

onMounted( async () => {
    bookings.value = await getAllBookings()
    slotDates.value = await fetchSlot()
})

</script>