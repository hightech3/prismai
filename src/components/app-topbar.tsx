import * as React from "react";

import { Button } from "@/components/ui/button";
import { BookmarkIcon, PanelRightIcon } from "lucide-react";

export function AppTopbar() {

  return (
    <div className="flex flex-row w-full p-2">
      <div className="flex flex-row justify-end gap-2 w-full cursor-pointer items-center">
        <Button variant={"outline"} size={"icon"} className="text-neutral-900 h-8">
          <BookmarkIcon />
        </Button>
        <Button variant={"outline"} className="text-neutral-900 h-8">
          <span className="text-[12px] md:text-[14px]">Share</span>
        </Button>
        <Button variant={"ghost"} className="text-neutral-900 h-8"
        >
          <PanelRightIcon />
        </Button>
      </div>
    </div>
  );
}
