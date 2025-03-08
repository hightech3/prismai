"use client";

import * as React from "react";
import { ReduxProvider } from "@/redux";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ScrollProvider } from "./scroll-provider";
export function Providers({ children }: { children: React.ReactNode }) {

    return (
        <ReduxProvider>
            <SidebarProvider defaultOpen={true}>
                <ScrollProvider>
                    {children}
                </ScrollProvider>
            </SidebarProvider>
        </ReduxProvider>
    );

}
