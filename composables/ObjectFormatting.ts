export const mapFirestoreToScheduleX = (doc: any) => {
    try {
        const jsDate = doc.Date.toDate()
        const dateStr = jsDate.toISOString().split('T')[0] // Extract 'YYYY-MM-DD' from ISO string
        const [startTime, endTime] = doc.Time.split(' - ')

        const to24h = (timeStr: string) => {
            const cleanTime = timeStr.trim().toUpperCase()
            const modifier = cleanTime.slice(-2)
            const [hours, minutes] = cleanTime.slice(0, -2).split(':')
            let h = parseInt(hours || '00', 10)
            if (modifier === 'PM' && h !== 12) {
                h += 12
            }
            return `${h.toString().padStart(2, '0')}:${minutes?.padStart(2, '0')}`
        }

        const scheduleXEvent = {
            id: doc.id,
            title: doc.Name,
            start: Temporal.ZonedDateTime.from(`${dateStr}T${to24h(startTime)}:00+08:00[Asia/Singapore]`),
            end: Temporal.ZonedDateTime.from(`${dateStr}T${to24h(endTime)}:00+08:00[Asia/Singapore]`),
        }

        console.log('Mapped Firestore document to ScheduleX format:', scheduleXEvent)
        return scheduleXEvent
    }
    catch (error) {
        console.error('Error mapping Firestore document to ScheduleX format:', error)
        return null
    }

}