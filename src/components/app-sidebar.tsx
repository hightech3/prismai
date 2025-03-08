"use client";

import { ArrowLeftToLineIcon, ArrowRightToLineIcon, PlusIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Label } from "@/components/ui/label";
import { Logo } from "./icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { SideBarItems } from "@/conf";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { reset } from "@/redux/store/slices/responseSlice";

export function AppSidebar() {
  const { open, setOpen } = useSidebar();

  const router = useRouter();
  const dispatch = useDispatch() as AppDispatch;

  const handleNewChat = () => {
    dispatch(reset());
    router.push("/");
  }

  return (
    <Sidebar collapsible="icon" className="text-neutral-900 bg-neutral-100 border-l-0">
      <SidebarHeader>
        <SidebarMenu className={`${open ? "pl-4 pr-4" : ""}`}>
          <Link href={"/"} passHref>
            <SidebarMenuItem
              className={`flex justify-between items-center`}
              onClick={handleNewChat}
            >
              {open && <Logo />}
              <Button
                variant="outline"
                onClick={() => setOpen(!open)}
                className={`border-none bg-transparent hover:bg-neutral-200 rounded-full h-8 w-8 ${!open && 'ml-4 mt-8'}`}
              >
                {open ? (
                  <ArrowLeftToLineIcon className="w-4 h-4" />
                ) : (
                  <ArrowRightToLineIcon className="w-4 h-4" />
                )}
              </Button>
            </SidebarMenuItem>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuItem className="relative flex h-[50px] items-center justify-center mt-6"
                  onClick={handleNewChat}
                >
                  <div className={`flex ${open ? 'w-full' : 'w-9'} h-9 justify-between items-center rounded-lg bg-neutral-200 p-2 cursor-pointer hover:shadow-sm`}>
                    {open && <h2 className={`text-[14px]`}>New query</h2>}
                    <SidebarMenuButton
                      className="justify-center bg-neutral-200 rounded-lg h-9 w-7 hover:bg-neutral-200"
                    >
                      <PlusIcon className="w-full fill-black" />
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              </TooltipTrigger>
              <TooltipContent side="right" className={`${open ? 'hidden' : 'flex'} bg-[#333] text-background`}>
                <p>New query</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarItems.map((item, index) => (
                item.isActive ? (
                  <Link key={index} href={item.url}>
                    <SidebarMenuItem
                      className={`h-12 ${open ? "px-4" : "pl-6"} py-3 cursor-pointer hover:bg-sidebar-accent flex items-center`}
                    >
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                ) : (
                  <SidebarMenuItem
                    key={index}
                    className={`h-12 ${open ? "px-4" : "pl-6"} py-3 cursor-pointer flex items-center`}
                  >
                    <SidebarMenuButton disabled>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator className="bg-neutral-200" />
      <SidebarFooter className={`py-3 ${open ? "pl-4 pr-4" : "pl-6"}`}>
        <SidebarMenu className="w-full">
          <SidebarMenuItem className="w-full flex gap-2 items-center">
            <Button className="rounded-full size-8 font-medium text-md flex justify-center">
              <span>BC</span>
            </Button>
            {open && (
              <Label className="text-lg">
                Bo Cai
              </Label>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
