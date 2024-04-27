/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from 'react';
import { MoreHorizontal, ThumbsDown, ThumbsUp } from 'lucide-react';
import Jate from 'jates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/authContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

type CommentTypeCount = {
  type: string;
  count: number;
};

interface NumbersData {
  postCount: number;
  commentCount: number;
  commentTypeCounts: CommentTypeCount[];
}

type Comments = {
  authorId: string;
  content: string;
  createdAt: string;
  id: string;
  meta: { comment_type: string };
  postId: string;
  updatedAt: string;
};

export default function Page({ params }: { params: { pageId: string } }) {
  const [numbersData, setNumbersData] = useState<NumbersData | null>(null);
  const [isNumbersLoading, setIsNumbersLoading] = useState<boolean>(true);
  const [labels, setLabels] = useState<any[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('all');
  const [labelsLoading, setLabelsLoading] = useState(true);
  const [comments, setComments] = useState<Comments[]>([]);

  const { apiFetch } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<any>(`/page/settings?pageId=${params.pageId}`, {});
        const data = await response.json();
        if (response.ok) {
          setLabels(['all', ...(data.settings.prompt?.labels || [])]);
          setLabelsLoading(false);
        }
      } catch (error) {
        console.log('numbers failed');
      }
      setLabelsLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams({
          pageId: params.pageId,
        });
        if (selectedLabel !== 'all') {
          searchParams.set('label', selectedLabel);
        }
        const response = await apiFetch(`/comments?${searchParams.toString()}`, {});
        setComments((await response.json()) as any);
      } catch (error) {
        console.log('numbers failed');
      } finally {
        setIsNumbersLoading(false);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();

    return () => {
      clearInterval(interval);
    };
  }, [selectedLabel]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(`/posts/numbers?pageId=${params.pageId}`, {});
        setNumbersData((await response.json()) as unknown as NumbersData);
      } catch (error) {
        console.log('numbers failed');
      } finally {
        setIsNumbersLoading(false);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {isNumbersLoading ? 'Loading ...' : String(numbersData?.commentCount || 0)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isNumbersLoading ? 'Loading ...' : String(numbersData?.postCount || 0)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          {isNumbersLoading ? (
            'Loading ...'
          ) : (
            <div>
              {numbersData?.commentTypeCounts?.map(({ type, count }) => (
                <div key={type} className="flex items-center">
                  <p className="w-24">{type}</p>
                  {count}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-4 min-h-[500px]">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Live Feed</CardTitle>
          <Select
            defaultValue="all"
            value={selectedLabel}
            onValueChange={(newValue) => setSelectedLabel(newValue)}
          >
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="select a label" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {labels.map((label: any) => {
                  return (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  );
                })}
                {labelsLoading && (
                  <div className="w-full h-40 flex-center">
                    <Loading color="black" />
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!comments.filter((comment) => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - 10);
            return new Date(comment.createdAt) > now;
          }).length ? (
            <div className="flex-center text-slate-500">No recent comments</div>
          ) : (
            <>
              <div className="text-slate-500">Recent comments</div>
              {comments
                .filter((comment) => {
                  const now = new Date();
                  now.setMinutes(now.getMinutes() - 10);
                  return new Date(comment.createdAt) > now;
                })
                .map((comment) => {
                  return (
                    <div
                      className="rounded-md border py-2 px-3 flex items-center justify-between"
                      key={comment.id}
                    >
                      <div className="w-1/2 flex items-center">
                        <div className="w-28 text-sm text-slate-500 shrink-0">
                          {new Jate(comment.createdAt).format('dd/MM - hh:mm')}
                        </div>
                        <div>{comment.content}</div>
                      </div>

                      <Badge>{comment.meta.comment_type}</Badge>
                      <div className="space-x-2">
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:text-green-500">
                          <ThumbsUp size={18} />
                        </Button>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:text-red-500">
                          <ThumbsDown size={18} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <a href={`https://facebook.com/${comment.postId}`} target="_blank">
                                Go to post
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Hide</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
          <Separator className="my-5" />
          <div className="text-slate-500">History</div>
          {comments
            .filter((comment) => {
              const now = new Date();
              now.setMinutes(now.getMinutes() - 10);
              return new Date(comment.createdAt) <= now;
            })
            .map((comment) => {
              return (
                <div
                  className="rounded-md border py-2 px-3 flex items-center justify-between"
                  key={comment.id}
                >
                  <div className="w-1/2 flex items-center">
                    <div className="w-28 text-sm text-slate-500 shrink-0">
                      {new Jate(comment.createdAt).format('dd/MM - hh:mm')}
                    </div>
                    <div>{comment.content}</div>
                  </div>

                  <Badge>{comment.meta.comment_type}</Badge>
                  <div className="space-x-2">
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:text-green-500">
                      <ThumbsUp size={18} />
                    </Button>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:text-red-500">
                      <ThumbsDown size={18} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <a href={`https://facebook.com/${comment.postId}`} target="_blank">
                            Go to post
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Hide</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
