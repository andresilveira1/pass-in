import { ChangeEvent, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

import { IconButton } from './IconButton'
import { Table } from './Table/Table'
import { TableHeader } from './Table/TableHeader'
import { TableCell } from './Table/TableCell'
import { TableRow } from './Table/TableRow'
import { attendees } from '../data/Attendees'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export function AttendeeList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(attendees.length / 10)

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  function goToNextPage() {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  function goToLastPage() {
    setPage(totalPages)
  }

  function goToPreviousPage() {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1)
    }
  }

  function goToFirstPage() {
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <h1 className="font-bold text-2xl">Participantes</h1>

        <form>
          <div className="flex items-center gap-3 w-72 px-3 py-1.5 border border-white/10 rounded-lg">
            <label htmlFor="search">
              <span className="sr-only">Buscar participante...</span>
              <Search size={16} className="text-emerald-300" />
            </label>
            <input
              type="search"
              id="search"
              onChange={onSearchInputChanged}
              placeholder="Buscar participantes..."
              className="flex-1 bg-transparent outline-none border-0 p-0 text-sm"
            />
          </div>
        </form>

        {search}
      </header>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border border-white/10"
              />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>

        <tbody>
          {attendees.slice((page - 1) * 10, page * 10).map((attendee) => {
            return (
              <TableRow
                key={attendee.id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>

                <TableCell>{attendee.id}</TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>

                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>

                <TableCell>{dayjs().to(attendee.checkedInAt)}</TableCell>

                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>

        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando 10 de {attendees.length} itens
            </TableCell>
            <TableCell colSpan={3}>
              <div className="flex items-center justify-end gap-8">
                Página {page} de {totalPages}
                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft size={16} />
                  </IconButton>

                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft size={16} />
                  </IconButton>

                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    <ChevronRight size={16} />
                  </IconButton>

                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight size={16} />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
