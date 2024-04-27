import Link from "next/link";
import Image from "next/image"
import React from 'react';
import Header from "./(main)/[pageId]/components/header";
import SideNav from "./(main)/[pageId]/components/sideNav";

export default function NotFound(){
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          <div className="flex flex-1 flex-col items-center justify-center p-4 my-6">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Whoops we could not find this page.
            </h1>
            <Image
              src="/this-is-fine.gif"
              width={400}
              height={400}
              alt="this-is-fine-meme"
              className="object-contain"
            />
            <Link href="/dashboard"> Go back to Dashboard</Link>
          </div>
        </div>
        <SideNav />
      </div>
    );
}
