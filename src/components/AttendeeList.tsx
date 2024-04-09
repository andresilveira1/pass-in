import { ChangeEvent, useEffect, useState } from 'react'
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

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendees {
  id: string
  name: string
  email: string
  createdAt: string
  checkedInAt: string | null
}

export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })
  const [attendees, setAttendees] = useState<Attendees[]>([])
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / 10)

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url)

    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())

    url.searchParams.set('search', search)
    window.history.pushState({}, '', url)

    setSearch(search)
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }

  function goToPreviousPage() {
    if (page > 1) {
      setCurrentPage(page - 1)
    }
  }

  function goToFirstPage() {
    setCurrentPage(1)
  }

  useEffect(() => {
    fetch('http://localhost:3333/events/54fa8724-1e3f-4f15-9b85-5e1eb9c3c9cf')
      .then((response) => response.json())
      .then((data) => {
        return Array(data).map((data) => setTotal(data.event.maximumAttendees))
      })
  }, [])

  useEffect(() => {
    const url = new URL(
      'http://localhost:3333/events/54fa8724-1e3f-4f15-9b85-5e1eb9c3c9cf/attendees',
    )

    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => setAttendees(data.attendees))
  }, [page, search])

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
              value={search}
              onChange={onSearchInputChanged}
              placeholder="Buscar participantes..."
              className="flex-1 bg-transparent outline-none border-0 p-0 text-sm focus:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
            />
          </div>
        </form>
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
          {attendees.map((attendee) => {
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

                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <span className="text-zinc-400">Não fez check-in</span>
                  ) : (
                    dayjs().to(attendee.checkedInAt)
                  )}
                </TableCell>

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
              Mostrando {attendees.length} de {total} itens
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
