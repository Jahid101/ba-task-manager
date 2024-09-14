import {
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";

import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { format } from "date-fns";


const TaskTable = ({
    columns,
    data,
    loading,
    setOpenAlert,
    setSelectedData,
}) => {
    const router = useRouter();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}
                                        className={
                                            header?.column.columnDef?.align ?
                                                header?.column.columnDef?.align == 'left' ? 'text-left' :
                                                    header?.column.columnDef?.align == 'right' ? 'text-right' :
                                                        header?.column.columnDef?.align == 'center' ? 'text-center' :
                                                            ''
                                                : ''
                                        }
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {!loading &&
                        <>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {
                                            row.getVisibleCells().map((cell) => {
                                                if (cell?.column.columnDef.header == 'Created date') {
                                                    return (
                                                        <TableCell TableCell key={cell.id} align={cell?.column.columnDef.align}
                                                            className="cursor-pointer"
                                                            onClick={() => { router.push(`/tasks/details/${row?.original?.id}`) }}
                                                        >
                                                            {row?.original?.createdAt ? new Date(row?.original?.createdAt).toLocaleDateString("en-IN") : 'N/A'}
                                                        </TableCell>
                                                    )
                                                }
                                                else if (cell?.column.columnDef.header == 'Due date') {
                                                    return (
                                                        <TableCell TableCell key={cell.id} align={cell?.column.columnDef.align}
                                                            className="cursor-pointer"
                                                            onClick={() => { router.push(`/tasks/details/${row?.original?.id}`) }}
                                                        >
                                                            {row?.original?.dueDate ? format(new Date(row?.original?.dueDate), "dd/MM/yyyy") : 'N/A'}
                                                        </TableCell>
                                                    )
                                                }
                                                else if (cell?.column.columnDef.header == 'Action') {
                                                    return (
                                                        <TableCell TableCell key={cell.id} align={cell?.column.columnDef.align} className='cursor-default'>
                                                            <TooltipProvider delayDuration={100}>
                                                                <div className="flex justify-center items-center gap-3">
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <MdOutlineRemoveRedEye
                                                                                className="text-purple-900 h-5 w-5"
                                                                                onClick={() => { router.push(`/tasks/details/${row?.original?.id}`) }}
                                                                            />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>View</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>

                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <FiEdit
                                                                                className="text-primary h-5 w-5"
                                                                                onClick={() => { router.push(`/tasks/edit/${row?.original?.id}`) }}
                                                                            />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Edit</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>

                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <RiDeleteBinLine
                                                                                className="text-red-600 h-5 w-5"
                                                                                onClick={() => {
                                                                                    setSelectedData(row?.original)
                                                                                    setOpenAlert(true)
                                                                                }}
                                                                            />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Delete</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </TooltipProvider>
                                                        </TableCell>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <TableCell TableCell key={cell.id} align={cell?.column.columnDef.align}
                                                            className="cursor-pointer"
                                                            onClick={() => { router.push(`/tasks/details/${row?.original?.id}`) }}
                                                        >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    )
                                                }

                                            })
                                        }
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    }
                    {loading &&
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                <Spinner size="lg" />
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </div >
    )
}

export default TaskTable;
