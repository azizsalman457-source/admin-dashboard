import { ListView } from '@/components/refine-ui/views/list-view'
import { Breadcrumb} from '@/components/refine-ui/layout/breadcrumb'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useMemo, useState } from 'react';
import { 
         Select, 
         SelectContent,
         SelectItem, 
         SelectTrigger, 
         SelectValue
         } from '@/components/ui/select';
import { DEPARTMENT_OPTIONS } from '@/Constants';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { useTable } from '@refinedev/react-table';
import { Subject } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export default function SubjectsLists() {
   const[searchValue, setSearchValue] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departmentFilters = selectedDepartment == 'all' ? [] : [
    {
      field: 'department',
      operator: 'eq' as const,
      value: selectedDepartment,
    }
  ];
  const searchFilters = searchValue ? [
    {
      field: 'name',
      operator: 'contains' as const,
      value: searchValue,
    }
  ] : [];


  const subjectTable = useTable<Subject>({
    columns:useMemo<ColumnDef<Subject>[]>
    (
      () => [
        {
          id:'code',
          accessorKey:'code',
          size: 100,
          header: ()=><p className='column-title ml-2'>Code</p>,
          cell:({getValue})=><Badge>{getValue<string>()}</Badge>,
        },
        {
          id:'name',
          accessorKey:'name',
          size:200,
          header:()=><p className='column-title ml-2'>Name</p>,
          cell:({getValue})=><span>{getValue<string>()}</span>,
          filterFn:'includesString'
        },
        {
          id:"department",
          accessorKey:"department.name",
          size:200,
          header:()=><p className='column-title'>Department</p>,
          cell:({getValue})=><Badge variant='secondary'>{getValue<string>()}</Badge>,
        },
        {
          id:"Description",
          accessorKey:"description",
          size:300,
          header:()=><p className='column-title'>Description</p>,
          cell:({getValue})=><span>{getValue<string>()}</span>,
        }
      ],
      []
    ),
    refineCoreProps:{
       resource: "subjects",
       pagination:{pageSize:10,mode:"server"},
       filters:{
        permanent:[...departmentFilters,...searchFilters],
       },
       sorters:{

       },
    },
   
  });
  const subjectColumns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "department",
        accessorKey: "department.name",
        size: 150,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="truncate line-clamp-2">{getValue<string>()}</span>
        ),
      },
      
    ],
    []
  );
  
  return (
    <ListView>
        <Breadcrumb/>
        <h1 className='page-title'>Subjects</h1>
        <div className="intro-row">
          <p>Quick access to essential metrics and management tools.</p>

          <div className="actions-row">
            <div className="search-field">
              <Search className='search-icon'/>
              <Input 
                type="text"
                placeholder="search by name...."
                className="pl-10 w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className='flex gap-2 w-full sm:w-auto'>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </  SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENT_OPTIONS.map((department) => (
                    <SelectItem key={department.value} value={department.value}>
                      {department.label}
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>
                <CreateButton />
            </div>

          </div>
        </div>
        <DataTable table={subjectTable}></DataTable>
    </ListView>
  )
}
