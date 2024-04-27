"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/context/authContext'
import React, { useEffect, useState } from 'react'

export default function Page({ params }: { params: { pageId: string } }) {

  const [pages, setPages] = useState<any>([])
  const [currentPage, setCurrentPage] = useState<any>()
  const { apiFetch } = useAuth()

  useEffect(() => {
    apiFetch("/pages", {}).then(async res => {
      const data = await res.json()
      if (res.ok) {
        setPages(data.data)
      }
    })
  }, [])

  useEffect(() => {
    if (pages.some(page => page.id === params.pageId)) {
      setCurrentPage(params.pageId)
    }
  }, [params.pageId, pages])

  if (!currentPage) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Select value={currentPage} onValueChange={newValue => setCurrentPage(newValue)}>
          <SelectTrigger className="w-[350px]">
            <SelectValue placeholder="select a page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {pages.map((page: any) => {
                return <SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="pre-wrap">{JSON.stringify(pages, null, 2)}</div>
  )
}
