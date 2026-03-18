<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import 'temporal-polyfill/global'
import { shallowRef } from 'vue'
 
// ------ Router Navigation --------//
const goToRouter = async (page: string) => {
    await navigateTo(`${page}`, { external: true })
}

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = shallowRef()

onMounted(() => {
  calendarApp.value = createCalendar({
    selectedDate: Temporal.PlainDate.from('2025-12-19'),
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [
      {
        id: 1,
        title: 'Event 1',
        start: Temporal.PlainDate.from('2025-12-19'),
        end: Temporal.PlainDate.from('2025-12-19'),
      },
      {
        id: 1,
        title: 'Event 1',
        start: Temporal.PlainDate.from('2025-12-19'),
        end: Temporal.PlainDate.from('2025-12-19'),
      },
      {
        id: 1,
        title: 'Event 1',
        start: Temporal.PlainDate.from('2025-12-19'),
        end: Temporal.PlainDate.from('2025-12-19'),
      },
      {
        id: 1,
        title: 'Event 1',
        start: Temporal.PlainDate.from('2025-12-19'),
        end: Temporal.PlainDate.from('2025-12-19'),
      },
    ],
    locale: 'en-SG',
    timezone: 'Asia/Singapore',
    firstDayOfWeek: 1,
    defaultView: viewMonthGrid.name,
    dayBoundaries: {
      start: '08:00',
      end: '18:00',
    },
    minDate: Temporal.PlainDate.from('2024-01-01'),
    maxDate: Temporal.PlainDate.from('2030-12-31'),
    weekOptions: {
      gridHeight: 2500,
      nDays: 7,
      eventWidth: 95,
      timeAxisFormatOptions: {
        hour: '2-digit',
        minute: '2-digit',
      },
      eventOverlap: true,
      gridStep: 30,
    },
  })
})


</script>
 
<template>
  <div>
    <ClientOnly>
      <ScheduleXCalendar 
        :calendar-app="calendarApp"
      />
      <div class="m-2 p-2"><Button @click="goToRouter('/Admin')">Back To Admin Dashboard</Button></div>
    </ClientOnly>
  </div>
</template>

<style>
.sx-vue-calendar-wrapper {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
}
</style>