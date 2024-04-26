import Image from 'next/image';

export default function AppBar() {
  return (
    <div className="w-full h-[64px] bg-primary sticky top-0 flex justify-center items-center shadow-lg">
      <div className="flex items-center gap-4">
        <div className="relative bg-white rounded-full h-11 w-11">
          <Image
            src="/logo.svg"
            width={30}
            height={0}
            alt="logo"
            className="h-auto absolute-center ml-[2px]"
          />
        </div>

        <p className="text-white text-xl font-medium">CMOD</p>
      </div>
    </div>
  );
}
