import { useTable } from '@refinedev/react-table';
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Class, ClassDetails } from "@/types";
import { useSelect, } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from '@/components/refine-ui/data-table/data-table';


export default function  ClassesList () {
    const [searchValue,setSearchValue]=useState('');
    const [selectedSubject,setSelectedSubject]=useState('All');
    const [selectedTeacher,setSelectedTeacher]=useState('All');

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

    // const searchFilters={}
    // const subjectsFilters={}
    // const teachersFilters={}

    const classTable=useTable<Class>(
        {
            
            columns:useMemo<ColumnDef<Class>[]>
            (
                ()=>[
                    // this is for the code column
                    {
                        id:"code",
                        accessorKey:'code',
                        size:100,
                        header:()=><p className="column-title ml-2">Code</p>,
                        cell:({getValue})=><Badge>{getValue<string>()}</Badge>,
                        
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
                        accessorKey:"subject",
                        size:200,
                        header:()=><p className="column-title ml-2">Subjects</p>,
                        cell:({getValue})=><Badge variant='secondary'>{getValue<string>()}</Badge>
                    },
                    {
                        id:"teacher",
                        accessorKey:"teacher",
                        size:200,
                        header:()=><p className="column-title ml-2">Teachers</p>,
                        cell:({getValue})=><Badge variant='secondary'>{getValue<string>()}</Badge>
                    },{
                        id:"capacity",
                        accessorKey:"capacity",
                        size:200,
                        header:()=><p className="column-title ml-2">Capacity</p>,
                        cell:({getValue})=><Badge>{getValue<string>()}</Badge>
                    }
                ],[]
            ),
        }
    )


  return (
    <ListView>
        <Breadcrumb/>
        <h1 className="page-title">Classes</h1>
        <div className="intro-row">
            <p>Quick access to essential metrics and managment tools</p>
            <div className="actions-row">
                <div className="search feild">
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
                     <SelectTrigger>
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

                </div>

            </div>
        </div>
        <DataTable table={classTable}></DataTable>
    </ListView>
  )
}
