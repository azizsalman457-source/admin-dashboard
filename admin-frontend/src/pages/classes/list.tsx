import { useTable } from '@refinedev/react-table';
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Class, ClassDetails } from "@/types";
import { useSelect, } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import {  Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { CreateButton } from '@/components/refine-ui/buttons/create';


export default function  ClassesList () {
    const [searchValue,setSearchValue]=useState('');
    const [selectedSubject,setSelectedSubject]=useState('all');
    const [selectedTeacher,setSelectedTeacher]=useState('all');

    const{options:subjectOptions}=useSelect({
        resource:"subjects",
        optionLabel:"name",
        optionValue:"id",
    })
     const{options:teacherOptions}=useSelect({
        resource:"teachers",
        optionLabel:"name",
        optionValue:"id",
    })

    const searchFilters=searchValue?[
        {
            field:'name',
            operator:'contains'as const,
            value:searchValue,

        }
    ]:[];
    const subjectFilters=selectedSubject== 'all' ?[]:[{
        field:'subject',
        operator:'eq' as const,
        value:selectedSubject,

    }];
     const teacherFilters=selectedTeacher=='all'?[]:[{
        field:'teacher',
        operator:'eq' as const,
        value:selectedTeacher,

     }]

    const classTable=useTable<Class>(
        {
            
            columns:useMemo<ColumnDef<Class>[]>
            (
                ()=>[
                    {
  id: "section",
  accessorKey: 'section',
  size: 100,
  header: () => <p className="column-title ml-2">Section</p>,
  cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
},
               
                //  tjis is for the name column
                    {
                        id:"name",
                        accessorKey:"name",
                        size:200,
                        header:()=><p className="column-title ml-2">Name</p>,
                        cell:({getValue})=><span>{getValue<string>()}</span>
                    },
                    {
                        id:"subject",
                        accessorKey:"subject.name",
                        size:200,
                        header:()=><p className="column-title ml-2">Subjects</p>,
                        cell: ({ getValue }) => <span>{JSON.stringify(getValue())}</span>
                    },
                    {
                        id:"teacher",
                        accessorKey:"teacher.name",
                        size:200,
                        header:()=><p className="column-title ml-2">Teachers</p>,
                        cell:({getValue})=><Badge variant='secondary'>{getValue<string>()}</Badge>,
                    },{
                        id:"capacity",
                        accessorKey:"capacity",
                        size:200,
                        header:()=><p className="column-title ml-2">Capacity</p>,
                        cell:({getValue})=><Badge variant='secondary'>{getValue<string>()}</Badge>,
                    }
                ],[]
            ),
            refineCoreProps:{
                resource:"classes",
                pagination:{pageSize:10,mode:"server"},
                filters:{
                    permanent:[...searchFilters,...subjectFilters,...teacherFilters],
                }
            }
        }
    )


  return (
    <ListView>
        <Breadcrumb/>
        <h1 className="page-title">Classes</h1>
        <div className="intro-row">
            <p>Quick access to essential metrics and managment tools</p>
            <div className="actions-row flex items-center gap-3">
                <div className="search-field">
                    <Search className="search-icon"/>
                    <input 
                      type="text"
                      placeholder="search by name..."
                      className="pl-10 w-full"
                      value={searchValue} 
                      onChange={(e)=>setSearchValue(e.target.value)}
                      />
                </div>
              {/* //dropdown div */}
                <div className="flex gap-2 w-full sm:w-auto">
                    {/* //dropdown for the subjects filter */}
                    <Select
                     value={selectedSubject}
                     onValueChange={setSelectedSubject}
                     >
                     <SelectTrigger >
                     <SelectValue placeholder="Select Subjects"/>
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem
                         value="all">
                            All Subjects
                         </SelectItem>
                         {subjectOptions?.map((option)=>(
                            <SelectItem key={option.value} value={String(option.value)}>
                                {option.label}
                            </SelectItem>
                         ))}

                     </SelectContent>
               {/* //dropdown for the teacher filter */}
                    </Select>
                    <Select
                     value={selectedTeacher}
                     onValueChange={setSelectedTeacher}
                     >
                     <SelectTrigger>
                     <SelectValue placeholder="Select Teachers"/>
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem
                         value="all">
                            All Teachers
                         </SelectItem>
                         {teacherOptions?.map((option)=>(
                            <SelectItem key={option.value} value={String(option.value)}>
                                {option.label}
                            </SelectItem>
                         ))}

                     </SelectContent>

                    </Select>
                    <CreateButton/>
                </div>
            </div>
        </div>
        <DataTable table={classTable}></DataTable>
    </ListView>
  )
}
