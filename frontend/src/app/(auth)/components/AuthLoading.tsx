type AuthLoadingProps = {
  text: string;
};

export function AuthLoading({ text }: AuthLoadingProps) {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-[25px]">
      <div className="flex flex-col gap-2 items-center">
        <div className="w-[250px] h-[6px] rounded-lg bg-slate-200 relative overflow-hidden">
          <div className="bg-primary loading-div absolute left-0 h-full" />
        </div>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}
