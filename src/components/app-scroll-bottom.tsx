"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { useScroll } from "@/providers/scroll-provider";

export function AppScrollbottom() {

    const { handleButtonClick, isVisible } = useScroll();

    return (
        isVisible && (
            <Button
                variant={"ghost"}
                size={"icon"}
                onClick={handleButtonClick}
                className="absolute h-8 w-8 rounded-full bg-background border border-neutral-300 top-[-48px] justify-self-center z-50"
            >
                <ArrowDown size={20} />
            </Button>
        )
    );
}
