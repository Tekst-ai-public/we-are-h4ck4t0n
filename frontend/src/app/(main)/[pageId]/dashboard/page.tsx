"use client"
import React, { useEffect, useState } from 'react';
import { BarChart4 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from "@/context/authContext";

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
  const { apiFetch } = useAuth()

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
      <Card className="col-span-2 h-96">
        <CardHeader>
          <CardTitle>Feed</CardTitle>
        </CardHeader>
        <CardContent>Posts</CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>A beautiful graph</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart4 />
        </CardContent>
      </Card>
      <Card className="col-span-4 h-[500px]">
        <CardHeader>
          <CardTitle>Live comments</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart4 />
        </CardContent>
      </Card>
    </div>
  );
}
