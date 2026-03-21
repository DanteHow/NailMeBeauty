<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCalendar, createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek, viewDay, viewMonthGrid } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'
import 'temporal-polyfill/global'
import { shallowRef, onMounted } from 'vue'
import { getDocs, collection } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { mapFirestoreToScheduleX } from '../composables/ObjectFormatting'
 
// ------ Router Navigation --------//
const goToRouter = async (page: string) => {
    await navigateTo(`${page}`, { external: true })
}

const calendarApp = shallowRef()
const eventsService = createEventsServicePlugin()

onMounted( async () => { 
  try {
    calendarApp.value = createCalendar({
      selectedDate: Temporal.Now.plainDateISO(),
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      plugins: [eventsService],
      events: [
        {
          id: '1',
          title: 'Sample Event 1',
          start: Temporal.ZonedDateTime.from('2026-03-20T10:00:00+08:00[Asia/Singapore]'),
          end: Temporal.ZonedDateTime.from('2026-03-20T11:00:00+08:00[Asia/Singapore]'),
        }
      ],
      locale: 'en-SG',
      timezone: 'Asia/Singapore',
      firstDayOfWeek: 1,
      defaultView: viewMonthGrid.name,
      dayBoundaries: {
        start: '08:00',
        end: '18:00',
      },
      minDate: Temporal.PlainDate.from('2025-01-01'),
      maxDate: Temporal.PlainDate.from('2040-12-31'),
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
      callbacks: {
        onEventClick: (event, e) => {
          console.log('Clicked event:', event)
        },
        onClickAgendaDate: (date: Temporal.PlainDate, e?: UIEvent) => {
          console.log('Clicked agenda date:', date.toString())
        },
      }
    })

    const { $firebase } = useNuxtApp()
    const querySnapshot = await getDocs(collection($firebase.firestoreDB, 'Bookings'))
    const firestoreEvents = querySnapshot.docs.map(doc => {
      console.log('Firestore document data:', doc.data())
      return mapFirestoreToScheduleX({ id: doc.id, ...doc.data() })
    })
    console.log(calendarApp.value.events)
    console.log('Mapped Firestore events:', firestoreEvents)
    calendarApp.value.events = firestoreEvents
  } catch (error) {
    console.error('Error initializing calendar:', error)
  }
})

</script>

<template>
  <div>
    <ClientOnly>
      <div class="m-2 p-2"><Button @click="goToRouter('/Admin')">Back To Admin Dashboard</Button></div>
      <ScheduleXCalendar 
        :calendar-app="calendarApp"
      />
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