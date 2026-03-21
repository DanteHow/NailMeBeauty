<template>
    <Default>
        <Card class="w-[450px] lg:w-[600px]">
            <CardHeader>
                <CardTitle>Slot Booking</CardTitle>
                <CardDescription>Fill in the form to complete the booking</CardDescription>
            </CardHeader>
            <Separator/>
            <CardContent>
                <form @submit.prevent>
                    <div class="grid items-center w-full gap-4">
                        <!-- Name:Start -->
                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem>
                                <FormLabel>Name: </FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter your name" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <!-- Name:Stop -->
                        <!-- Contact:Start -->
                        <FormField v-slot="{ componentField }" name="contact">
                            <FormItem>
                                <FormLabel>Contact No: </FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter your phone number" v-bind="componentField"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <!-- Contact:Stop -->
                        <!-- Date:Start -->
                        <FormField name="dob">
                            <FormItem class="flex flex-col">
                                <FormLabel>Date:</FormLabel>
                                <Popover>
                                <PopoverTrigger as-child>
                                    <FormControl>
                                    <Button
                                        variant="outline" :class="cn(
                                        'w-[240px] ps-3 text-start font-normal',
                                        !value && 'text-muted-foreground',
                                        )"
                                    >
                                        <span>{{ value ? df.format(toDate(value)) : "Pick a date" }}</span>
                                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    <input hidden>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent class="w-auto p-0">
                                    <Calendar
                                    v-model:placeholder="placeholder"
                                    :model-value="value"
                                    calendar-label="Date of birth"
                                    initial-focus
                                    :min-value="today(getLocalTimeZone())"
                                    :max-value="new CalendarDate(2100, 1, 1)"
                                    @update:model-value="(v) => {
                                        if (v) {
                                        setFieldValue('dob', v.toString())
                                        }
                                        else {
                                        setFieldValue('dob', undefined)
                                        }
                                    }"
                                    />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <!-- Date:Stop -->
                        <!-- Part:Start-->
                        <FormField v-slot="{ componentField }"  name="BodyPart">
                            <FormItem>
                                <FormLabel>Part: </FormLabel>

                                <Select v-bind="componentField">
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Time"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <div v-for="part in bodypart">
                                                <SelectItem :value="part">
                                                    {{ part }}
                                                </SelectItem>
                                            </div>
                                        </SelectGroup>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <!-- Part:Stop -->
                        <!-- Checkbox:Start -->
                        <FormField v-for="item in items" v-slot="{ value, handleChange }" :key="item.id" type="checkbox" :value="item.id" :unchecked-value="false" name="items">
                            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        :model-value="value.includes(item.id)"
                                        @update:model-value="handleChange"
                                    />
                                </FormControl>
                                <FormLabel class="font-normal">
                                    {{ item.label }}
                                </FormLabel>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <!-- Checkbox:Stop -->
                        <!-- SubmitButton:Start -->
                        <div class="flex justify-center">
                            <Button type="button" @click="onSubmit">
                                Submit
                            </Button>
                        </div>
                        <!-- SubmitButton:Start -->
                    </div>
                </form>
            </CardContent>
        </Card>
    </Default>
    
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DateFormatter, getLocalTimeZone, CalendarDate, parseDate, today } from '@internationalized/date'
import { toDate } from 'reka-ui/date'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '~/components/ui/calendar'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cn } from '~/lib/utils'
import Default from '~/layout/default.vue'
import Separator from '~/components/ui/separator/Separator.vue'
import Checkbox from '~/components/ui/checkbox/Checkbox.vue'
import dayjs from 'dayjs'
import { Timestamp } from 'firebase/firestore'
import { toast } from 'vue-sonner'

const loading = ref(false)

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const bodypart = ref(['Leg', 'Hand'])
const items = [
    {
        id: 'remove',
        label: 'Nail Remove'
    },
    {
        id: 'extension',
        label: 'Nail Extension'
    }
] as const

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(50),
  contact: z.string().min(2).max(50),
  dob: z.string().refine(v => v, { message: 'A Booking Date is required.'}),
  BodyPart: z.string({
    required_error: 'Please select a part'
  }),
    items: z.array(z.string()).refine(value => value.some(item => item), {
        message: 'You have to select at least one item.',
    }),
}))

const placeholder = ref()
const { writePost } = usePosts()

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    items: []
  },
})

const value = computed({
    get: () => values.dob ? parseDate(values.dob) : undefined,
    set: val => val,
})

const onSubmit = handleSubmit(async (values) => {
    const BookingList: Omit<Post, 'id'> = {
       Name: values.name,
       Contact: values.contact,
       Date: Timestamp.fromDate(dayjs(values.dob).toDate()),
       BodyPart: values.BodyPart,
       Requirement: values.items,
       Time: '',
       Status: "Pending"
    }

    try {
        loading.value = true
        const response = await writePost(BookingList)
        toast.success('Booking submitted successfully!')
    } catch (error) {
        console.error('Failed: ', error)
        toast.error('Failed to submit booking. Please try again.')
    } finally {
        loading.value = false
    }
})

</script>