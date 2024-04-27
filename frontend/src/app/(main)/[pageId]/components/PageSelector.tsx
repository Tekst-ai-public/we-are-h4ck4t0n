'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import Ping from '@/components/ui/ping';

export default function PagesSelector() {
  const [pages, setPages] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { apiFetch } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  async function fetchPages() {
    setLoading(true);
    try {
      const res = await apiFetch('/pages');
      const data = await res.json();
      if (res.ok) {
        setPages(data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch pages');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pages.some((page: any) => page.id === params.pageId)) {
      setCurrentPage(params.pageId);
    }
  }, [params.pageId, pages]);

  useEffect(() => {
    if (currentPage && pathname.split('/').length === 2) {
      router.push(`/${currentPage}/dashboard`);
    }
  }, [currentPage, router, pathname]);

  return (
    <div className="w-full h-full">
      <Select value={currentPage} onValueChange={(newValue) => setCurrentPage(newValue)}>
        <SelectTrigger className="w-[350px] relative">
          <SelectValue placeholder="select a page" />
          {!currentPage && <Ping />}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {loading ? (
              <div className="w-full h-40 flex-center">
                <Loading color="black" />
              </div>
            ) : pages.length ? (
              pages.map((page: any) => {
                return (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                );
              })
            ) : (
              <div className="w-full h-40 flex-center flex-col gap-2">
                No pages found
                <Button onClick={fetchPages}>Refresh</Button>
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
