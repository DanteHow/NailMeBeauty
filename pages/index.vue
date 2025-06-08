<template>
    <Default>
        <Card class="w-[450px] lg:w-[600px]">
            <CardHeader>
                <CardTitle>Slot Booking</CardTitle>
                <CardDescription>Fill in the form to complete the booking</CardDescription>
            </CardHeader>
            <Separator/>
            <CardContent>
                <form @submit="onSubmit">
                    <div class="grid items-center w-full gap-4">
                        <!-- Name:Start -->
                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem>
                                <FormLabel>Name: </FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter your name" v-bind="componentField" />
                                </FormControl>
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
                            </FormItem>
                        </FormField>
                        <!-- Contact:Stop -->
                        <!-- Date:Start -->
                        <div class="flex flex-col space-y-1.5">
                            <Label for="Date">Date: </Label>
                            <Popover>
                                <PopoverTrigger as-child>
                                    <Button
                                        variant="outline"
                                        :class="cn(
                                            'justify-start text-left font-normal',
                                            !value && 'text-muted-foreground',
                                        )"
                                    >
                                        <CalendarIcon class="mr-2 h-4 w-4" />
                                                {{ value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent class="w-auto p-0">
                                    <Calendar v-model="value" initial-focus/>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <!-- Date:Stop -->
                        <!-- Time:Start -->
                        <div class="flex flex-col space-y-1.5">
                            <Label for="Time">Time: </Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a time"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Time 24+</SelectLabel>
                                        <div v-for="time in times">
                                            <SelectItem :value="time">
                                                {{ time }}
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <!-- Time:Stop -->

                        <div class="flex flex-col space-y-1.5">
                            <Label>Part:</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose"/>
                                </SelectTrigger>
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
                        </div>
                        <div class="flex flex-row space-x-1.5">
                            <Checkbox id="NailProtection"/>
                            <Label
                                for="NailProtection"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disable:opacity-70"
                            >
                                Nail Remover
                            </Label>
                        </div>
                        <div class="flex flex-row space-x-1.5">
                            <Checkbox :model-value="NailProtection" id="NailProlong"/>
                            <Label
                                for="NailProlong"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disable:opacity-70"
                            >
                                Nail Prolong
                            </Label>
                        </div>
                        <div class="flex justify-center">
                            <Button type="submit">
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    </Default>
    
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { useForm, useIsFieldDirty } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField, FormItem, FormLabel, FormControl } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { CalendarIcon, PartyPopper } from 'lucide-vue-next'
import { Calendar } from '~/components/ui/calendar'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cn } from '~/lib/utils'
import Default from '~/layout/default.vue'
import Separator from '~/components/ui/separator/Separator.vue'
import Checkbox from '~/components/ui/checkbox/Checkbox.vue'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = ref<DateValue>()
const times = ref([
    '0600', '0700', '0800', '0900', '1000', '1100', '1200',
    '1300', '1400', '1500', '1600', '1700', '1800', '1900',
    '2000', '2100', '2200', '2300'
])
const bodypart = ref(['Leg', 'Hand'])
const NailProtection = ref()

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(50),
  contact: z.string().min(2).max(50),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log(values.name + ' ' + values.contact)
})

</script>