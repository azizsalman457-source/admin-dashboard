import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateView } from '@/components/refine-ui/views/create-view'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "@refinedev/react-hook-form";
import { Button } from "@/components/ui/button"
import { useSelect, useBack } from "@refinedev/core";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroupTextarea,
// } from "@/components/ui/input-group"

import { classSchema } from '@/lib/schema'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UploadWidget from '@/components/upload-widget'
const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})


export default function ClassCreate() {
  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps:{
      resource:'classes',
      action:'create'
    },

    defaultValues:{
      status:'active',
    }
    },
  )
  const { options: subjectOptions } = useSelect({
  resource: "subjects",
  optionLabel: "name",
  optionValue: "id",
});
const {options:teacherOptions}=useSelect({
  resource:"teachers",
  optionLabel:'name',
  optionValue:"id",
})
const back = useBack();
  const {refineCore: { onFinish },handleSubmit,control,formState:{isSubmitting,errors}}=form;
  console.log("Current form errors:", errors);
  const  onSubmit=(values:z.infer<typeof classSchema>)=> {
    try {
      console.log(values);
    } catch (e) {
      console.log('eror creating new class',e);
    }
   
  }
  const handleFormSubmit = (values: any) => {
  console.log("Submitting with values:", values);
  return onFinish(values);
};
  return (
    <CreateView className='class-view'>
      <Breadcrumb/>
      <h1 className='page-title'>Create a Class</h1>
      <div className='intro-row'>
        <p>Provide the required information below to add a class.</p>
        <Button onClick={back}>Go Back</Button>
      </div>
      <Separator />

      <div className='my-4 flex items-center'>
        <Card className='class-form-card'>
          <CardHeader className='relative z-10'>
            <CardTitle className='text-2xl pb-0 font-bold'>Fill out the Form</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(handleFormSubmit)} 
                    className="space-y-6">
                      <div className='space-y-3'>
                        <Label>
                          Banner Image
                          <span className='text-orange-600'>*</span>

                        </Label>
                        <UploadWidget></UploadWidget>
                      </div>
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Class Name
                        <span className='text-orange-600'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="DATA STRUCTURES AND ALGORITHMS - Section A" 
                          autoComplete="on" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className='grid sm:grid-cols-2 gap-4'>
                  <FormField
                  control={control}
                  name="subjectId"  // match your actual schema field name
                    render={({ field }) => (
                   <FormItem>
                    <FormLabel>
                      Subjects
                      <span className='text-orange-600'>*</span>
                    </FormLabel>
                    <Select onValueChange={(value)=>field.onChange(Number(value))} value={field?.value?.toString()}>
                     <FormControl>
                       <SelectTrigger className='w-full'>
                         <SelectValue placeholder="Select Subjects" />
                       </SelectTrigger>
                      </FormControl>
                      <SelectContent>
    {subjectOptions?.map((option) => (
      <SelectItem key={option.value} value={String(option.value)}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
                   </Select>
                  </FormItem>
                  )} />


                <FormField
                  control={control}
                  name="Teacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Class Teacher
                        <span className='text-orange-600'>*</span>
                      </FormLabel>
                      <Select onValueChange={(value)=>field.onChange(Number(value))} value={field?.value?.toString()}>
                        <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select Teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teacherOptions?.map((option)=>(
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))
                        }
                      </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Capacity
                        <span className='text-orange-600'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Capacity..." 
                          autoComplete="on" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Status
                        <span className='text-orange-600'>*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder="active/un-active"></SelectValue>
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                       <SelectItem value='active'>Active</SelectItem>
                       <SelectItem value='inactive'>Inactive</SelectItem>
                      </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                </div>
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Description
                        <span className='text-orange-600'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Description" 
                          autoComplete="on" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                

                <div className="flex justify-end">
                  <Button type="submit">Create Class</Button>
                </div>
              </form>
            </Form>
          </CardContent>

        </Card>
      </div>

    </CreateView>
    )
    }
