import React from 'react';
import { BarChart4 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>339 847</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>3O 509</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sentiment</CardTitle>
        </CardHeader>
        <CardContent>35% negative</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Addressed comments</CardTitle>
        </CardHeader>
        <CardContent>3.489</CardContent>
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
