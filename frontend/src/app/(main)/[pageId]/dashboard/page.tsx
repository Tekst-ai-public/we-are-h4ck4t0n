"use client"
import React, { useEffect, useState } from 'react';
import { BarChart4 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from "@/context/authContext";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type CommentTypeCount = {
  type: string;
  count: number;
};

interface NumbersData {
  postCount: number;
  commentCount: number;
  commentTypeCounts: CommentTypeCount[];
}


export default function Page({ params }: { params: { pageId: string } }) {
  const [numbersData, setNumbersData] = useState<NumbersData | null>(null);
  const [isNumbersLoading, setIsNumbersLoading] = useState<boolean>(true);

  const [labels, setLabels] = useState<any[]>([])
  const [selectedLabel, setSelectedLabel] = useState("")
  const [labelsLoading, setLabelsLoading] = useState(true)
  const [selectedSync, setSelectedSync] = useState<boolean>(false)
  const [syncLoading, setSyncLoading] = useState(true)

  const [comments, setComments] = useState<{ authorId: string, content: string, createdAt: string, id: string, meta: { comment_type: string }, postId: string, updatedAt: string }[]>([])

  const { apiFetch } = useAuth()

  async function patchSettings(sync: boolean) {
    try {
      const res = await apiFetch(`/page/settings/sync?pageId=${params.pageId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          sync: sync
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`Error saving settings: ${data}`);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<any>(`/page/settings?pageId=${params.pageId}`, {});
        const data = await response.json()
        if (response.ok) {
          setLabels(["all", ...(data.prompt?.labels || [])])
          setLabelsLoading(false)
        }
      } catch (error) {
        console.log("numbers failed")
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await apiFetch<any>(`/page/settings/sync?pageId=${params.pageId}`, {});
          const data = await response.json()
          if (response.ok) {
            setSelectedSync(data.sync)
            setSyncLoading(false)
          }
          
        } catch (error) {
          console.log("numbers failed")
        }
      };


    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams({
          pageId: params.pageId
        })
        if (selectedLabel !== "all") {
          searchParams.set("label", selectedLabel)
        }
        const response = await apiFetch(`/comments?${searchParams.toString()}`, {});
        setComments(await response.json() as any);
      } catch (error) {
        console.log("numbers failed")
      } finally {
        setIsNumbersLoading(false);
      }
    };

    const interval = setInterval(() => {
      fetchData()
    }, 5000)

    fetchData();

    return () => {
      clearInterval(interval)
    }
  }, [selectedLabel]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(`/posts/numbers?pageId=${params.pageId}`, {});
        setNumbersData(await response.json() as unknown as NumbersData);
      } catch (error) {
        console.log("numbers failed")
      } finally {
        setIsNumbersLoading(false);
      }
    };

    const interval = setInterval(() => {
      fetchData()
    }, 5000)

    fetchData();

    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>{isNumbersLoading ? "Loading ..." : String(numbersData?.commentCount || 0)}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>{isNumbersLoading ? "Loading ..." : String(numbersData?.postCount || 0)}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sentiment</CardTitle>
        </CardHeader>
        <CardContent>{isNumbersLoading ? "Loading ..." : JSON.stringify(numbersData?.commentTypeCounts || 0)}</CardContent>
      </Card>
      <Card className="col-span-4 h-[500px]">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Live Feed</CardTitle>
          <Select value={selectedSync} onValueChange={newValue => setSelectedSync(newValue)}>
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="select a label" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {["true", "false"].map((label: any) => {
                  return <SelectItem key={label} value={label}>{label}</SelectItem>
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button disabled={syncLoading} variant="secondary" className="w-28" onClick={() => setSyncLoading(true)}>
          <Select value={selectedLabel} onValueChange={newValue => setSelectedLabel(newValue)}>
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="select a label" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {labels.map((label: any) => {
                  return <SelectItem key={label} value={label}>{label}</SelectItem>
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {comments.map(comment => {
            return <div className="rounded-md border py-2 px-3" key={comment.id}>
              <div>{comment.content}</div>
            </div>
          })}
        </CardContent>
      </Card>
    </div>
  );
}
