import Image from 'next/image';
import React from 'react';

export default function Page() {
  return (
    <div className="w-full h-full flex-center">
      <Image src="/empty.jpeg" height={1000} width={1000} alt="empty" className="h-full w-[80%]" />
    </div>
  );
}
