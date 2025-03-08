"use client";
import { AppPrompt } from "@/components/app-prompt";
import { AppTopbar } from "@/components/app-topbar";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-stretch w-full h-full relative">
      <AppTopbar />
      <div className="flex flex-col flex-grow justify-center items-center text-center w-full h-full gap-10 absolute top-0 left-0 z-10 p-4">
        <Label className="text-[22px] md:text-[26px]">
          Hi there, how can I assist you today?
        </Label>
        <AppPrompt />
      </div>
    </div>
  );
}
