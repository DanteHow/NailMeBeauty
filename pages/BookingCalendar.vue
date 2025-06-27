<template>
    <div class="p-4">  
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
        <div class="bg-background grid grid-cols-7 gap-px bg-border border rounded overflow-hidden text-sm">
            <Card
                v-for="day in daysInCalendar"
                :key="day.format('YYYY-MM-DD')"
                class="p-2 min-h-[80px] relative cursor-pointer hover:bg-muted"
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
                        <div v-if="hasSlot(day)"> <!-- If Slot isNotEmpty: True else empty div -->
                            HaveSlot 
                        </div>
                        <!-- SlotHint::Start -->
                    </div>
                </CardContent>
            </Card>
        </div>
        <!-- {{ daysInCalendar.forEach(days => {console.log(days.format('YYYY-MM-DD'))}) }} -->
        
        <!-- MonthGrid::End -->
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isToday)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const today = dayjs()
const currentMonth = ref(dayjs())

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

const selectDate = (day: dayjs.Dayjs) => {
    alert(`You clicked: ${day.format('YYYY-MM-DD')}`)
}

const nextMonth = () => {
    currentMonth.value = currentMonth.value.add(1, 'month')
}

const prevMonth = () => {
    currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const slotDates: any = []
const hasSlot = (day: dayjs.Dayjs) => {
    return slotDates.includes(day)
}

// ------ Firebase --------//
const { getAllBookings, fetchSlot } = useBookings()
const bookings = ref()

onMounted( async () => {
    bookings.value = await getAllBookings()
    slotDates.push( await fetchSlot())
})


</script>